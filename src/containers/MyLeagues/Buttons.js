import React from "react";

import { MdAdd } from "react-icons/md";

import OutlineButton from "../../components/OutlineButton";

const Buttons = ({ onCreate, onJoin }) => {
  return (
    <div className="flex items-center gap-3">
      <OutlineButton onClick={onCreate} className="flex-1 text-sm">
        <MdAdd className="h-5 w-5 shrink-0 rounded-full bg-nerdle-primary p-px text-white" />
        Create League
      </OutlineButton>
      <OutlineButton onClick={onJoin} className="flex-1 text-sm">
        Join League
      </OutlineButton>
    </div>
  );
};

export default Buttons;
