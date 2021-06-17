export {BaseService} from './base'

export {clusterService} from './cluster';
export {artifactService} from './artifact';
export {definitionService} from './definition';
export {definitionTypeService} from './definition-type'
export {environmentService} from './environment';
export {feedService} from './feed';
export {jobService} from './job';
export {metadataService} from './metadata';
export {namespaceService} from './namespace';
export {serviceService} from './service';
export {deploymentCronService} from './deployment-cron';

import {clusterService} from "@/services/cluster";
import {artifactService} from "@/services/artifact";
import {environmentService} from "@/services/environment";
import {jobService} from "@/services/job";
import {namespaceService} from "@/services/namespace";
import {serviceService} from "@/services/service";

const servicesMap = {
    "cluster": clusterService,
    "artifact": artifactService,
    "job": jobService,
    "environment": environmentService,
    "namespace": namespaceService,
    "service": serviceService
}

export {servicesMap}

// Mappings
export {definitionJobMapService} from './definition-job-map';
export {definitionServiceMapService} from './definition-service-map';
export {environmentFeedMapService} from './environment-feed-map';
export {metadataJobMapService} from './metadata-job-map';
export {metadataServiceMapService} from './metadata-service-map';

// Auditing
export {metadataHistoryService} from './metadata-history';

// Extra helper models
export {dashboardService} from './dashboard';
