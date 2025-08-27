import Recipe from "../models/Recipe";

export default interface ShoppingListProps {
    visible: boolean;
    selectedRecipes: Array<Recipe>;
    setVisible:  React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedRecipes: React.Dispatch<React.SetStateAction<Array<Recipe>>>
}