import { useState, useEffect } from 'react';
import { Button, DatePicker, FormField, Header, Input, Modal, SpaceBetween } from "@cloudscape-design/components";
import Multiselect from "@cloudscape-design/components/multiselect";
import '@cloudscape-design/global-styles/index.css';
import "../App.css";
import Person from "../models/Person";
import { MultiselectProps } from "@cloudscape-design/components/multiselect";
import { ScheduleEventProps } from '../props/ScheduleEventProps';
import UpsertRequest from '../models/UpsertRequest';


export default function Events(props: ScheduleEventProps) {
  const [
    selectedOptions,
    setSelectedOptions
  ] = useState<ReadonlyArray<MultiselectProps.Option>>([]);
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [people, setPeople] = useState([]);
  const [options, setOptions] = useState<ReadonlyArray<MultiselectProps.Option>>([]);

  const closeModal = () => {
    props.setVisible(false);
    setName("");
    setPeople([]);
    setStartTime("");
    setEndTime("");
    setSelectedOptions([]);
    return;
  }

  async function getData() {
    try {
      const response = await props.client.list("People");
      console.log(response);
      setPeople(response);
    } catch (error) {
      console.error("Unable to get data");
      console.log(error)
    }   
  }

  useEffect(() => {
    getData()
  }, []);

  useEffect(() => {
    const newOptions = people?.map((x: Person) => ({
      label: x.firstName + " " + x.lastName,
      value: x.id
    }));
    setOptions(newOptions ?? []);
  }, [people]);


  async function addEvent() {
    try {
      const data = {
        name: name,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString()
      }
      const upsertRequest = new UpsertRequest(JSON.stringify(data));
      const response = await props.client.create(upsertRequest, "Events");
      response.people.push(...selectedOptions.map(x => x.value));
      await props.client.update(new UpsertRequest(JSON.stringify(response), response.id), "Events");

      props.events.push(response);
      props.setEvents([...props.events]);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Modal
      visible={props.visible}
      onDismiss={closeModal}
      closeAriaLabel="Close modal"
      footer={<SpaceBetween size='s' alignItems='end'><Button disabled={!validInput(startTime, endTime, name, selectedOptions)} onClick={addEvent}> Submit</Button></SpaceBetween>}
      header={<Header variant="h2">Please enter your event details</Header>}
    >
  
    <FormField stretch>
      
    <Input
      onChange={({ detail }) => setName(detail.value)}
      value={name}
      placeholder="Enter name of event"
    />
    </FormField>
    
    <FormField stretch>
    <Multiselect
      selectedOptions={selectedOptions}
      onChange={({ detail }) =>
        setSelectedOptions(detail.selectedOptions)
      }
      options={options}
      placeholder="Who is attending"
    />
    </FormField>
    <FormField stretch>
      <SpaceBetween direction="horizontal" size="xxl">
    <DatePicker
        onChange={({ detail }) => setStartTime(detail.value)}
        expandToViewport
        value={startTime}
        openCalendarAriaLabel={selectedDate =>
          "Choose certificate expiry date" +
          (selectedDate
            ? `, selected date is ${selectedDate}`
            : "")
        }
        placeholder="YYYY/MM/DD - Start Date"
      />
      
    <DatePicker
        onChange={({ detail }) => setEndTime(detail.value)}
        expandToViewport
        value={endTime}
        openCalendarAriaLabel={selectedDate =>
          "Choose certificate expiry date" +
          (selectedDate
            ? `, selected date is ${selectedDate}`
            : "")
        }
        placeholder="YYYY/MM/DD - End Date"
      />
      <div className="testing">
      </div>
    </SpaceBetween>
    </FormField>
    </Modal>
  )}

  function validInput(startTime: string, endTime: string, name: string, selectedOptions: ReadonlyArray<MultiselectProps.Option>) {
    if (!startTime || !endTime) {
      return false;
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end > start && name && selectedOptions.length !== 0)
  }