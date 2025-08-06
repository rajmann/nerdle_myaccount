import React from "react";

import { RiUserSettingsLine } from 'react-icons/ri';
import { Link, Outlet } from "react-router-dom";

import BottomNavigation, { BottomNavigationItem } from "../BottomNavigation";
import Drawer from "../Drawer";
import Header from "../Header";
import AllGamesIcon from "../icons/AllGamesIcon";
import LeagueIcon from "../icons/LeagueIcon";
import NerdleMenuIcon from "../icons/NerdleMenuIcon";
import StatisticsIcon from "../icons/StatisticsIcon";
import NerdleLogo from "../NerdleLogo";
import NerdleText from "../NerdleText";

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
          <div className="flex items-center gap-4">
            <button
              onClick={onDrawerOpen}
              className="text-gray-700 hover:text-nerdle-primary dark:text-gray-300 dark:hover:text-white p-1">
              <NerdleMenuIcon />
            </button>
            <NerdleLogo />
            <NerdleText />
          </div>
        </Header.Left>
        <Header.Right>
          <Link
            to="/profile"
            className="text-gray-700 hover:text-nerdle-primary dark:text-gray-300 dark:hover:text-white p-2">
            <RiUserSettingsLine size={24} />
          </Link>
        </Header.Right>
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
