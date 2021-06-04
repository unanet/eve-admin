package models

type DashboardMetricsEntryMetadata struct {
	Name    string  `json:"name"`
	Link    string  `json:"link"`
	Icon    string  `json:"icon"`
	Color   *string `json:"color,omitempty"`
	APILink string  `json:"-"`
}
type DashboardMetricsEntry struct {
	Count     int                           `json:"count"`
	Metadata  DashboardMetricsEntryMetadata `json:"metadata"`
	SortOrder int                           `json:-`
}
