import React from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthProvider";

const Logout = () => {
  const { token, signOut } = React.useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) {
      signOut();
    }

    navigate("/");
  }, [navigate, signOut, token]);
};

export default Logout;
