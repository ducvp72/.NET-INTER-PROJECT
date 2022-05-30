import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import React from "react";
import notification from "../../assets/notification.png";
import sound from "../../assets/sound.png";
import ChatIcon from "@material-ui/icons/Chat";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    top: 0,
    margin: 0,
    height: "100%",
  },
  title: {
    display: "flex",
    alignItems: "center",

    background: theme.palette.primary.main,
  },
  titleText: {
    fontSize: "20px",
    fontWeight: 500,
    textDecoration: "none",
    color: theme.palette.common.white,

    margin: 0,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "bold",
    lineHeight: "1.5rem",
  },
  notifyname: {
    color: "blue",
    "&:hover": {
      color: "#0E1E40",
    },
  },
}));
const Notification = () => {
  const classes = useStyles();
  const [notify, setNotify] = useState([]);
  const getNotification = async () => {
    try {
      const fetch = {
        method: "get",
        url: "http://group04lms.japaneast.azurecontainer.io/api/Notification/AllNotify",
      };
      const res = await axios(fetch);
      setNotify(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNotification();
  }, [getNotification]);
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <img src={notification} width="50px" height="50px" alt="" />
        <h3 className={classes.titleText}>Thông báo</h3>
        <img
          style={{
            marginLeft: "auto",
          }}
          src={sound}
          width="50"
          height="50"
          alt=""
        />
      </div>
      <div className={classes.content}>
        {notify?.map((notifies, index) => (
          <Accordion square key={index}>
            <AccordionSummary expandIcon={<ChatIcon />}>
              <Typography className={classes.notifyname} variant="p">
                {notifies?.notifyName}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="p">{notifies?.notifyDetail}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};
export default Notification;
