import Recipe from "../models/Recipe";

export default interface UpsertRecipeProps {
    visible: boolean;
    recipes: Array<Recipe>;
    setVisible:  React.Dispatch<React.SetStateAction<boolean>>;
    selectedRecipe: Recipe;
    setRecipes: React.Dispatch<React.SetStateAction<Array<Recipe>>>;
}