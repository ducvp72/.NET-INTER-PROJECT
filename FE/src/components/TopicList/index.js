import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actGetTopicList } from "../../containers/Home/TopicPage/modules/action";
import soundImg from "../../assets/sound.png";
import notificationImg from "../../assets/notification.png";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.common.white,

    height: "100%",
    border: "1px solid #ececec",
    borderRadius: theme.spacing(1),
  },
  topBar: {
    display: "flex",
    alignItems: "center",

    background: theme.palette.primary.main,
  },
  topBarImg: {
    height: "50px",
    width: "50px",
  },
  topBarText: {
    fontSize: "20px",
    fontWeight: 500,
    textDecoration: "none",
    color: theme.palette.common.white,
  },

  contentContainer: {
    padding: theme.spacing(0, 1),
  },
  contentBox: {
    padding: theme.spacing(1, 0),

    position: "relative",
    "&:after": {
      content: "''",
      display: "block",

      height: "1px",
      width: "95%",
      backgroundColor: "#ececec",

      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
  contentTitle: {
    display: "-webkit-box",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    overflow: "hidden",

    fontSize: "16px",
    fontWeight: 500,
  },
  contentDesc: {
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    overflow: "hidden",
    textAlign: "justify",

    fontWeight: 400,
  },
  noTopic: {
    padding: theme.spacing(2, 0),
  },
}));

function TopicList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const topicList = useSelector((state) => state.topicListReducer);

  useEffect(() => {
    dispatch(actGetTopicList());
  }, []);

  const renderTopicList = (arr) => {
    return arr.map((item) => {
      return (
        <Box className={classes.contentBox} key={item.topicID}>
          <Link className={classes.contentTitle} to="/topic">
            {item.topicName}
          </Link>
          <Typography
            className={classes.contentDesc}
            variant="h4"
            component="p"
          >
            {item.topicDetail}
          </Typography>
        </Box>
      );
    });
  };

  console.log("topic list data", topicList.data);

  return (
    <Box className={classes.root}>
      <Box className={classes.topBar}>
        <img
          className={classes.topBarImg}
          src={notificationImg}
          alt="notification-img"
        />
        <Link className={classes.topBarText} to="/topic">
          Thảo luận
        </Link>
        <img
          style={{
            marginLeft: "auto",
          }}
          className={classes.topBarImg}
          src={soundImg}
          alt="sound-img"
        />
      </Box>
      <Box className={classes.contentContainer}>
        {topicList.data && topicList.data.length > 0 ? (
          renderTopicList(topicList.data)
        ) : (
          <Typography className={classes.noTopic} variant="h3" component="p">
            Hiện không có chủ đề thảo luận nào...
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default TopicList;
