package routes

import (
	"encoding/json"
	"fmt"
	"mime/multipart"
	"net/url"
	"strings"
	"time"

	"github.com/TheBoringDude/phurma/f/integrations"
	"github.com/TheBoringDude/phurma/f/lib"
	"github.com/TheBoringDude/phurma/f/types"
	"github.com/deta/deta-go/service/drive"
	"github.com/gofiber/fiber/v2"
	"github.com/segmentio/ksuid"
)

// Route handler for form submissions.
var FormParse = func(c *fiber.Ctx) error {
	formId := c.Params("formid")

	formsBase, err := lib.FormsBase()
	if err != nil {
		return c.Status(500).JSON(lib.APIResponse{
			Error:   err.Error(),
			Message: "Forms Base failed to initialize",
			Code:    500,
			Success: false,
		})
	}

	projectForm := types.Form{}

	if err := formsBase.Get(formId, &projectForm); err != nil {
		// TODO: improve response or change
		// to prevent leaking of existing forms,
		// just send a status ok
		return c.SendStatus(200)
	}

	contentType := c.Get("Content-Type")

	body := map[string]interface{}{}
	files := map[string][]*multipart.FileHeader{}

	if strings.HasPrefix(contentType, "multipart/form-data") {
		// parse multipart/form-data
		form, err := c.MultipartForm()
		if err != nil {
			return c.Status(400).JSON(lib.APIResponse{
				Error:   err.Error(),
				Message: "Error parsing multipart/form-data request body.",
				Code:    400,
				Success: false,
			})
		}

		body = lib.ParseKValues(form.Value)
		files = form.File

		if len(files) > 0 {
			// check if project allows files
			if !projectForm.AllowFiles {
				return c.Redirect(lib.RedirectFilesNotAllowed())
			}
		}
	}

	if contentType == "application/x-www-form-urlencoded" {
		// parse form encoded
		values, err := url.ParseQuery(string(c.Body()))
		if err != nil {
			return c.Status(400).JSON(lib.APIResponse{
				Error:   err.Error(),
				Message: "Error parsing application/x-www-form-urlencoded request body.",
				Code:    400,
				Success: false,
			})
		}

		body = lib.ParseKValues(values)
	}

	if contentType == "application/json" {
		if err := json.Unmarshal(c.Body(), &body); err != nil {
			return c.Status(400).JSON(lib.APIResponse{
				Error:   err.Error(),
				Message: "Error parsing application/json request body.",
				Code:    400,
				Success: false,
			})
		}
	}

	if len(body) == 0 && len(files) == 0 {
		// TODO: handle missing body or invalid content-types
		return c.SendStatus(200)
	}

	formDb, err := lib.GetFormDB(projectForm.Key)
	if err != nil {
		return c.Status(500).JSON(lib.APIResponse{
			Error:   err.Error(),
			Message: "Forms Base failed to initialize",
			Code:    500,
			Success: false,
		})
	}

	formDrive, err := lib.GetFilesDrive(projectForm.Key)
	if err != nil {
		return c.Status(500).JSON(lib.APIResponse{
			Error:   err.Error(),
			Message: "Forms Base failed to initialize",
			Code:    500,
			Success: false,
		})
	}

	response := types.Response{
		Content:   body,
		Files:     map[string][]*types.ResponseFile{},
		CreatedAt: time.Now().Unix(),
	}

	if len(files) > 0 {
		for key, files := range files {
			rfiles := []*types.ResponseFile{}

			for _, v := range files {
				id := ksuid.New().String()

				// upload file to drive
				buffer, err := v.Open()
				if err != nil {
					return c.Status(500).JSON(lib.APIResponse{
						Error:   err.Error(),
						Message: "Failed to read file for upload",
						Code:    500,
						Success: false,
					})
				}
				defer buffer.Close()

				fileContentType := v.Header["Content-Type"][0]

				formDrive.Put(&drive.PutInput{
					Name:        fmt.Sprintf("%s_%s", id, v.Filename),
					Body:        buffer,
					ContentType: fileContentType,
				})

				rfiles = append(rfiles, &types.ResponseFile{
					FileId:      id,
					Filename:    v.Filename,
					ContentType: fileContentType,
				})
			}

			response.Files[key] = rfiles
		}
	}

	key, _ := formDb.Put(response)

	// handle integrations
	integrations.Handle(formId, key, response, projectForm)

	// reidrect to thank you page
	if projectForm.RedirectUrl != "" {
		return c.Redirect(projectForm.RedirectUrl)
	}

	return c.Redirect(lib.RedirectThankYou())
}
