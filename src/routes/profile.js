import React from "react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";

import { useDeleteAccount } from "../api/deleteAccount";
import { useProfile } from "../api/profile";
import { useProfilePhoto } from "../api/profilePhoto";
import { useUpdateMarketingPreferences } from "../api/updateMarketingPreferences";
import ConfirmationDialog from "../components/ConfirmationDialog";
import MoonIcon from "../components/icons/MoonIcon";
import Spinner from "../components/Spinner";
import SunIcon from "../components/icons/SunIcon";
import Email from "../containers/Profile/Email";
import Name from "../containers/Profile/Name";
import Photo from "../containers/Profile/Photo";
import useAuth from "../hooks/useAuth";
import useDarkMode from "../hooks/useDarkMode";


const Profile = () => {
  const { data, isValidating, mutate } = useProfile();
  const { execute } = useDeleteAccount();
  const { execute: executeUpdateMarketingPreferences  } = useUpdateMarketingPreferences();
  const { data: photo, ...photoResponse } = useProfilePhoto();
  const [updatesOptedInState, setUpdatesOptedInState] = React.useState(false);
  const [marketingOptedInState, setMarketingOptedInState] = React.useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [showModal, setShowModal] = React.useState(false);
  
  React.useEffect(() =>
  {
    //if(data) console.log('data.updatesOptOut = ' + data.updatesOptOut);
    const updatesOptOut = data ? data.updatesOptOut === 0 ? false: true: false;
    setUpdatesOptedInState(!updatesOptOut);
  }, [data]);

  React.useEffect(() =>
  {
    //if(data) console.log('data.marketingOptIn = ' + data.marketingOptIn);
    const marketingOptIn = data ? data.marketingOptIn === 0 ? false: true: false;
    setMarketingOptedInState(marketingOptIn);
  }, [data]);


  const isVerified = React.useMemo(() =>
  {
    //if(data) console.log('data.isVerified = ' + data.isVerified);
    return data ? data.isVerified === undefined ? true: data.isVerified: false;
  }, [data]);


  const auth = useAuth();
  const navigate = useNavigate();


  const updatesClicked = React.useCallback(async () => {
    if(!isVerified)
    {
      toast.error("Please verify your email first!");
      return;
    }
    //console.log('updatesClicked');
    try {

      const newUpdatesOptedInState = !updatesOptedInState;
      setUpdatesOptedInState(newUpdatesOptedInState);
      await executeUpdateMarketingPreferences({ updatesOptOut: !newUpdatesOptedInState });
      toast.success("Saved!");
      
    } catch (e) {
      console.log(e);
      toast.error("Cannot update preference. Please try again.");
    }

  }, [executeUpdateMarketingPreferences, updatesOptedInState, isVerified]);

  const marketingClicked = React.useCallback(async () => {
    if(!isVerified)
    {
      toast.error("Please verify your email first!");
      return;
    }
    //console.log('marketingClicked');
    try {

      const newMarketingOptedInState = !marketingOptedInState;
      setMarketingOptedInState(newMarketingOptedInState);
      await executeUpdateMarketingPreferences({ marketingOptIn: newMarketingOptedInState });
      toast.success("Saved!");  
      
    } catch (e) {
      console.log(e);
      toast.error("Cannot update preference. Please try again.");
    }

  }, [executeUpdateMarketingPreferences, marketingOptedInState, isVerified]);

  const onChangePassword = React.useCallback(() => {
    navigate("../change-password");
  }, [navigate]);

  const onSignOut = React.useCallback(() => {
    if (auth.isPWA) {
      window.ReactNativeWebView.postMessage("LOGOUT");
    }
    auth.signOut();
  }, [auth]);

  const deleteAccount = React.useCallback(async () => {
    try {
      await execute({ id: data.id });
      toast.success("Successfully Deleted!");
      setShowModal(false);
      setTimeout(function () {
        auth.signOut();
      }, 1500);
    } catch (e) {
      console.log(e);
      toast.error("Cannot delete account");
    }
  }, [execute, data?.id, auth]);

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ConfirmationDialog
        title="Are you sure you want to delete your account?"
        setShowModal={setShowModal}
        showModal={showModal}
        click={deleteAccount}
      />
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h1>
        <Photo
          isVerified={isVerified}
          photo={photo}
          name={data?.name}
          isValidating={photoResponse.isValidating}
          mutate={photoResponse.mutate}>
          <Name isVerified={isVerified} name={data?.name} isValidating={isValidating} mutate={mutate} />
        </Photo>
      </div>
      <div>
        <Email
          isVerified={isVerified}
          email={data?.email}
          isValidating={isValidating}
          mutate={mutate}
        />
        <div className="mt-5"></div>
        {(data?.email !== undefined) && (
        <>
          <div className="h-px w-full bg-gray-500"></div>
          <div className="flex w-full pt-4 text-left text-xs text-gray-700">
            <div className="flex-1">
              <div className={`w-100 pt-2 ${(!isVerified) ? 'text-gray-400': ''}`}>Send me marketing emails</div>
            </div>
            <div className="flex-none w-14">
              <Switch onColor='#820458' onChange={marketingClicked} checked={marketingOptedInState} />
            </div>
          </div>

          <div className="flex w-full pb-3 pt-2 text-left text-xs text-gray-700">
            <div className="flex-1">
              <div className={`w-100 pt-2 ${(!isVerified) ? 'text-gray-400': ''}`}>Send me LeaderBoardLe app updates</div>
            </div>
            <div className="flex-none w-14">
              <Switch onColor='#820458' onChange={updatesClicked} checked={updatesOptedInState} />
            </div>
          </div>
        </>)}
        <div className="h-px w-full bg-gray-500"></div>
        <div className="flex w-full py-4 text-left">
          <div className="flex-1">
            <div className="text-xs text-gray-700 dark:text-gray-300">Theme</div>
          </div>
          <div className="flex-none">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 text-xs text-nerdle-primary hover:text-nerdle-secondary">
              {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gray-500"></div>
        <button
          onClick={onChangePassword}
          className="w-full py-4 text-left text-xs text-nerdle-primary underline hover:text-nerdle-secondary">
          Change password
        </button>
        <div className="h-px w-full bg-gray-500"></div>
        <button
          onClick={onSignOut}
          className="w-full py-4 text-left text-xs text-nerdle-primary underline hover:text-nerdle-secondary">
          Sign out
        </button>
        <div className="h-px w-full bg-gray-500"></div>
        <button
          className="w-full py-4 text-left text-xs text-pink-400 underline hover:text-pink-500"
          onClick={() => setShowModal(true)}>
          Delete this account
        </button>
        <p className="text-xs text-gray-900 dark:text-white">
          Player names considered inappropriate may result in your account being
          deleted. Please see T&Cs.
        </p>
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default Profile;
