import {defineComponent} from "vue";
import NavItem from "./NavItem/index.vue"

interface INavItem {
    name: string
    url: string
    icon?: string
    children: INavItem[]
}

export {INavItem}

export default defineComponent({
    name: "Navbar",
    components: {
        NavItem
    },
    data() {
        return {
            items: [
                {
                    name: "Dashboard",
                    icon: "fas fa-globe",
                    url: "/admin/dashboard"
                },
                {
                    name: "Models",
                    icon: "fas fa-list",
                    url: "/admin/models",
                    children: [
                        {
                            name: "Artifact",
                            url: "/admin/models/artifact"
                        },
                        {
                            name: "Cluster",
                            url: "/admin/models/cluster"
                        },
                        {
                            name: "Definition",
                            url: "/admin/models/definition"
                        },
                        {
                            name: "Environment",
                            url: "/admin/models/environment"
                        },
                        {
                            name: "Feed",
                            url: "/admin/models/feed"
                        },
                        {
                            name: "Job",
                            url: "/admin/models/job"
                        },
                        {
                            name: "Metadata",
                            url: "/admin/models/metadata"
                        },
                        {
                            name: "Namespace",
                            url: "/admin/models/namespace"
                        },
                        {
                            name: "Service",
                            url: "/admin/models/service"
                        },
                        {
                            name: "Definition Type",
                            url: '/admin/models/definition-type',
                        },
                        {
                            name: "Deployment Cron",
                            url: '/admin/models/deployment-cron',
                        }
                    ]
                },
                {
                    name: "Mappings",
                    icon: "fas fa-map-marked",
                    url: "/admin/mapping",
                    children: [
                        {
                            name: "Definition Job Map",
                            icon: "far fa-map",
                            url: '/admin/mapping/definition-job-map',
                        },
                        {
                            name: "Definition Service Map",
                            icon: "far fa-map",
                            url: '/admin/mapping/definition-service-map',
                        },
                        {
                            name: "Environment Feed Map",
                            icon: "far fa-map",
                            url: '/admin/mapping/environment-feed-map',
                        },
                        {
                            name: "Metadata Job Map",
                            icon: "far fa-map",
                            url: '/admin/mapping/metadata-job-map',
                        },
                        {
                            name: "Metadata Service Map",
                            icon: "far fa-map",
                            url: '/admin/mapping/metadata-service-map',
                        },
                    ],
                },
                {
                    name: "Audit",
                    icon: "fas fa-search",
                    url: "/admin/audit",
                    children: [
                        {
                            name: "Metadata History",
                            icon: "fas fa-history",
                            url: '/admin/audit/metadata-history',
                        },
                    ]
                },
            ] as INavItem[]
        };
    },
});
