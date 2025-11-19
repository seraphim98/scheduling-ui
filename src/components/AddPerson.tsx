import { useState } from 'react';
import Input from "@cloudscape-design/components/input";
import { Button, Header, Modal, FormField, SpaceBetween } from "@cloudscape-design/components";
import '@cloudscape-design/global-styles/index.css';
import "../App.css";
import Person from '../models/Person';
import SchedulerClient from '../Clients/SchedulerClient';
import UpsertRequest from '../models/UpsertRequest';

interface AddPersonProps {
  setPeople: React.Dispatch<React.SetStateAction<Array<Person>>>;
  people: Array<Person>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  client: SchedulerClient;
}

export default (props: AddPersonProps) => {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const onClose = () => {
    props.setVisible(false);
    setFirstName("");
    setLastName("");
  }

  async function addPerson() {
    const data = {
        firstName: firstName,
        lastName: lastName
    };

    const newPerson = new UpsertRequest(JSON.stringify(data));

    const response = await props.client.create(newPerson, "People");
    props.people.push(response);
    props.setPeople([...props.people]);
    onClose();
    
    return;
  }
  return (
    <Modal 
      visible={props.visible} 
      onDismiss={onClose} 
      closeAriaLabel="Close modal"
      footer={<SpaceBetween size='s' alignItems='end'><Button disabled={!validInput(firstName, lastName)} onClick={addPerson}> Submit</Button></SpaceBetween>}
      header={<Header variant="h2">Please enter user details</Header>}>
    <FormField stretch>
    <SpaceBetween direction='vertical' size='m'>
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
    </SpaceBetween>
    </FormField>
    
    <FormField stretch>
    </FormField>
    </Modal>
  )};

  function validInput(firstName: string, lastName: string) {
    return firstName.length > 0 && lastName.length > 0;
  }