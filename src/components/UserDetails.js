import React from "react";

import Avatar from "./Avatar";

const UserDetails = ({ user }) => {
  return (
    <div className="my-10 flex w-full flex-col items-center justify-center">
      <Avatar
        src={user?.photo}
        alt={user?.name}
        className="h-24 w-24"
      />
      <h1 className="mt-5 text-xl font-semibold text-gray-900">{user?.name}</h1>
    </div>
  );
};

export default UserDetails;
