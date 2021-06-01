import {apiService, APIType} from "@/utils/APIType";

const dashboardService = new class DashboardService {
    getInformation() {
        return apiService.getRequest(APIType.EVE, "/dashboard/metrics").then(response => {
            return response.data
        }).catch(err => {
            return err;
        });
    }
}
export {dashboardService}
