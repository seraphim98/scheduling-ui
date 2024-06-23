import * as React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import Input from "@cloudscape-design/components/input";
import DatePicker from "@cloudscape-design/components/date-picker";
import { Form, FormField, SpaceBetween } from "@cloudscape-design/components";
import Multiselect from "@cloudscape-design/components/multiselect";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import '@cloudscape-design/global-styles/index.css';
import "../App.css";
import Person from "../classes/Person";
import { MultiselectProps } from "@cloudscape-design/components/multiselect";


export default () => {
  const [
    selectedOptions,
    setSelectedOptions
  ] = useState<ReadonlyArray<MultiselectProps.Option>>([]);
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [finish, setFinish] = useState("");
  const [people, setPeople] = useState([]);
  const options = people.map((x: Person) => {
    return {
      label: x.firstName + " " + x.lastName,
      value: x.id
    }
  });
  async function getData() {
    try {
      let response = await axios.get("https://localhost:7071/api/People");
      setPeople(response.data);
    } catch (error) {
      console.error("Unable to get data")
    }
  }
  useEffect(() => {
    getData()
  }, []);
  const addEvent = async () =>  {
    try {
      let data = {
        name: name,
        startTime: new Date(start).toISOString(),
        endTime: new Date(finish).toISOString()
      }
      if (data.startTime > data.endTime || !name || selectedOptions.length === 0) {
        alert("Invalid input");
        return;
      }
      let response = await axios.post("https://localhost:7071/api/Events", data);
      let event = response.data;
      
      event.people.push(...selectedOptions.map(x => x.value));
      await axios.put(`https://localhost:7071/api/Events/${event.id}`, event);
      alert("Sucessful updated event(s).");
      window.location.reload();
    } catch (error) {
      alert("Error updating database");
    }
  }
  return (
    <Container header={
      <h1>Please enter your new event</h1>
    }>
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
        onChange={({ detail }) => setStart(detail.value)}
        expandToViewport
        value={start}
        openCalendarAriaLabel={selectedDate =>
          "Choose certificate expiry date" +
          (selectedDate
            ? `, selected date is ${selectedDate}`
            : "")
        }
        placeholder="YYYY/MM/DD - Start Date"
      />
      
    <DatePicker
        onChange={({ detail }) => setFinish(detail.value)}
        expandToViewport
        value={finish}
        openCalendarAriaLabel={selectedDate =>
          "Choose certificate expiry date" +
          (selectedDate
            ? `, selected date is ${selectedDate}`
            : "")
        }
        placeholder="YYYY/MM/DD - End Date"
      />
      <div className="testing">
      <Button onClick={addEvent}>Submit</Button>
      </div>
    </SpaceBetween>
    </FormField>
    </Container>
  )};

  function validInput() {
    
  }