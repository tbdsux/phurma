package main

import (
	"encoding/json"
	"fmt"
	"log"
	"mime/multipart"
	"net/url"
	"strings"
	"time"

	"github.com/TheBoringDude/phurma/f/lib"
	"github.com/TheBoringDude/phurma/f/types"
	"github.com/deta/deta-go/service/drive"
	"github.com/gofiber/fiber/v2"
	"github.com/segmentio/ksuid"
)

func main() {
	app := fiber.New()

	app.Post("/:formid", func(c *fiber.Ctx) error {
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

		return c.JSON(fiber.Map{
			"form":  body,
			"files": files,
		})

	})

	log.Fatal(app.Listen(":8080"))
}
