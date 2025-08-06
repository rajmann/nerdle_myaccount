import React from "react";

const Avatar = ({ src, alt = "", className }) => {
  const userInitials = React.useMemo(
    () =>
      alt
        .split(" ")
        .map((word) => word[0])
        .join(""),
    [alt]
  );

  return (
    <div
      className={`relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border-2 border-white bg-nerdle-primary ${className}`}>
      {src ? (
        <img
          src={src}
          onError={null}
          alt={alt}
          className="absolute block h-full w-full object-cover"
        />
      ) : (
        <span className="text-2xl text-white">{userInitials}</span>
      )}
    </div>
  );
};

export default Avatar;
