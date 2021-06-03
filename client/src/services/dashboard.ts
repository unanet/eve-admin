import {APIResponse, apiService, APIType} from "@/utils/APIType";

const dashboardService = new class DashboardService {
    getInformation() {
        return apiService.getRequest(APIType.EVE, "/dashboard/metrics").then((response: APIResponse) => {
            return response.data
        }).catch((err: any) => {
            return err;
        });
    }
}
export {dashboardService}
