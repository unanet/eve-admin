package models

import (
	"time"
)

type LayerResponse struct {
	Model 		interface{}	  `json:"model"`
	Layers      []LayerMap    `json:"layers"`
	EndResult   interface{}   `json:"end_result"`
}

type LayerMap struct {
	Description   string    `json:"description"`
	EnvironmentID int       `json:"environment_id"`
	ArtifactID    int       `json:"artifact_id"`
	NamespaceID   int       `json:"namespace_id"`
	ClusterID     int       `json:"cluster_id"`
	StackingOrder int       `json:"stacking_order"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	DefinitionID int `json:"id,omitempty"`
	ServiceID    int `json:"service_id,omitempty"`
	JobID        int `json:"job_id,omitempty"`
	MetadataID   int `json:"metadata_id,omitempty"`

	Metadata interface{} `json:"metadata,omitempty"`
	Definition interface{} `json:"definition,omitempty"`
}
