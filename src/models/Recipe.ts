export default class Recipe {
    constructor(id : string, name: string, type: string, ingredients?: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.ingredients = ingredients?.split(",");
    }
    public id: string;
    public name: string;
    public type: string;

    public ingredients?: Array<string>;
}

export interface RecipeData {
    id: string;
    name: string;
    type: string;
    ingredients: string;
}