package api
//
//import (
//	"github.com/go-chi/chi"
//	"gitlab.unanet.io/devops/eve/internal/service/crud"
//	"net/http"
//
//	"github.com/go-chi/render"
//)
//
//type CloudAdminController struct {
//	manager *crud.Manager
//}
//
//func NewCloudAdminController(manager *crud.Manager) *CloudAdminController {
//	return &CloudAdminController{
//		manager: manager,
//	}
//}
//
//func (c CloudAdminController) Setup(r chi.Router) {
//	r.Get("/cloud-admin/dashboard", c.dashboard)
//}
//
//func (c CloudAdminController) dashboard(w http.ResponseWriter, r *http.Request) {
//
//	dashboardInformation, err := c.manager.Dashboard(r.Context())
//
//	if err != nil {
//		render.Respond(w, r, err)
//		return
//	}
//
//	type DashboardInformationEntry struct {
//		Count int `json:"count"`
//		Label string `json:"label"`
//	}
//
//	var returnData = []DashboardInformationEntry {
//		{
//			Count: dashboardInformation.ArtifactCount,
//			Label: "Artifacts",
//		},
//		{
//			Count: dashboardInformation.ClusterCount,
//			Label: "Clusters",
//		},
//		{
//			Count: dashboardInformation.EnvironmentCount,
//			Label: "Environments",
//		},
//		{
//			Count: dashboardInformation.FeedCount,
//			Label: "Feeds",
//		},
//		{
//			Count: dashboardInformation.MetadataCount,
//			Label: "Metadata",
//		},
//		{
//			Count: dashboardInformation.NamespaceCount,
//			Label: "Namespaces",
//		},
//		{
//			Count: dashboardInformation.ServiceCount,
//			Label: "Services",
//		},
//		{
//			Count: dashboardInformation.JobCount,
//			Label: "Jobs",
//		},
//	}
//
//	render.Respond(w, r, returnData)
//}