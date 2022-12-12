package lib

import "os"

var IS_DEVELOPMENT = os.Getenv("DEVELOPMNET") == "true"

func RedirectFilesNotAllowed() string {
	if IS_DEVELOPMENT {
		return "http://localhost:3000/files-not-allowed"
	}

	return "/files-not-allowed"
}

func RedirectThankYou() string {
	if IS_DEVELOPMENT {
		return "http://localhost:3000/thank-you"
	}

	return "/thank-you"
}
