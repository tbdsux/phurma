package types

type Form struct {
	Name        string `json:"name"`
	Key         string `json:"key"`
	CreatedAt   int    `json:"created_at"`
	ProjectKey  string `json:"projectKey"`
	AllowFiles  bool   `json:"allowFiles"`
	RedirectUrl string `json:"redirectUrl"`
}
