package lib

type APIResponse struct {
	Success bool   `json:"success"`
	Code    int    `json:"code"`
	Error   string `json:"error"`
	Message string `json:"message"`
}
