export default class UpsertRequest {
    constructor(data: string, id?: string,) {
        this.id = id;
        this.data = data;
    }
    public id?: string;
    public data: string;

    public ingredients?: Array<string>; //What is this
}