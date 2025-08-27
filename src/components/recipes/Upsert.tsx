import { Box, Button, Header, SpaceBetween, Input, FormField, Modal, Table } from "@cloudscape-design/components";
import axios from "axios";
import Recipe from "../../models/Recipe";
import { useEffect, useState } from "react";
import UpsertRecipeProps from "../../props/UpsertRecipeProps";

export default function UpsertRecipe(props: UpsertRecipeProps) {
    const [visible, setVisible] = useState(false);
    const [upsertIngredientVisible, setUpsertIngredientVisible] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<Recipe>(new Recipe("", "", ""));
    const [upsertType, setUpsertType] = useState("Insert");
    const [initialName, setInitialName] = useState("");
    const [newName, setNewName] = useState("");
    const [selectedIngredients, setSelectedIngredients] = useState<Array<{name: string}>>([])
    useEffect(() => {
        setVisible(props.visible);
        setUpsertType(props.selectedRecipe ? "Update" : "Insert");
        setEditingRecipe(props.selectedRecipe ?? new Recipe("", "", ""));
    }, [props]);

    const saveChanges = async () => {
        const newRecipes = [...props.recipes];
        const submitRecipe = {id: editingRecipe.id, name: editingRecipe.name, type: editingRecipe.type, ingredients: editingRecipe.ingredients?.join(",") ?? "Missing ingredients"};

        if (upsertType === "Update") {
            const id = editingRecipe.id;
            const index = newRecipes.findIndex(x => x.id === id);
            newRecipes[index] = editingRecipe;
            await axios.put(`https://localhost:7071/api/Recipes/${id}`, submitRecipe);
        }

        if (upsertType === "Insert") {
            newRecipes.push(editingRecipe);
            await axios.post("https://localhost:7071/api/Recipes", submitRecipe);
        }

        props.setRecipes(newRecipes);
        props.setVisible(false);
        setVisible(false);
        setSelectedIngredients([]);
    }

    const addIngredient = async () => {
        let newRecipe = {...editingRecipe}
        if (initialName && newRecipe.ingredients) {
            const index = newRecipe.ingredients?.indexOf(initialName);
            if (index) {
                newRecipe.ingredients[index] = newName;
            }
        }

        if (newRecipe.ingredients) {
            newRecipe.ingredients.push(newName);
        } else {
            newRecipe.ingredients = [newName];
        }

        setEditingRecipe(newRecipe);
        setUpsertIngredientVisible(false);
        setSelectedIngredients([]);
        setInitialName("");
    }

    const deleteSelectedIngredients = () => {
        const ingredients = editingRecipe.ingredients?.filter(x => !selectedIngredients.map(x => x.name).includes(x));
        const newRecipe = {...editingRecipe}
        newRecipe.ingredients = ingredients;
        setEditingRecipe(newRecipe);
    }
    return (
        <>
        <Modal
            visible = {visible}
            header={props.selectedRecipe ? "Edit recipe" : "Add new recipe"}
            footer={<Button onClick={() => {
                saveChanges();
            }}>Confirm</Button>}
            onDismiss={(event) => {
                if (event.detail.reason === "closeButton") {
                    setVisible(false);
                    props.setVisible(false);
                }

            }}>
            <SpaceBetween direction="vertical" size="m">
                <FormField stretch>
                    <Input
                        onChange={({ detail }) => {
                            const newRecipe = {...editingRecipe};
                            newRecipe.name = detail.value;
                            setEditingRecipe(newRecipe);
                        }}
                        value={editingRecipe.name}
                        placeholder="Enter recipe name"
                    />
                </FormField>
                <FormField stretch>
                    <Input
                        onChange={({ detail }) => {
                            const newRecipe = {...editingRecipe};
                            newRecipe.type = detail.value;
                            setEditingRecipe(newRecipe);
                        }}
                        value={editingRecipe.type}
                        placeholder="Enter recipe type"
                    />
                </FormField>

                <Table
                    items={editingRecipe.ingredients?.map(x => {return {name: x}}) ?? []}
                    resizableColumns
                    header={<Header actions={
                        <SpaceBetween direction="horizontal" size="m">
                            <Button onClick={() => {
                                setInitialName("");
                                setNewName("");
                                setUpsertIngredientVisible(true);
                            }}> 
                            Add new ingredient 
                            </Button>
                            <Button disabled={selectedIngredients.length !== 1} 
                                onClick={() => {
                                    setInitialName(selectedIngredients[0].name);
                                    setNewName(selectedIngredients[0].name);
                                    setUpsertIngredientVisible(true);
                                }}> 
                                Edit ingredients 
                            </Button>
                            <Button onClick={deleteSelectedIngredients}>Delete</Button>
                        </SpaceBetween>}>
                        Ingredients
                    </Header>}
                    onSelectionChange={({ detail }) =>
                        setSelectedIngredients(detail.selectedItems)
                    }
                    selectedItems={selectedIngredients}
                    selectionType="multi"
                    ariaLabels={{
                        selectionGroupLabel: "Items selection",
                        allItemsSelectionLabel: ({ selectedItems }) =>
                            `${selectedItems.length} ${
                            selectedItems.length === 1 ? "item" : "items"
                            } selected`,
                        itemSelectionLabel: ({ }, item) =>
                            item.name
                    }}
                    columnDefinitions={[
                    {
                        id: "name",
                        header: "Name",
                        cell: (item) => item.name,
                        isRowHeader: true
                    }
                    ]}
                    columnDisplay={[
                        { id: "name", visible: true }
                    ]}
                    >
                </Table>
            </SpaceBetween>
    </Modal>
    <Modal
        visible={upsertIngredientVisible}
        header={"Add new ingredient"}
        onDismiss={(event) => {
            if (event.detail.reason === "closeButton") {
                setUpsertIngredientVisible(false);
                setSelectedIngredients([]);
                setInitialName("");
            }
        }}
        footer={<Box textAlign="right"><Button onClick={() => {
            addIngredient();
        }}>Confirm</Button></Box>}>
            <FormField stretch>
                    <Input
                        onChange={({ detail }) => {
                            setNewName(detail.value);
                        }}
                        value={newName}
                        placeholder="Enter ingredient name"
                    />
                </FormField>
    </Modal>
</>)
}