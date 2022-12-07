package lib

func ParseKValues[T comparable](obj map[string][]T) map[string]interface{} {
	out := map[string]interface{}{}

	for k, v := range obj {
		if len(v) > 0 {
			out[k] = v[0]
		}
	}

	return out
}
