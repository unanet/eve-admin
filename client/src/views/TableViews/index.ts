/*
    IT IS IMPORTANT THAT YOU NOTICE THE IMPORT .VUE FILE INSTEAD OF `./artifact/artifact`.
    If you import it the IDE might try to autocomplete it and grab the ts file instead of the .vue file!
 */

// Tables
import ArtifactTable from "./ArtifactTable/index.vue";
import ClusterTable from "./ClusterTable/index.vue";
import DefinitionTable from "./DefinitionTable/index.vue";
import DefinitionJobMapTable from "./DefinitionJobMapTable/index.vue";
import DefinitionServiceMapTable from "./DefinitionSeviceMapTable/index.vue";
import DefinitionTypeTable from "./DefinitionTypeTable/index.vue";
import EnvironmentTable from "./EnvironmentTable/index.vue";
import EnvironmentFeedMapTable from "./EnvironmentFeedMapTable/index.vue";
import FeedTable from "./FeedTable/index.vue";
import JobTable from "./JobTable/index.vue";
import MetadataTable from "./MetadataTable/index.vue";
import MetadataHistoryTable from "./MetadataHistoryTable/index.vue";
import MetadataJobMapTable from "./MetadataJobMapTable/index.vue";
import MetadataServiceMapTable from "./MetadataServiceMapTable/index.vue";
import NamespaceTable from "./NamespaceTable/index.vue";
import ServiceTable from "./ServiceTable/index.vue";
import DeploymentCronTable from "./DeploymentCronTable/index.vue";

export {
    ArtifactTable,
    ClusterTable,
    DefinitionTable,
    DefinitionJobMapTable,
    DefinitionServiceMapTable,
    DefinitionTypeTable,
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
    DeploymentCronTable
}
