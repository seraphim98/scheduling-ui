import { useState } from 'react';
import {
  AppLayout,
  SideNavigation,
} from '@cloudscape-design/components';
import Events from "./components/Events";
import People from "./components/People";
import ViewRecipes from './components/recipes/View';
import {BrowserRouter, Routes, Route } from "react-router-dom";

export default function () {
  const [open, setOpen] = useState<boolean>(true)
  return (
    <BrowserRouter>
      <AppLayout
        navigationOpen={open}
        onNavigationChange={({ detail }) => setOpen(detail.open)}
        navigation={
          <SideNavigation
            header={{
              href: '#',
              text: 'Scheduling',
            }}
            items={[
              { type: 'link', text: `Home`, href: `/` },
              { type: 'link', text: `Events`, href: `/events` },
              { type: 'link', text: 'People', href: '/people'},
              { type: 'link', text: 'Recipes', href: '/recipes'}
            ]}
          />
        }
        content={
          <Routes>
            <Route path= "/" element={<h1>Welcome!</h1>}/>
            <Route path= "/events" element={<Events/>}/>
            <Route path= "/people" element={<People/>}/>
            <Route path= "/recipes" element={<ViewRecipes/>}/>
          </Routes>
        }
      />
      </BrowserRouter>
  );
}

