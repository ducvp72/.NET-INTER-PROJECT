import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import NavBarAdmin from "./NavbarAdmin";
import TopBarAdmin from "./TopBarAdmin";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  layout: {
    paddingLeft: "256px",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 0,
    },
  },
}));

const LayoutAdmin = (props) => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <TopBarAdmin openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      <NavBarAdmin openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      <div className={classes.layout}>{props.children}</div>
    </>
  );
};

const Admin = (props) => {
  // Check xem nguoi dung da dang nhap chua ?
  // Neu chua thi tro ve trang chu
  if (!localStorage.getItem("user")) {
    return <Redirect to="/home" />;
  }

  // Check role
  if (
    JSON.parse(localStorage.getItem("user")).userRole === "mentor"
  ) {
    return <Redirect to="/home" />;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta charSet="utf-8" name="description" content="Trang quản lý" />
      </Helmet>
      <LayoutAdmin>
        <Route
          exact={props.exact}
          path={props.path}
          component={props.component}
        />
      </LayoutAdmin>
    </>
  );
};

export default Admin;
