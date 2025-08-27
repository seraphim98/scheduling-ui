import { useEffect, useState } from "react"
import Recipe from "../../models/Recipe";
import { Modal, Table } from "@cloudscape-design/components";
import ShoppingListProps from "../../props/ShoppingListProps";

export default function ShoppingList(props: ShoppingListProps) {
    const [shoppingList, setShoppingList] = useState<Array<{ingredient: string}>>([]);
    const [visible, setVisible] = useState(false);
    const getShoppingList = (items: Array<Recipe>) => {
        const list: {[x:string]: number} = {}
        items.forEach((x: Recipe) => {
            x.ingredients?.forEach(y  => {
                if (list[y.toLowerCase()]) {
                    list[y.toLowerCase()] += 1
                } else {
                    list[y.toLowerCase()] = 1;
                }
            })
        })
        const finalList = Object.keys(list).map(x => {
            let name = x.substring(1, x.length);
            const firstChar = x[0];
            name = firstChar.toUpperCase() + name;
            return {ingredient : `${name} x ${list[x]}`};
        });
        console.log(finalList);
        setShoppingList(finalList);
        setVisible(true);
    }
    useEffect(() => {
        if (props.visible) {
            getShoppingList(props.selectedRecipes);

        }
    }, [props])

    return (<Modal
        visible={visible}
        header={"Shopping list"}
        onDismiss={(event) => {
            if (event.detail.reason === "closeButton") {
                setVisible(false);
                props.setVisible(false);
                props.setSelectedRecipes([]);
            }
        }}>
        <Table
            items={shoppingList}
            variant="borderless"
            columnDefinitions={[
            {
                id: "ingredient",
                header: "Ingredients",
                cell: (item) => item.ingredient,
                isRowHeader: true
            }
            ]}
            columnDisplay={[
                { id: "ingredient", visible: true }
            ]}
        >
        </Table>
    </Modal>)
}


