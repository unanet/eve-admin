export interface IMetadataHistory {
    metadata_id: number
    description: string
    value: Object,
    created: string
    created_by: string
    deleted: string | null
    deleted_by: string | null
}
