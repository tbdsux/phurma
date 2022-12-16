package integrations

import (
	"github.com/TheBoringDude/phurma/f/types"
)

func Handle(formId string, responseKey string, response types.Response, form types.Form) {
	// handle discord integration
	HandleDiscord(formId, responseKey, response, form)

}
