import React from 'react'

import { Link, useParams } from 'react-router-dom'

import { useVerifyEmail } from '../api/verifyEmail'
import Logo from '../assets/images/one-liner-black.svg'
import Spinner from '../components/Spinner'

const VerifyEmail = () => {
  const { token } = useParams()
  const verifyEmail = useVerifyEmail()

  const isLoading = React.useMemo(() => verifyEmail.isLoading, [verifyEmail.isLoading])

  React.useEffect(() => {
    verifyEmail.execute(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className='flex gap-4 flex-col justify-center items-center h-screen bg-white'>
      {isLoading ? <Spinner /> : <>
        <img src={Logo} alt="logo" className='w-3/4' />
        <h1 className='text-xl'>Email has been verified</h1>
        <span className="text-sm text-gray-400">
          Go back to{" "}
          <Link
            to="/profile"
            className="text-violet-400 underline hover:text-violet-500">
            Profile
          </Link>
        </span>
      </>}
    </div>
  )
}

export default VerifyEmail