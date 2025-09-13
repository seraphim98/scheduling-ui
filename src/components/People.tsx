import { useState, useEffect } from 'react';
import Table from "@cloudscape-design/components/table"
import "../App.css";
import '@cloudscape-design/global-styles/index.css';
import { Button } from '@cloudscape-design/components';
import {SpaceBetween} from '@cloudscape-design/components';
import Person from '../models/Person';
import AddPerson from './AddPerson';
import SchedulerClient from '../Clients/SchedulerClient';

interface PeopleProps {
  client: SchedulerClient;
}
export default function People(props: PeopleProps) {
  const [people, setPeople] = useState<Array<Person>>([]);
  const [addPersonFormVisible, setAddPersonFormVisible] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Array<Person>>([]);
  const chunkSize = 10;
  const getData = async () => {
    const response = await props.client.getRecords("People");
    setPeople(response);
  };

  const deleteSelectedItems = async () => {
    for (let i = 0; i < selectedItems.length; i += chunkSize) {
      const chunk = selectedItems.slice(i, i + chunkSize);
      await Promise.all(chunk.map(x => props.client.deleteRecord(x.id, "People")));
      
      const ids = chunk.map(x => x.id);
      const remainingPeople = people.filter(x => !ids.includes(x.id));
      setPeople(remainingPeople);
    }
    setSelectedItems([]);
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <>
        <Table
        items={people}
        resizableColumns
        header={
          <SpaceBetween direction='horizontal' size='s' alignItems='end'>
              <Button iconName={'refresh'} onClick={getData}> Refresh </Button>
              <Button onClick={() => setAddPersonFormVisible(true)}> Add user </Button>
              <Button onClick={deleteSelectedItems}> Delete </Button>
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
          itemSelectionLabel: ({ }, item : Person) =>
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
        <AddPerson people={people} setPeople={setPeople} visible={addPersonFormVisible} setVisible={setAddPersonFormVisible} client={props.client}/>
    </>
  )
}

