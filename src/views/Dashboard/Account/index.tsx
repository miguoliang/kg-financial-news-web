import React, { lazy, useState } from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

const Password = lazy(() => import("./Password"));
const Subscription = lazy(() => import("./Subscription"));

const settingsMenu = [
  { label: "Password", path: "password" },
  { label: "Subscription", path: "subscription" },
];

const Settings = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (index: number) => {
    setTabIndex(index);
    window.history.replaceState(null, "", `${settingsMenu[index].path}`);
  };

  return (
    <Tabs index={tabIndex} onChange={handleTabChange}>
      <TabList>
        {settingsMenu.map((it, index) => (
          <Tab key={index}>{it.label}</Tab>
        ))}
      </TabList>
      <TabPanels paddingY={2}>
        <TabPanel>
          <Password />
        </TabPanel>
        <TabPanel>
          <Subscription />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Settings;
