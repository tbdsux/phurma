package main

import (
	"fmt"
	"log"
	"os"

	"github.com/TheBoringDude/phurma/f/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	app.Use(cors.New())

	// handling file downloads from response
	app.Get("/files/:formId/:responseId/:fileKey/:fileId/:filename", routes.FormFilesRoute)

	// handling form post submissions
	app.Post("/:formid", routes.FormParse)

	log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))
}
