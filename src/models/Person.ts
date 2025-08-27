export default class Person {
    constructor(id : string, firstName: string, lastName: string, eventNames: Array<string>) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.eventNames = eventNames;
    }
    public id: string;
    public firstName: string;
    public lastName: string;
    public eventNames: Array<string>;
}