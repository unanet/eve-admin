import {FormFieldType} from "@/components/Form/FormProps";
import {IArtifact, idField, IFeed} from "@/models";
import {BaseService} from "./";

const artifactService = new class extends BaseService {
    baseUrl = "/artifacts"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            type: FormFieldType.text,
            placeholder: "unanet-proxy"
        },
        feed_type: {
            title: "Feed Type",
            type: FormFieldType.text,
            placeholder: "docker"
        },
        provider_group: {
            title: "Provider Group",
            type: FormFieldType.text,
            placeholder: "unanet"
        },
        image_tag: {
            title: "Image Tag",
            type: FormFieldType.text,
            placeholder: "$version"
        },
        service_port: {
            title: "Service Port",
            type: FormFieldType.number,
            placeholder: 8080
        },
        metrics_port: {
            title: "Metrics Port",
            type: FormFieldType.number,
            placeholder: 0
        }
    }

    getMappings() {
        return this.get().then(models => {
            return Object.fromEntries((models as IArtifact[]).map((item: IArtifact) => [item.id, item.name]))
        });
    }

}

export {artifactService}
