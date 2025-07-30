import AppleSignin, { appleAuthHelpers } from "react-apple-signin-auth";

const AppleSignInButton = ({ isPWA, authOptions, onSuccess, onError, ...rest }) => {
  const isPWAEnabled = (app) => {
    if (isPWA) {
      window.ReactNativeWebView.postMessage(app);
    } else {
      appleAuthHelpers.signIn({
        authOptions,
        onSuccess,
        onError,
      });
    }
  };
  return (
    <AppleSignin
      onClick={() => isPWAEnabled("APPLE_LOGIN")}
      {...rest}
    />
  );
};

export default AppleSignInButton;
