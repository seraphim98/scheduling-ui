import { useState } from 'react';
import {
  AppLayout,
  SideNavigation,
  TopNavigation
} from '@cloudscape-design/components';
import Events from "../components/Events";
import People from "../components/People";
import ViewRecipes from '../components/recipes/View';
import { Routes, Route,useNavigate } from "react-router-dom";
import SchedulerClient from '../Clients/SchedulerClient';

import "../styling/top-nav.css";

export default function Scheduler () {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(true);
  const client = new SchedulerClient({baseUrl: "https://localhost:7071/api", authToken: ""});
  return (
    <>
      <TopNavigation
        data-header
        identity={{
          href: "#",
          title: "Scheduling App",
        }}
        utilities={[]}
      />
        <AppLayout
          navigationOpen={open}
          onNavigationChange={({ detail }) => setOpen(detail.open)}
          headerSelector="[data-header]"
          navigation={
            <SideNavigation
              header={{
                href: '/',
                text: 'Home',
              }}
              items={[
                { type: 'link', text: `Events`, href: `/events` },
                { type: 'link', text: 'People', href: '/people'},
                { type: 'link', text: 'Recipes', href: '/recipes'},
              ]}
              onFollow={ event => {
                event.preventDefault();
                if (event.detail.href) {
                  navigate(event.detail.href);
                }
              }}
            />
          }
          content={
            <Routes>
              <Route path= "/" element={<h1>Welcome to my demo site!</h1>}/>
              <Route path= "/events" element={<Events client={client}/>}/>
              <Route path= "/people" element={<People client={client}/>}/>
              <Route path= "/recipes" element={<ViewRecipes/>}/>
            </Routes>
          }
        />
    </>
  );
}
