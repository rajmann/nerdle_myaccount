import React from "react";

import { Link } from "react-router-dom";

import { usePublicProfilePhoto } from "../../api/publicProfilePhoto";
import { ReactComponent as DecreaseIcon } from "../../assets/icons/league-rank-decrease.svg";
import { ReactComponent as IncreaseIcon } from "../../assets/icons/league-rank-increase.svg";
import Avatar from "../../components/Avatar";

const Member = ({ member, index }) => {
  const { data: photo } = usePublicProfilePhoto({ userId: member?.memberId });

  return (
    <div key={member?.memberId || index} className="flex items-center gap-5">
      <div className="flex w-1/12 flex-col items-center justify-center gap-1">
        <span className="text-sm text-white">{index + 4}</span>
        <div className="flex-1">
          {member?.rankStatus === "increased" ? (
            <IncreaseIcon />
          ) : member?.rankStatus === "decreased" ? (
            <DecreaseIcon />
          ) : null}
        </div>
      </div>
      <Link
        to={`../${String(member?.memberId)}`}
        className="flex flex-1 items-center gap-2 rounded-lg bg-slate-700 p-4 ring-violet-500 hover:ring-2 m-1"
      >
        <Avatar
          src={photo}
          alt={member?.details.fullname}
          className="h-9 w-9"
        />
        <span className="flex-1 text-sm font-semibold text-white">
          {member?.details.fullname}
        </span>
        <span className="text-sm text-white">{member?.total}</span>
      </Link>
    </div>
  );
};

export default Member;
