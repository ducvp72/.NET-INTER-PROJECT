import { Container, Grid, Hidden, Typography } from "@material-ui/core";
import React from "react";
import Carousel from "../../../components/Carousel";
import CourseList from "../../../components/CourseList";
import Notification from "../../../components/Notification";
import TopicList from "../../../components/TopicList";
import { Helmet } from "react-helmet";
import CourseEnrolled from "../../../components/CourseEnrolled";
import FeedBackList from "../../../components/FeedBackList";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  title: {
    display: "inline-block",
    fontSize: "24px",
    marginBottom: "20px",
    position: "relative",
    "&::after": {
      position: "absolute",
      display: "block",
      content: "''",

      bottom: "-5px",
      left: "0",

      height: "2px",
      width: "120%",

      backgroundColor: theme.palette.primary.main,
    },
  },
}))

function HomePage(props) {
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title>LMS - Trang chủ</title>
        <meta charSet="utf-8" name="description" content="Trang chủ" />
      </Helmet>
      <Hidden xsDown>
        <Carousel />
      </Hidden>
      {loginInfo && loginInfo.userRole === "student" ? <CourseEnrolled /> : ""}
      <CourseList />
      <Container maxWidth="lg">
      <Typography
              variant="h2"
              color="primary"
              component="p"
              className={classes.title}
            >
              Thông báo - Thảo luận
            </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Notification />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TopicList />
          </Grid>
        </Grid>
      </Container>
      <FeedBackList />
    </>
  );
}

export default HomePage;
