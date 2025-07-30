import React from "react";

import SocialLogin from "react-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

class SocialButton extends React.Component {
  render() {
    const { children, triggerLogin, social, isPWA, ...props } = this.props;

    const isPWAEnabled = (app) => {
      if (isPWA) {
        window.ReactNativeWebView.postMessage(app);
      } else {
        triggerLogin();
      }
    };
    if (social === "facebook") {
      return (
        <FacebookLoginButton
          style={{
            display: "block",
            border: "0px",
            borderRadius: "8px",
            boxShadow: "rgb(0 0 0 / 30%) 0 3px 10px",
            color: "rgb(255, 255, 255)",
            cursor: "pointer",
            fontSize: "19px",
            width: "100%",
            overflow: "hidden",
            margin: "0px",
            padding: "0px 10px",
            userSelect: "none",
            height: "55px",
            background: "rgb(59, 89, 152)",
          }}
          align="center"
          onClick={() => isPWAEnabled("FB_LOGIN")}
          {...props}>
          {children}
        </FacebookLoginButton>
      );
    }
  }
}

export default SocialLogin(SocialButton);
