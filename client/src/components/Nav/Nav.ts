import {defineComponent} from "vue";

export default defineComponent({
    name: "Navbar",
    data() {
        return {
            modelItems: [
                {
                    name: "Artifact",
                    url: "/admin/artifact"
                },
                {
                    name: "Cluster",
                    url: "/admin/cluster"
                },
                {
                    name: "Definition",
                    url: "/admin/definition"
                },
                {
                    name: "Environment",
                    url: "/admin/environment"
                },
                {
                    name: "Feed",
                    url: "/admin/feed"
                },
                {
                    name: "Job",
                    url: "/admin/job"
                },
                {
                    name: "Metadata",
                    url: "/admin/metadata"
                },
                {
                    name: "Namespace",
                    url: "/admin/namespace"
                },
                {
                    name: "Service",
                    url: "/admin/service"
                },
                {
                    name: "Definition Type",
                    url: '/admin/definition-type',
                },
                {
                    name: "Deployment Cron",
                    url: '/admin/deployment-cron',
                }
            ],
            mappingItems: [
                {
                    name: "Definition Job Map",
                    url: '/admin/definition-job-map',
                },
                {
                    name: "Definition Service Map",
                    url: '/admin/definition-service-map',
                },
                {
                    name: "Environment Feed Map",
                    url: '/admin/environment-feed-map',
                },
                {
                    name: "Metadata Job Map",
                    url: '/admin/metadata-job-map',
                },
                {
                    name: "Metadata Service Map",
                    url: '/admin/metadata-service-map',
                },
            ],
            auditItems: [
                {
                    name: "Metadata History",
                    url: '/admin/metadata-history',
                },
            ]
        };
    },
});
