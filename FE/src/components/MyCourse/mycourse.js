import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    maxWidth: 1000,
    margin: "15px 25px",
  },

  detail: {
    height: "100px",
    width: "500px",
  },
  area: {
    display: "flex",
    padding: "15px",
  },
  media: {
    width: "300px",
    objectFit: "fill",
  },
});

const MyCourse = () => {
  const classes = useStyles();
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [enrolledCourse, setEnrolledCourse] = useState([]);
  const [courses, setCourses] = useState([]);

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
    let courseList = [];
    axios
      .get(`http://group04lms.japaneast.azurecontainer.io/api/Course/AllCourse`)
      .then((res) => {
        courseList = res.data.data.filter((item) =>
          enrolledCourse.includes(item.courseID)
        );
        setCourses(courseList);
      });
  }, [enrolledCourse]);
  return (
    <div>
      <Container>
        {courses.length > 0 ? (
          courses.map((course) => {
            return (
              <Link href={`/course/id/${course.courseID}`}>
                <Card className={classes.root} key={course.courseID}>
                  <CardActionArea className={classes.area}>
                    <CardMedia
                      component="img"
                      alt="Contemplative Reptile"
                      height="200"
                      image={`http://group04lms.japaneast.azurecontainer.io/api/Course/GetUrlFile/${course.courseID}`}
                      title="Contemplative Reptile"
                      className={classes.media}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {course.courseName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        className={classes.detail}
                      >
                        {course.courseDetail}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            );
          })
        ) : (
          <Typography variant="h5">Bạn chưa đăng ký khóa học nào</Typography>
        )}
      </Container>
    </div>
  );
};

export default MyCourse;
