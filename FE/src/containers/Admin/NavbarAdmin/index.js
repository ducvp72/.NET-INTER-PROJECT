import React, { useState, useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import GroupIcon from "@material-ui/icons/Group";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import BarChartIcon from "@material-ui/icons/BarChart";
import NavItem from "./NavItem";
import { useDispatch, useSelector } from "react-redux";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Swal from "sweetalert2";
import uteAvatar from "../../../assets/ute_flower.jpg";
import SchoolIcon from "@material-ui/icons/School";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ForumIcon from "@material-ui/icons/Forum";
import FeedbackIcon from "@material-ui/icons/Feedback";

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 56,
    height: 56,
    marginBottom: theme.spacing(1),

    color: theme.palette.getContrastText(theme.palette.secondary.main),
    backgroundColor: theme.palette.secondary.main,
    textTransform: "uppercase",
  },
  //////////////////
  exitButton: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: "flex-start",
    letterSpacing: 0,
    padding: "10px 8px",
    textTransform: "none",
    width: "100%",
  },
  exitIcon: {
    marginRight: theme.spacing(1),
  },
  exitText: {
    marginRight: "auto",
  },
}));

const NavBarAdmin = ({ openDrawer, setOpenDrawer }) => {
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [items, setItems] = useState([]);
  let manage;
  useEffect(() => {
    if (loginInfo.userRole === "admin") {
      manage = [
        {
          href: "/manage-user",
          icon: GroupIcon,
          title: "Qu???n l?? ng?????i d??ng",
        },
        {
          href: "/manage-course",
          icon: SchoolIcon,
          title: "Qu???n l?? kh??a h???c",
        },
        {
          href: "/manage-lesson",
          icon: MenuBookIcon,
          title: "Qu???n l?? b??i h???c",
        },
        {
          href: "/manage-feedback",
          icon: FeedbackIcon,
          title: "Qu???n l?? ph???n h???i",
        },
        {
          href: "/manage-notification",
          icon: NotificationsIcon,
          title: "Qu???n l?? th??ng b??o",
        },
        {
          href: "/manage-topic",
          icon: ForumIcon,
          title: "Qu???n l?? topic",
        },
      ];
    } else if (loginInfo.userRole === "teacher") {
      manage = [
        {
          href: "/manage-course",
          icon: SchoolIcon,
          title: "Qu???n l?? kh??a h???c",
        },
        {
          href: "/manage-lesson",
          icon: MenuBookIcon,
          title: "Qu???n l?? b??i h???c",
        },
      ];
    } else if (loginInfo.userRole === "instructor") {
      manage = [
        {
          href: "/manage-lesson",
          icon: MenuBookIcon,
          title: "Qu???n l?? b??i h???c",
        },
      ];
    }
    else if (loginInfo.userRole === "classAdmin") {
      manage = [
        {
          href: "/manage-feedback",
          icon: FeedbackIcon,
          title: "Qu???n l?? ph???n h???i",
        },
        {
          href: "/manage-notification",
          icon: NotificationsIcon,
          title: "Qu???n l?? th??ng b??o",
        },
        {
          href: "/manage-topic",
          icon: ForumIcon,
          title: "Qu???n l?? topic",
        },
      ]
    }
    setItems(manage)
  }, []);

  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userReducer);

  let roleTemp = "";
  switch (user.userRole) {
    case "student": {
      roleTemp = "H???c vi??n";
      break;
    }
    case "teacher": {
      roleTemp = "Gi??o vi??n";
      break;
    }
    case "instructor": {
      roleTemp = "Tr??? gi???ng";
      break;
    }
    case "mentor": {
      roleTemp = "H??? tr??? l???p";
      break;
    }
    case "classAdmin": {
      roleTemp = "Admin l???p";
      break;
    }
    case "admin": {
      roleTemp = "Qu???n tr??? vi??n";
      break;
    }
    default: {
      break;
    }
  }

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          alt="Avatar"
          className={classes.avatar}
          onClick={() => history.push("/profile")}
        >
          {user.name.charAt(0)}
        </Avatar>
        <Typography
          gutterBottom
          className={classes.name}
          color="textPrimary"
          variant="h3"
        >
          {user.name}
        </Typography>
        <Typography gutterBottom color="textSecondary" variant="body2">
          {user.email}
        </Typography>
        <Typography gutterBottom color="textPrimary" variant="h4">
          Ch???c v???: {roleTemp}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>

      <Divider />

      <Box p={2}>
        <Button
          className={classes.exitButton}
          onClick={() => {
            Swal.fire({
              title: "B???n c?? mu???n ????ng xu???t ?",
              showCancelButton: true,
              confirmButtonText: `?????ng ??`,
              cancelButtonText: "H???y",
              icon: "question",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "???? ????ng xu???t",
                  text: "C???m ??n b???n ???? s??? d???ng LMS!",
                  icon: "success",
                  timer: "1800",
                });
                localStorage.removeItem("user");
                history.replace("/home");
              }
            });
          }}
        >
          <ExitToAppIcon className={classes.exitIcon} />
          <span className={classes.exitText}> ????ng xu???t</span>
        </Button>
      </Box>

      <Divider />

      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          variant="temporary"
          open={openDrawer}
          onClose={() => {
            setOpenDrawer(false);
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default NavBarAdmin;
