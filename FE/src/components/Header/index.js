import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../../assets/logo.png";
import DehazeIcon from "@material-ui/icons/Dehaze";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Avatar,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@material-ui/core";
import CreateNotify from "../Notification/create";
import CreateTopic from "../Topic/create";
import SearchIcon from "@material-ui/icons/Search";
import { actGetCourseList } from "../CourseList/modules/action";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",

    // Tin fix
    padding: "16px 8px",
    boxShadow: "0 0 15px rgb(0 0 0 / 30%)",
  },

  // Tin fix
  logo: {
    width: "80px",
  },

  toggle: {
    display: "none",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  menu: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    listStyle: "none",
  },
  auth: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    listStyle: "none",
  },
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchbar: {
    padding: "10px 20px",
    width: "400px",
    borderRadius: "10px",
    outline: "none",
    marginRight: "10px",
  },
  link: {
    textDecoration: "none",
    marginLeft: "25px",
    textTransform: "uppercase",
    color: "#0e1e40",
    position: "relative",
    "&::after": {
      content: '""',
      display: "block",
      height: "2px",
      left: "70%",
      bottom: "-10%",
      position: "absolute",
      background: "#0e1e40",
      width: 0,
    },
    "&:hover::after": {
      width: "100%",
      left: 0,
    },
  },
  avatarMenu: {
    display: "flex",
    flexDirection: "column",
    listStyle: "none",
    padding: "0 15px",
    "& $li:not(:first-child)": {
      paddingTop: "15px",
    },
  },
  avatarName: {
    color: "#fff",
    fontWeight: "bold",
  },
  avatar: {
    marginLeft: "50px",
    textTransform: "uppercase",
    backgroundColor: theme.palette.primary.main,
    cursor: "pointer",
  },
  avatarMenuContainer: {
    position: "absolute",
    top: "120%",
    left: "74%",
    backgroundColor: "#0e1e40",
    zIndex: "20",
    display: "none",
  },
  avatarLink: {
    color: "white",
    marginLeft: 0,
    textDecoration: "none",
  },
  isShowAvatarMenu: {
    display: "block",
  },
  ["@media (max-width: 1439px)"]: {
    root: {
      flexWrap: "wrap",
      justifyContent: "center",
    },
    search: {
      paddingLeft: "60px",
    },
  },
  ["@media (max-width: 815px)"]: {
    root: {
      justifyContent: "space-between",
      position: "relative",
    },
    search: {
      display: "none",
    },
    nav: {
      position: "absolute",
      right: 0,
      top: "100px",
      zIndex: "10",
      backgroundColor: "#fff",
      width: "100%",
      height: "350px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      display: "none",
    },
    auth: {
      display: "none",
    },
    toggle: {
      display: "inline-block",
    },
    menu: {
      flexDirection: "column",
      padding: 0,
      "& $li": {
        marginBottom: "15px",
      },
    },
    auth: {
      flexDirection: "column",
      padding: 0,
      "& $li": {
        marginBottom: "15px",
      },
    },
    show: {
      display: "block",
    },
    link: {
      color: "#0e1e40",
      "&: hover": {
        color: "#e4e4e4",
      },
    },
    avatar: {
      display: "none",
    },
    avatarMenuContainer: {
      display: "block",
      position: "unset",
      backgroundColor: "#fff",
    },
    avatarName: {
      color: "#0e1e40",
      marginLeft: "25px",
    },
    avatarLink: {
      color: "#0e1e40",
      marginLeft: "25px",
    },
    avatarMenu: {
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));
export default function Header() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const classMenuResult = showMenu ? classes.show : "";
  const classAvatarMenuResult = showAvatarMenu ? classes.isShowAvatarMenu : "";
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const handleLogout = () => {
    localStorage.removeItem("user");
    Swal.fire({
      icon: "success",
      title: "Đăng xuất thành công",
      text: "Cảm ơn bạn đã sử dụng Group 04 LMS",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const renderAdmin = () => {
    if (loginInfo.userRole === "admin") {
      return (<li>
        <Link
          underline="none"
          className={classes.avatarLink}
          to="/manage-user"
        >
          Quản lý
        </Link>
      </li>)
    }
    else if (loginInfo.userRole === "teacher") {
      return (
        <li>
        <Link
          underline="none"
          className={classes.avatarLink}
          to="/manage-lesson"
        >
          Quản lý
        </Link>
      </li>
      )
    }
    else if (loginInfo.userRole === "instructor") {
      return (
        <li>
        <Link
          underline="none"
          className={classes.avatarLink}
          to="/manage-lesson"
        >
          Quản lý
        </Link>
      </li>
      )
    }
    else if (loginInfo.userRole === "classAdmin") {
      return (
        <li>
        <Link
          underline="none"
          className={classes.avatarLink}
          to="/manage-topic"
        >
          Quản lý
        </Link>
      </li>
      )
    }
    else {
      return null;
    }
  }

  return (
    <>
      <div className={classes.root}>
        <Link to="/">
          <img src={Logo} alt="logo" className={classes.logo} />
        </Link>
        <div className={classes.search}>
          <input
            className={classes.searchbar}
            type="text"
            autoComplete="off"
            placeholder="Tìm kiếm khóa học"
          />
          <SearchIcon fontSize="large" />
        </div>
        <div className={classes.nav + " " + classMenuResult}>
          <ul className={classes.menu}>
            <li>
              <Link underline="none" className={classes.link} to="/">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link underline="none" className={classes.link} href="#">
                Khoá học
              </Link>
            </li>
            <li>
              <Link underline="none" className={classes.link} href="#">
                Blog
              </Link>
            </li>
            <li>
              <Link underline="none" className={classes.link} href="#">
                Liên hệ
              </Link>
            </li>
            <li>
              <Link underline="none" className={classes.link} href="#">
                Về chúng tôi
              </Link>
            </li>
          </ul>
          {loginInfo ? (
            <div>
              <Avatar
                className={classes.avatar}
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              >
                {loginInfo.name.charAt(0)}
              </Avatar>
              <div
                className={
                  classes.avatarMenuContainer + " " + classAvatarMenuResult
                }
              >
                <ul className={classes.avatarMenu}>
                  <li>
                    <Typography
                      className={classes.avatarName}
                      noWrap="true"
                      variant="body2"
                      component="span"
                    >
                      {loginInfo.name}
                    </Typography>
                  </li>
                  <li>
                    <Link
                      underline="none"
                      className={classes.avatarLink}
                      to="/profile"
                    >
                      Thông tin cá nhân
                    </Link>
                  </li>
                  {renderAdmin()}
                  {loginInfo.userRole === "student" ? (
                    <li>
                      <Link
                        underline="none"
                        className={classes.avatarLink}
                        to="/mycourse"
                      >
                        Khóa học của tôi
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                  {loginInfo.userRole === "student" ? (
                    <li>
                      <Link
                        underline="none"
                        className={classes.avatarLink}
                        to="/scorequiz"
                      >
                        Xem điểm
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                  {loginInfo.userRole === "teacher" ||
                  loginInfo.userRole === "classAdmin" ? (
                    <li>
                      <CreateNotify />
                    </li>
                  ) : (
                    ""
                  )}
                  {loginInfo.userRole === "teacher" ||
                  loginInfo.userRole === "classAdmin" ? (
                    <li>
                      <CreateTopic />
                    </li>
                  ) : (
                    ""
                  )}
                  <li>
                    <Link
                      underline="none"
                      className={classes.avatarLink}
                      to="/"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <ul className={classes.auth}>
              <li>
                <Link underline="none" className={classes.link} to="/register">
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link underline="none" className={classes.link} to="/login">
                  Đăng nhập
                </Link>
              </li>
            </ul>
          )}
        </div>
        <div onClick={() => setShowMenu(!showMenu)}>
          <DehazeIcon className={classes.toggle} />
        </div>
      </div>
    </>
  );
}
