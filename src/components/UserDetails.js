import React from "react";

import decorativeBackground from "../assets/images/decorative-elements.svg";

import Avatar from "./Avatar";

const UserDetails = ({ user }) => {
  return (
    <div className="relative my-10 flex items-center">
      <img
        src={decorativeBackground}
        alt="decorativeBackground"
        className="absolute left-0 right-0 -top-8 w-full"
      />
      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        <Avatar
          src={user?.photo}
          alt={user?.name}
          className="relative z-10 h-24 w-24"
        />
        <h1 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h1>
      </div>
    </div>
  );
};

export default UserDetails;
