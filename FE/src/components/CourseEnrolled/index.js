import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Container, Grid } from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import BackgroundImage from "../../assets/fhqx-bg.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "40px",
  },
  container: {},
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
  courseLink: {
    textDecoration: "none",
    color: "black",
  },
  courseBox: {
    "&:hover": {},
    "&:hover $courseImg": {
      boxShadow:
        "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
    },
    "&:hover $courseInfo": {
      visibility: "hidden",
      opacity: 0,
    },
    "&:hover $courseButton": {
      visibility: "visible",
      opacity: 1,
    },
  },
  courseImg: {
    position: "relative",
    height: "224px",

    backgroundPosition: "center center !important ",
    backgroundSize: "cover !important",
    backgroundRepeat: "no-repeat !important",

    marginBottom: "10px",

    borderRadius: "4px",

    overflow: "hidden !important",
  },
  courseInfoWrapper: {
    position: "relative",
  },

  courseInfo: {
    position: "relative",

    visibility: "visible",
    opacity: 1,
    transition: "all .3s",
  },
  courseButton: {
    position: "absolute",
    top: "10px",
    left: 0,

    padding: "15px",
    width: "100%",

    fontSize: "18px",
    textAlign: "center",

    visibility: "hidden",
    opacity: 0,
    transition: "all .3s",
  },

  courseName: {
    height: "32px",
    maxHeight: "32px",

    fontSize: "18px",
    fontWeight: 500,
    color: theme.palette.common.black,
    lineHeight: "32px",
    textAlign: "left",

    display: "-webkit-box",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  courseDetail: {
    height: "42px",
    maxHeight: "42px",

    fontSize: "15px",
    color: theme.palette.common.black,
    lineHeight: "22px",
    textAlign: "left",

    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  courseDuration: {
    fontSize: "15px",
    fontWeight: 500,
    textAlign: "left",
    color: "#4a4a4a",
    lineHeight: 1.42,

    margin: "2px 0 4px 0 ",

    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
}));

const CourseEnrolled = () => {
  const classes = useStyles();
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [courseList, setCourseList] = useState(null);
  const [enrolledCourse, setEnrolledCourse] = useState([]);

  useEffect(() => {
    let coursesID = [];
    axios
      .get(
        `http://group04lms.japaneast.azurecontainer.io/api/Course/GetEnrolledCourse/${loginInfo.id}`
      )
      .then((res) => {
        res.data.map((item) => coursesID.push(item.courseID));
        setEnrolledCourse(coursesID);
      });
  }, [loginInfo.id]);

  useEffect(() => {
    let courses = [];
    axios
      .get(`http://group04lms.japaneast.azurecontainer.io/api/Course/AllCourse`)
      .then((res) => {
        courses = res.data.data.filter((item) =>
          enrolledCourse.includes(item.courseID)
        );
        setCourseList(courses);
      });
  }, [enrolledCourse]);

  return (
    <section id="course-list" className={classes.root}>
      <Container component="div" maxWidth="lg" className={classes.container}>
        {courseList && courseList.length > 0 ? (
          <Typography
            variant="h2"
            color="primary"
            component="p"
            className={classes.title}
          >
            Khóa học đã đăng ký
          </Typography>
        ) : (
          ""
        )}
        <Grid container spacing={2}>
          {courseList &&
            courseList.map((item, index) => {
              return (
                <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
                  <Link
                    className={classes.courseLink}
                    to={`/course/id/${item.courseID}`}
                  >
                    <div className={classes.courseBox}>
                      <div
                        className={classes.courseImg}
                        style={{
                          background: `url(http://group04lms.japaneast.azurecontainer.io/api/Course/GetUrlFile/${item.courseID}),url(${BackgroundImage})`,
                        }}
                      ></div>
                      <div className={classes.courseInfoWrapper}>
                        <div className={classes.courseInfo}>
                          <Typography
                            component="p"
                            className={classes.courseName}
                          >
                            {item.courseName}
                          </Typography>
                          <Typography
                            component="p"
                            className={classes.courseDetail}
                          >
                            <span
                              style={{
                                fontWeight: 500,
                              }}
                            ></span>
                            {item.courseDetail}
                          </Typography>
                          <Typography
                            component="p"
                            className={classes.courseDuration}
                          >
                            Thời gian: {item.courseDuration} tháng
                          </Typography>
                        </div>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.courseButton}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </section>
  );
};
export default CourseEnrolled;
