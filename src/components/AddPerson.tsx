import { useState } from 'react';
import axios from "axios";
import Input from "@cloudscape-design/components/input";
import { FormField, SpaceBetween } from "@cloudscape-design/components";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import '@cloudscape-design/global-styles/index.css';
import "../App.css";

export default () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  function addPerson() {
    if (validInput()) {
      axios.post("https://localhost:7071/api/People", {
        firstName: firstName,
        lastName: lastName,
      }).then(() => {
        alert("Succesfully added event");
        window.location.reload();
      }).catch(error => {
        console.error(error);
      });;
    }
  }
  return (
    <Container header={
      <h1>Please enter the required details</h1>
    }>
    <FormField stretch>
      
    <Input
      onChange={({ detail }) => setFirstName(detail.value)}
      value={firstName}
      placeholder="Enter the persons first name"
    />
    <Input
      onChange={({ detail }) => setLastName(detail.value)}
      value={lastName}
      placeholder="Enter the persons last name"
    />
    </FormField>
    
    <FormField stretch>
    </FormField>
    <FormField stretch>
      <SpaceBetween direction="horizontal" size="xxl">
      <Button onClick={addPerson}>Submit</Button>
    </SpaceBetween>
    </FormField>
    </Container>
  )};

  function validInput() {
    return true;
  }