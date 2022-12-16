package lib

import (
	"fmt"

	"github.com/deta/deta-go/deta"
	"github.com/deta/deta-go/service/base"
	"github.com/deta/deta-go/service/drive"
)

func GetFilesDrive(formId string) (*drive.Drive, error) {
	deta, err := deta.New()
	if err != nil {
		return nil, err
	}

	return drive.New(deta, fmt.Sprintf("form_%s", formId))
}

func FormsBase() (*base.Base, error) {
	deta, err := deta.New()
	if err != nil {
		return nil, err
	}

	return base.New(deta, "ProjectForms")
}

func FormsDiscordIntegration() (*base.Base, error) {
	deta, err := deta.New()
	if err != nil {
		return nil, err
	}

	return base.New(deta, "FormsDiscordIntegration")
}

func GetFormDB(formId string) (*base.Base, error) {
	deta, err := deta.New()
	if err != nil {
		return nil, err
	}

	return base.New(deta, fmt.Sprintf("form_%s", formId))
}
