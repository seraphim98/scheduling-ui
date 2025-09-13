export default class UpsertRequest {
    constructor(id : string, data: string) {
        this.id = id;
        this.data = data;
    }
    public id: string;
    public data: string;

    public ingredients?: Array<string>;
}