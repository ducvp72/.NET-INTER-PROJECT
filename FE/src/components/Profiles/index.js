import React from "react";
import { NavLink } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ChangePassword from "./changepassword";
import Profiles from "./profile";
import { makeStyles, Container } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    marginBottom: "100px",
    marginTop: "15px",
  },
  navbar: {
    background: "#0E1E40",
    height: "50px",
    marginBottom: "30px",
  },
  linkli: {
    listStyle: "none",
    margin: "15px 10px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "large",
    fontWeight: "bold",
    "&:hover": {
      color: "#1645ab",
    },
  },
  ull: {
    display: "flex",
    alignItems: "center",
  },
});
const Profile = () => {
  const classes = useStyles();
  return (
    <Router>
      <div className={classes.root}>
        <nav className={classes.navbar}>
          <Container>
            <ul className={classes.ull}>
              <li className={classes.linkli}>
                <NavLink
                  activeStyle={{ color: "#1645ab", fontWeight: "bold" }}
                  className={classes.link}
                  to="/profile"
                >
                  Hồ sơ cá nhân
                </NavLink>
              </li>

              <li className={classes.linkli}>
                <NavLink
                  activeStyle={{ color: "#1645ab", fontWeight: "bold" }}
                  className={classes.link}
                  to="/changepassword"
                >
                  Thay đổi mật khẩu
                </NavLink>
              </li>
            </ul>
          </Container>
        </nav>
        <Route path="/profile" component={Profiles} />
        <Route path="/changepassword" component={ChangePassword} />
      </div>
    </Router>
  );
};
export default Profile;
