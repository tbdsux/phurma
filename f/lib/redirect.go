package lib

import "os"

var IS_DEVELOPMENT = os.Getenv("DEVELOPMNET") == "true"

func RedirectFilesNotAllowed() string {
	return "/files-not-allowed"
}

func RedirectThankYou() string {
	return "/thank-you"
}
