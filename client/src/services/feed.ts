import {idField, IFeed, IService} from "@/models";
import {BaseService} from "./";
import {FormFieldType} from "@/components/Form/FormProps";

const feedService = new class extends BaseService {
    baseUrl = "/feeds"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            placeholder: "generic-int",
            type: FormFieldType.text,
        },
        promotion_order: {
            title: "Promotion Order",
            placeholder: 0,
            type: FormFieldType.number,
        },
        feed_type: {
            title: "Feed Type",
            placeholder: "generic",
            type: FormFieldType.text,
        },
        alias: {
            title: "Alias",
            placeholder: "int",
            type: FormFieldType.text,
        }
    }

    getMappings() {
        return this.get().then(models => {
            return Object.fromEntries((models as IFeed[]).map((item: IFeed) => [item.id, item.name]))
        });
    }
}

export {feedService}
