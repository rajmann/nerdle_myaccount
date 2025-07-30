import React from "react";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [isPWA, setIsPWA] = React.useState(false);
  const [isTestFlight, setIsTestFlight] = React.useState(false);
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const [appPlatform, setAppPlatform] = React.useState(
    localStorage.getItem("appPlatform")
  );
  React.useEffect(() => {
    setIsPWA(localStorage.getItem("onNerdleLeagueApp"));
    setAppPlatform(localStorage.getItem("appPlatform"));
    setIsTestFlight(localStorage.getItem("showSSOButtons"));
    // Interval is for backup in case line 11 (^) fails
    const interval = setInterval(() => {
      setIsPWA(localStorage.getItem("onNerdleLeagueApp"));
      setAppPlatform(localStorage.getItem("appPlatform"));
      setIsTestFlight(localStorage.getItem("showSSOButtons"));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const signIn = React.useCallback(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.reload();
  };

  const value = { token, signIn, signOut, isPWA, appPlatform, isTestFlight };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
