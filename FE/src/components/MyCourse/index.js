import React from "react";
import { NavLink } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { makeStyles, Container } from "@material-ui/core";
import myCourse from "./mycourse";

const useStyles = makeStyles(() => ({
  navbar: {
    background: "#0E1E40",
    height: "50px",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    fontSize: "large",
    "&:hover": {
      color: "#1645ab",
    },
  },
  nav: {
    display: "flex",
    alignItems: "center",
  },
  li: {
    margin: "15px 20px",
    listStyle: "none",
  },
}));
const MyCourse = () => {
  const classes = useStyles();

  return (
    <Router>
      <div className="profile-page">
        <nav className={classes.navbar}>
          <Container>
            <ul className={classes.nav}>
              <li className={classes.li}>
                <NavLink
                  activeClassName="selected"
                  className={classes.link}
                  to="/mycourse"
                  activeStyle={{
                    fontWeight: "bold",
                    color: "#1645ab",
                  }}
                >
                  Khóa học của tôi
                </NavLink>
              </li>
              <li className={classes.li}>
                <NavLink
                  activeClassName="selected"
                  className={classes.link}
                  to="/whistlist"
                  activeStyle={{
                    fontWeight: "bold",
                    color: "#1645ab",
                  }}
                >
                  Khóa học yêu thích
                </NavLink>
              </li>
              <li className={classes.li}>
                <NavLink
                  activeClassName="selected"
                  className={classes.link}
                  to="/achieved"
                  activeStyle={{
                    fontWeight: "bold",
                    color: "#1645ab",
                  }}
                >
                  Khóa học đã hoàn thành
                </NavLink>
              </li>
            </ul>
          </Container>
        </nav>
        <Route path="/mycourse" component={myCourse} />
      </div>
    </Router>
  );
};

export default MyCourse;
