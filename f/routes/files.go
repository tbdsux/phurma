package routes

import (
	"errors"
	"fmt"
	"io"
	"net/url"

	"github.com/TheBoringDude/phurma/f/lib"
	"github.com/TheBoringDude/phurma/f/types"
	"github.com/gofiber/fiber/v2"
)

// Route handler for getting form response files, downloading and fetching.
var FormFilesRoute = func(c *fiber.Ctx) error {
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
}
