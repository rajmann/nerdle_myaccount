import React from "react";

import { Link } from "react-router-dom";

import { usePublicProfilePhoto } from "../../api/publicProfilePhoto";
import { ReactComponent as GoldCrownIcon } from "../../assets/icons/gold-crown.svg";
import { ReactComponent as DecreaseIcon } from "../../assets/icons/league-rank-decrease.svg";
import { ReactComponent as IncreaseIcon } from "../../assets/icons/league-rank-increase.svg";
import { ReactComponent as RaysBackground } from "../../assets/icons/rays.svg";
import Avatar from "../../components/Avatar";

const TopRankingMember = ({ member, index, nameAlternative = null }) => {
  const { data: photo } = usePublicProfilePhoto({ userId: member?.memberId });

  return (
    <Link
      to={`../${member?.memberId}`}
      className="group flex min-w-fit flex-1 flex-col items-center justify-end text-center"
    >
      {member ? (
        <div className="relative flex flex-col items-center">
          {index === 1 && (
            <RaysBackground className="absolute -translate-y-5" />
          )}
          {index === 1 ? (
            <GoldCrownIcon />
          ) : member?.rankStatus === "increased" ? (
            <IncreaseIcon />
          ) : member?.rankStatus === "decreased" ? (
            <DecreaseIcon />
          ) : null}
          <Avatar
            src={photo}
            alt={member?.details.fullname}
            className={`z-10 mt-2 ring-violet-500 group-hover:ring-2 ${
              index === 1 ? "h-20 w-20" : "h-16 w-16"
            } ${
              index === 1
                ? "border-amber-500"
                : index === 0
                ? "border-gray-400"
                : "border-amber-900"
            }`}
          />
          <div
            className={`absolute -bottom-3 z-10 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${
              index === 1
                ? "bg-amber-500"
                : index === 0
                ? "bg-gray-400"
                : "bg-amber-900"
            }`}
          >
            {index === 0 ? "2" : index === 1 ? "1" : "3"}
          </div>
        </div>
      ) : null}
      <p className="mt-6 truncate text-sm font-semibold text-white">
        {nameAlternative === null ? member?.details.fullname: nameAlternative}
      </p>
      <p className="mt-2 text-xs text-white">{member?.total}</p>
    </Link>
  );
};

export default TopRankingMember;
