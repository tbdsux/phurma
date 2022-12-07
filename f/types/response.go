package types

type ResponseFile struct {
	Filename    string `json:"filename"`
	FileId      string `json:"file_id"`
	ContentType string `json:"content_type"`
}

type Response struct {
	Key       string                     `json:"key,omitempty"`
	Content   map[string]interface{}     `json:"content"`
	Files     map[string][]*ResponseFile `json:"files"`
	CreatedAt int64                      `json:"created_at"`
}
