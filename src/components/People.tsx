import { useState, useEffect } from 'react';
import axios from "axios";
import Table from "@cloudscape-design/components/table"
import "../App.css";
import '@cloudscape-design/global-styles/index.css';
import { Button } from '@cloudscape-design/components';
import {SpaceBetween} from '@cloudscape-design/components';
import Person from '../classes/Person';
import AddPerson from './AddPerson';

export default function People() {
  const [people, setPeople] = useState([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Array<Person>>([]);

  const getData = () => {
    axios.get("https://localhost:7071/api/People")
        .then(response => {
  
          setPeople(response.data);
        })
        .catch(error => {
          console.error(error);
        });
  }
  const deleteSelectedItems = () => {
    selectedItems.forEach(x => {
      axios.delete(`https://localhost:7071/api/People/${x.id}`);
    })
    alert("Sucessful deleted person(s).");
    window.location.reload();
  }
  const refreshPage = () => {
    window.location.reload();
  }
  useEffect(() => {
    getData()
  }, []);
  const openForm = () => {
    setOpen(true)
  }
  if (open) {
    return (<AddPerson/>)
  }

  return (
    <>
        <Table
        items={people}
        resizableColumns
        header={
          <SpaceBetween direction='horizontal' size='s'>
              <Button onClick={refreshPage} >Refresh</Button>
              <Button onClick={openForm}>Add person</Button>
              <Button onClick={deleteSelectedItems} >Delete</Button>
              </SpaceBetween>
        }
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
          itemSelectionLabel: ({ selectedItems }, item : Person) =>
            item.id
        }}
        columnDefinitions={[
          {
            id: "variable",
            header: "Variable name",
            cell: (item: Person) => item.id,
            isRowHeader: true
          },
          {id: "first",
          header: "Name",
          cell: (item: Person) => item.firstName + " " + item.lastName,
          sortingField: "alt"
        }
        ]}
        columnDisplay={[
        { id: "first", visible: true }]}
        >
        </Table>
    </>
  )
}

