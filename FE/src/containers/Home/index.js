import React from "react";
import { Route } from "react-router";
import Header from "./../../components/Header/index";
import Footer from "./../../components/Footer/index";

const LayoutHome = (props) => {
  return (
    <>
      <Header></Header>
      {props.children}
      <Footer></Footer>
    </>
  );
};

const Home = (props) => {
  return (
    <LayoutHome>
      <Route
        exact={props.exact}
        path={props.path}
        component={props.component}
      />
    </LayoutHome>
  );
};

export default Home;
