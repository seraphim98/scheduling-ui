import Person from "./Person"
export default class Event {
    constructor(id : string, name: string, startTime: string, endTime: string, people: Array<Person>) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.people = people;
    }
    public id: string;
    public name: string;
    public startTime: string;
    public endTime: string;
    public people: Array<Person>;
}