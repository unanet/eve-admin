import {Dashboard} from "@/views";

import {
    ArtifactTable,
    ClusterTable,
    DefinitionJobMapTable,
    DefinitionServiceMapTable,
    DefinitionTable,
    DefinitionTypeTable,
    DeploymentCronTable,
    EnvironmentFeedMapTable,
    EnvironmentTable,
    FeedTable,
    JobTable,
    MetadataHistoryTable,
    MetadataJobMapTable,
    MetadataServiceMapTable,
    MetadataTable,
    NamespaceTable,
    ServiceTable,
} from "@/views/TableViews";

import {Roles} from "@/config"

import LayerVisualizer from "@/views/Visualization/index.vue";

export default [
    {
        path: '/admin/dashboard',
        component: Dashboard,
        name: 'Dashboard',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        path: '/admin/models/namespace',
        component: NamespaceTable,
        name: 'Namespace',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        path: '/admin/models/environment',
        component: EnvironmentTable,
        name: 'Environment',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        path: '/admin/models/definition',
        component: DefinitionTable,
        name: 'Definition',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        path: '/admin/models/metadata',
        component: MetadataTable,
        name: 'Metadata',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        path: '/admin/models/artifact',
        component: ArtifactTable,
        name: 'Artifact',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        path: '/admin/models/service',
        component: ServiceTable,
        name: 'Service',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        path: '/admin/models/cluster',
        component: ClusterTable,
        name: 'Cluster',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },

    {
        path: '/admin/models/feed',
        component: FeedTable,
        name: 'Feed',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        path: '/admin/models/job',
        component: JobTable,
        name: 'Job',
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: DefinitionJobMapTable,
        path: '/admin/mapping/definition-job-map',
        name: "Definition Job Map",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: DefinitionServiceMapTable,
        path: '/admin/mapping/definition-service-map',
        name: "Definition Service Map",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: DefinitionTypeTable,
        path: '/admin/models/definition-type',
        name: "Definition Type",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: EnvironmentFeedMapTable,
        path: '/admin/mapping/environment-feed-map',
        name: "Environment Feed Map",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: MetadataJobMapTable,
        path: '/admin/mapping/metadata-job-map',
        name: "Metadata Job Map",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: MetadataServiceMapTable,
        path: '/admin/mapping/metadata-service-map',
        name: "Metadata Service Map",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: MetadataHistoryTable,
        path: '/admin/audit/metadata-history',
        name: "Metadata History",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: DeploymentCronTable,
        path: '/admin/models/deployment-cron',
        name: "Deployment Cron",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: LayerVisualizer,
        path: '/admin/models/:model/:id/:type/layers',
        name: "Layer Visualization",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    }
]
