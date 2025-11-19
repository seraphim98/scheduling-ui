import { useState, useEffect } from 'react';
import Table from "@cloudscape-design/components/table"
import Calendar from "@cloudscape-design/components/calendar";
import "../App.css";
import '@cloudscape-design/global-styles/index.css';
import { Button, Header, SpaceBetween } from '@cloudscape-design/components';
import {} from '@cloudscape-design/components';
import ScheduleEvent from './ScheduleEvent';
import Person from "../models/Person";
import Event from '../models/Event';
import { BaseProps } from '../props/BaseProps';


export default function Events(props: BaseProps) {
  const todaysDate = new Date().toISOString().split("T")[0];
  const [events, setEvents] = useState<Array<Event>>([]);
  const [value, setValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<Array<Event>>([]);
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);

  const date = value === "" ? todaysDate: value;
  const reversed = reverseDate(date);

  async function deleteEvents() {
    const eventIds = selectedItems?.map(x => x.id);
    await Promise.all(selectedItems.map(x => props.client.delete(x.id, "Events")));

    const remainingEvents = events.filter(x => !eventIds.includes(x.id));
    setEvents(remainingEvents);
    setSelectedItems([]);
  }

  async function getData() {
    setLoading(true);
    try {
      const response = await props.client.list("Events");
      setEvents(response ?? []);
    } catch (error) {
      console.error("Unable to get data")
    }
    setLoading(false);
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <>
      <div className='center'>
      <Calendar
        onChange={({ detail }) => setValue(detail.value)}
        value={value}>
      </Calendar>
      </div>
        <Table
        items={events.filter(x => isActiveOnDate(x, date))}
        resizableColumns
        header={
          <SpaceBetween direction='horizontal' size='s'>
              <Header variant="h1"> Selected Date: {reversed} </Header>
              <Button iconName="refresh" iconAlt="refresh" onClick={getData}/>
              <Button onClick={() => setOpen(true)}> Add new event </Button>
              <Button disabled={selectedItems.length === 0} onClick={deleteEvents} >Delete</Button>
          </SpaceBetween>
        }
        onSelectionChange={({ detail }) =>
          setSelectedItems(detail.selectedItems)
        }
        loading={loading}
        selectedItems={selectedItems}
        selectionType="multi"
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          allItemsSelectionLabel: ({ selectedItems }) =>
            `${selectedItems.length} ${
              selectedItems.length === 1 ? "item" : "items"
            } selected`,
          itemSelectionLabel: ({ }, item : Event) =>
            item.name
        }}
        columnDefinitions={[
          {
            id: "variable",
            header: "Variable name",
            cell: (item : Event) => item.name,
            isRowHeader: true
          },
          {
            id: "first",
            header: "Start Date",
            cell: (item : Event) => reverseDate(item.startTime.split("T")[0]),
            sortingField: "alt"
          },
          {
            id: "last",
            header: "End Date",
            cell: (item : Event) => reverseDate(item.endTime.split("T")[0]),
            sortingField: "alt"
          },
          {
            id:"attendance",
            header: "People attending",
            cell: (item : Event) => item.people?.map((x: Person) => {
              return x.firstName + " " + x.lastName;
            }).join(", ")
          }
        ]}
        columnDisplay={[
          {id: "variable", visible: true},
          { id: "first", visible: true },
          { id: "last", visible: true },
          { id: "attendance", visible: true },
        ]}>
        </Table>
        <ScheduleEvent client={props.client} visible={open} setVisible={setOpen} events={events} setEvents={setEvents}/>
    </>
  )
}
function isActiveOnDate(event: Event, date: string) {
  if (!date) {
    return false;
  }
  return date >= event.startTime.split("T")[0] && date <= event.endTime.split("T")[0];
}

function reverseDate(date: string) {
  return date.split("-").reverse().join("-");
}

