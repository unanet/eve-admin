import {Dashboard} from "@/views";

import {
    ArtifactTable,
    ClusterTable,
    DefinitionTable,
    DefinitionJobMapTable,
    DefinitionServiceMapTable,
    DefinitionTypeTable,
    DeploymentCronTable,
    EnvironmentTable,
    EnvironmentFeedMapTable,
    FeedTable,
    JobTable,
    MetadataTable,
    MetadataHistoryTable,
    MetadataJobMapTable,
    MetadataServiceMapTable,
    NamespaceTable,
    ServiceTable,
} from "@/views/TableViews";

import ServiceMetadataMapping from "@/views/Visualization/ServiceMetadataMapping/index.vue";

import {Roles} from "@/config"

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
        path: '/admin/namespace',
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
        path: '/admin/environment',
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
        path: '/admin/definition',
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
        path: '/admin/metadata',
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
        path: '/admin/artifact',
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
        path: '/admin/service',
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
        path: '/admin/cluster',
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
        path: '/admin/feed',
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
        path: '/admin/job',
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
        path: '/admin/definition-job-map',
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
        path: '/admin/definition-service-map',
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
        path: '/admin/definition-type',
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
        path: '/admin/environment-feed-map',
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
        path: '/admin/metadata-job-map',
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
        path: '/admin/metadata-service-map',
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
        path: '/admin/metadata-history',
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
        path: '/admin/deployment-cron',
        name: "Deployment Cron",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
    {
        component: ServiceMetadataMapping,
        path: '/admin/service/:id/metadata/layers',
        name: "Metadata Layering",
        meta: {
            roles: {
                view: [Roles.Admin],
                edit: [Roles.Admin]
            }
        }
    },
]
