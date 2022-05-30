import React from "react";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";

const LayoutAuth = (props) => {
  return <>{props.children}</>;
};

const Auth = (props) => {
  if (localStorage.getItem("user")) {
    return <Redirect to="/home" />;
  }
  return (
    <LayoutAuth>
      <Route
        exact={props.exact}
        path={props.path}
        component={props.component}
      />
    </LayoutAuth>
  );
};

export default Auth;
