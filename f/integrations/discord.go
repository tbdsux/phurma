package integrations

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/TheBoringDude/phurma/f/lib"
	"github.com/TheBoringDude/phurma/f/types"
	"github.com/deta/deta-go/deta"
)

type DiscordIntegration struct {
	Key        string `json:"key"`
	Enabled    bool   `json:"enabled"`
	WebhookUrl string `json:"webhookUrl"`
}

func GetDiscordIntegration(formId string) *DiscordIntegration {
	db, _ := lib.FormsDiscordIntegration()

	i := &DiscordIntegration{}

	if err := db.Get(formId, i); err == deta.ErrNotFound {
		// no data means no integration set
		return nil
	} else if err != nil {
		// TODO: handle the error in here
		fmt.Println(err)
	}

	return i
}

type Webhook struct {
	Embeds []map[string]interface{} `json:"embeds"`
}

func DiscordSendWebhook(webhookUrl string, responseKey string, response types.Response, form types.Form) error {
	appHost := os.Getenv("DETA_SPACE_APP_HOSTNAME")

	url := webhookUrl
	if !strings.HasSuffix(webhookUrl, "?wait=true") {
		url += "?wait=true"
	}

	fields := []map[string]string{}

	for k, v := range response.Content {
		fields = append(fields, map[string]string{
			"name":  k,
			"value": fmt.Sprintf("%v", v),
		})
	}

	for k, v := range response.Files {
		values := []string{}
		for _, i := range v {
			values = append(values, fmt.Sprintf("[%s](https://%s/f/files/%s/%s/%s/%s/%s)", i.Filename, appHost, form.Key, responseKey, k, i.FileId, i.Filename))
		}

		fields = append(fields, map[string]string{
			"name":  k,
			"value": strings.Join(values, "\n"),
		})
	}

	r := Webhook{
		Embeds: []map[string]interface{}{
			{
				"title":       "New response!",
				"description": "You have received a new submission from your form.",
				"color":       16007006,
				"fields":      fields,
				"author": map[string]string{
					"name":     form.Name,
					"url":      "https://github.com/TheBoringDude/phurma",
					"icon_url": "https://s3.eu-central-1.amazonaws.com/deta-app-icons.144798365827.eu-central-1/2504e069-58be-4384-a49b-695f86febe62/icons/icon",
				},
				"footer": map[string]string{
					"text": form.Name,
				},
				"timestamp": time.Now().Format(time.RFC3339),
			},
		},
	}

	body, _ := json.Marshal(r)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	return err
}

// Handle sending discord embeds to the webhook url if exists. Will skip
// if integration does not exist, is disabled or webhookUrl is empty.
func HandleDiscord(formId string, responseKey string, response types.Response, form types.Form) {
	discord := GetDiscordIntegration(formId)
	if discord == nil {
		// integration does not exist, so we skip
		return
	}

	// integration is disabled or empty discord webhook url
	if !discord.Enabled || discord.WebhookUrl == "" {
		return
	}

	if err := DiscordSendWebhook(discord.WebhookUrl, responseKey, response, form); err != nil {
		// TODO: should handle errors
		fmt.Println(err)
	}
}
