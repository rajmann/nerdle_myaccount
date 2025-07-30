import React from 'react'
import { useEffect } from 'react';

import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSignIn } from '../api/signIn';
import LogoMain from "../components/LogoMain";
import Spinner from '../components/Spinner'
import useAuth from '../hooks/useAuth';

const SSO = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { signIn } = useAuth();
  const { execute } = useSignIn();
  const params = new URLSearchParams(location.search);
  let data = {}
  const leagueCode = localStorage.getItem('leagueCode');
  const clientID = localStorage.getItem('clientID');
  const redirectURI = localStorage.getItem('redirectURI');

  params.forEach((value, key) => {
    data[key] = value
  });

  useEffect(() => {
    const ssoSignIn = async () => {
      try {
        const {
          data: { token },
        } = await execute(data);
        localStorage.setItem("token", token);
        localStorage.setItem("email", data.email);
        signIn();
        if (leagueCode) {
          localStorage.removeItem('leagueCode');
          navigate(`/join/${leagueCode}`);
        }
        // Redirect user to join league page if they have a pending authorization to a client app.
        else if (token && clientID && redirectURI) {
          localStorage.removeItem('clientID');
          localStorage.removeItem('redirectURI');
          navigate(`/oauth/authorize/${clientID}/${encodeURIComponent(redirectURI)}`);
        }
        else
          navigate("/my-statistics");
      } catch (error) {
        toast.error(error.message)
      }
    }

    ssoSignIn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, signIn, navigate])
  return (
    <div className='flex flex-col h-full gap-4 justify-center items-center'>
      <LogoMain className='w-1/2' />
      <Spinner />
      <p className='text-gray-400'>{`Logging in...`}</p>
    </div>
  )
}

export default SSO