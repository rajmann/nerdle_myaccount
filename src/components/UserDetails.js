import React from "react";

import raysBackground from "../assets/icons/rays.svg";

import Avatar from "./Avatar";

const UserDetails = ({ user }) => {
  return (
    <div className="relative my-10 flex items-center">
      <img
        src={raysBackground}
        alt="decorativeRays"
        className="absolute left-1/2 top-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 opacity-30"
      />
      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        <Avatar
          src={user?.photo}
          alt={user?.name}
          className="relative z-10 h-24 w-24"
        />
        <h1 className="mt-5 text-xl font-semibold text-gray-900">{user?.name}</h1>
      </div>
    </div>
  );
};

export default UserDetails;
