package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/url"
	"strings"
	"time"

	"github.com/TheBoringDude/phurma/f/lib"
	"github.com/TheBoringDude/phurma/f/types"
	"github.com/deta/deta-go/service/drive"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/segmentio/ksuid"
)

func main() {
	app := fiber.New()

	app.Use(cors.New())

	// handling file downloads from response
	app.Get("/files/:formId/:responseId/:fileKey/:fileId/:filename", func(c *fiber.Ctx) error {
		formId := c.Params("formId")
		responseId := c.Params("responseId")
		fileId := c.Params("fileId")
		fileKey := c.Params("fileKey")

		filename, err := url.QueryUnescape(c.Params("filename"))
		if err != nil {
			return c.Status(400).JSON(lib.APIResponse{
				Error:   err.Error(),
				Message: "Error unescaping filename.",
				Code:    400,
				Success: false,
			})
		}

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
			// TODO: handle 404 not found
			return c.Status(500).JSON(lib.APIResponse{
				Error:   err.Error(),
				Message: "Failed to get form.",
				Code:    500,
				Success: false,
			})
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

		// get response
		response := types.Response{}
		if err := formDb.Get(responseId, &response); err != nil {
			// TODO: handle 404 not found
			return c.Status(500).JSON(lib.APIResponse{
				Error:   err.Error(),
				Message: "Failed to get form.",
				Code:    500,
				Success: false,
			})
		}

		v, ok := response.Files[fileKey]
		if !ok {
			return c.Status(400).JSON(lib.APIResponse{
				Error:   errors.New("invalid file key").Error(),
				Message: "File key mismatch",
				Code:    400,
				Success: false,
			})
		}

		_fileid := ""
		_filename := ""
		_contenttype := ""

		for _, k := range v {
			if k.FileId == fileId && k.Filename == filename {
				_fileid = k.FileId
				_filename = k.Filename
				_contenttype = k.ContentType
			}
		}

		if _fileid == "" || _filename == "" || _contenttype == "" {
			return c.Status(400).JSON(lib.APIResponse{
				Error:   errors.New("mismatch file names").Error(),
				Message: "File names mismatch.",
				Code:    400,
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

		file, err := formDrive.Get(fmt.Sprintf("%s_%s", _fileid, _filename))
		if err != nil {
			return c.Status(500).JSON(lib.APIResponse{
				Error:   err.Error(),
				Message: "Error getting file from drive.",
				Code:    500,
				Success: false,
			})
		}
		defer file.Close()

		content, _ := io.ReadAll(file)

		c.Set("Content-Type", _contenttype)
		c.Set("Content-Length", fmt.Sprintf("%d", len(content)))
		return c.Send(content)
	})

	app.Post("/:formid", func(c *fiber.Ctx) error {
		formId := c.Params("formid")

		fmt.Println(c.GetReqHeaders())

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

		formDb.Put(response)

		// reidrect to thank you page
		if projectForm.RedirectUrl != "" {
			return c.Redirect(projectForm.RedirectUrl)
		}

		return c.Redirect(lib.RedirectThankYou())
	})

	log.Fatal(app.Listen(":8080"))
}
