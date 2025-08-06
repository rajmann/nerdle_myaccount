import React from "react";

import { Outlet } from "react-router-dom";

import BottomNavigation, { BottomNavigationItem } from "../BottomNavigation";
import Drawer from "../Drawer";
import Header from "../Header";
import AllGamesIcon from "../icons/AllGamesIcon";
import DrawerIcon from "../icons/DrawerIcon";
import LeagueIcon from "../icons/LeagueIcon";
//import ProfileIcon from "../icons/ProfileIcon";
import StatisticsIcon from "../icons/StatisticsIcon";
import LogoBanner from "../LogoBanner";

const BottomTabsLayout = ({ children }) => {
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);
  const [refresher, setRefresher] = React.useState(1);

  const onDrawerOpen = React.useCallback(() => {
    setDrawerIsOpen(true);
  }, []);

  const onDrawerClose = React.useCallback(() => {
    setDrawerIsOpen(false);
  }, []);

  const tabClicked = (tabName) =>
  {

    //console.log('tabName = ' + tabName);
    if(tabName === 'STATISTICS')
      setRefresher(refresher+1);

  }

  return (
    <div className="relative flex h-screen max-h-[-webkit-fill-available] flex-col overflow-hidden">
      <Header>
        <Header.Left>
          <button
            onClick={onDrawerOpen}
            className="text-nerdle-primary hover:text-nerdle-secondary p-2">
            <DrawerIcon />
          </button>
        </Header.Left>
        <Header.Center>
          <LogoBanner />
        </Header.Center>
        <Header.Right />
      </Header>
      <Drawer isOpen={drawerIsOpen} onClose={onDrawerClose} />
      <main className="flex-1 overflow-y-auto p-4">
        {children ? children : <Outlet context={[refresher, setRefresher]}/>}
      </main>
      <BottomNavigation>
        <BottomNavigationItem
          label="My Statistics"
          path="/my-statistics"
          onClick={() => tabClicked('STATISTICS')}
          icon={StatisticsIcon}
        />
        <BottomNavigationItem
          label="My Leagues"
          path="/my-leagues"
          icon={LeagueIcon}
        />
        {/* <BottomNavigationItem
          label="Profile"
          path="/profile"
          icon={ProfileIcon}
        /> */}
        <BottomNavigationItem
          label="All Games"
          path="/all-games"
          icon={AllGamesIcon}
        />
      </BottomNavigation>
    </div>
  );
};

export default BottomTabsLayout;
