import { Button, Table, TableProps, Header, SpaceBetween } from "@cloudscape-design/components";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {RecipeData} from "../../models/Recipe";
import Recipe from "../../models/Recipe";
import UpsertRecipe from "./Upsert";
import ShoppingList from "./ShoppingList";

export default function ViewRecipes() {
    const [recipes, setRecipes] = useState<Array<Recipe>>([]);
    const [upsertFormVisible, setUpsertFormVisible] = useState(false);
    const [shoppingListVisible, setShoppingListVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Array<Recipe>>([]);
    const getData = useCallback(async () => {
        const { data } = await axios.get("https://localhost:7071/api/Recipes");
        setRecipes(data.map((x: RecipeData) => new Recipe(x.id, x.name, x.type, x.ingredients)));
    }, []);
    useEffect(() => {
        getData();
    }, [getData]);

    const deleteSelectedItems = useCallback(() => {
        const ids = selectedItems.map(x => x.id);
        ids.forEach(x => {
          axios.delete(`https://localhost:7071/api/Recipes/${x}`);
        })
        console.log(ids);
        setRecipes(recipes.filter(x => !ids.includes(x.id)));
    }, []);
    
    return (<>
        <Table
            items={recipes}
            resizableColumns
            header={<Header actions={
                <SpaceBetween direction="horizontal" size="m">
                    <Button disabled={selectedItems.length === 0} onClick={() => {
                        setShoppingListVisible(true);
                        }}>Show shopping list </Button>
                    <Button onClick={() => {setUpsertFormVisible(true)}}> Add new recipe </Button>
                    <Button disabled={selectedItems.length !== 1} onClick={() => {setUpsertFormVisible(true)}}> Edit recipe </Button>
                    <Button onClick={deleteSelectedItems}>Delete</Button>
                </SpaceBetween>}>
                Recipes
            </Header>}
            onSelectionChange={({ detail }) =>
                setSelectedItems(detail.selectedItems)
            }
            selectedItems={selectedItems}
            selectionType="multi"
            ariaLabels={{
            selectionGroupLabel: "Items selection",
            allItemsSelectionLabel: ({ selectedItems }) =>
                `${selectedItems.length} ${
                selectedItems.length === 1 ? "item" : "items"
                } selected`,
            itemSelectionLabel: ({ selectedItems }, item) =>
                item.id
            }}
            columnDefinitions={[
            {
                id: "variable",
                header: "Variable name",
                cell: (item) => item.id,
                isRowHeader: true
            },
            {
                id: "name",
                header: "Name",
                cell: (item) => item.name,
                isRowHeader: true
            },
            {
                id: "type",
                header: "Type",
                cell: (item) => item.type.split(",").sort((a, b) => a.localeCompare(b)).join(", ")
            }
            ]}
            columnDisplay={[
                { id: "name", visible: true },
                { id: "type", visible: true }
            ]}
        />

        <UpsertRecipe visible={upsertFormVisible} setVisible={setUpsertFormVisible} selectedRecipe={selectedItems[0]} setRecipes={setRecipes} recipes={recipes}/>
        <ShoppingList visible={shoppingListVisible} setVisible={setShoppingListVisible} selectedRecipes={selectedItems} setSelectedRecipes={setSelectedItems}/>
    </>);
}