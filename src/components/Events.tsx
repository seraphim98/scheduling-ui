import { useState, useEffect } from 'react';
import axios from "axios";
import Table from "@cloudscape-design/components/table"
import Calendar from "@cloudscape-design/components/calendar";
import "../App.css";
import '@cloudscape-design/global-styles/index.css';
import Header from "@cloudscape-design/components/header"
import { Button } from '@cloudscape-design/components';
import {SpaceBetween} from '@cloudscape-design/components';
import ScheduleEvent from './ScheduleEvent';
import Person from "../models/Person";
import Event from '../models/Event';

export default function Events() {
  let todaysDate = new Date().toISOString().split("T")[0];
  const [people, setPeople] = useState([]);
  const [value, setValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<Array<Event>>([]);
  const [open, setOpen] = useState<boolean>(false);

  const date = value === "" ? todaysDate: value;
  const reversed = reverseDate(date);

  const deleteSelectedItems = () => {
    selectedItems.forEach(x => {
      axios.delete(`https://localhost:7071/api/Events/${x.id}`);
    })
    alert("Sucessful deleted event(s).");
    window.location.reload();
  }

  const openForm = () => {
    setOpen(true)
  }

  const getData = () => {
    axios.get("https://localhost:7071/api/Events")
        .then(response => {
  
          setPeople(response.data);
        })
        .catch(error => {
          console.error(error);
        });
  }

  const refreshPage = () => {
    window.location.reload();
  }

  useEffect(() => {
    getData()
  }, []);
  
  if (open) {
    return (<ScheduleEvent/>)
  }
  return (
    <>
      <div className='center'>
      <Calendar
      onChange={({ detail }) => setValue(detail.value)}
      value={value}>
      </Calendar>
      </div>
        <Table
        items={people.filter(x => isActiveOnDate(x, date))}
        resizableColumns
        header={
          <SpaceBetween direction='horizontal' size='s'>
              <Header variant="h1">Selected Date: {reversed}</Header>
              <Button onClick={refreshPage} >Refresh</Button>
              <Button onClick={openForm}>Add new event</Button>
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
          itemSelectionLabel: ({ selectedItems }, item : Event) =>
            item.name
        }}
        columnDefinitions={[
          {
            id: "variable",
            header: "Variable name",
            cell: (item : Event) => item.name,
            isRowHeader: true
          },
          {id: "first",
          header: "Start Date",
          cell: (item : Event) => reverseDate(item.startTime.split("T")[0]),
          sortingField: "alt"
        },{id: "last",
          header: "End Date",
          cell: (item : Event) => reverseDate(item.endTime.split("T")[0]),
          sortingField: "alt"
        },{
          id:"attendance",
          header: "People attending",
          cell: (item : Event) => item.people.map((x: Person) => {
            return x.firstName + " " + x.lastName;
          }).join(", ")
        }
        ]}
        columnDisplay={[
          {id: "variable", visible: true},
        { id: "first", visible: true },
        { id: "last", visible: true },
        { id: "attendance", visible: true },
      ]} 
        >
        </Table>
    </>
  )
}
function isActiveOnDate(event: Event, date: string) {
  if(!date) {
    return false;
  }
  return date >= event.startTime.split("T")[0] && date <= event.endTime.split("T")[0];
}

function reverseDate(date: string) {
  return date.split("-").reverse().join("-");
}

