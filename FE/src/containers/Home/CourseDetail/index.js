import {
  Container,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@material-ui/core";
import { ScaleLoader } from "react-spinners";
import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import CreateQuiz from "../../../components/CreateQuiz";
import YouTube from "react-youtube";
const useStyles = makeStyles((theme) => ({
  root: {},
  loaderRoot: {
    opacity: 0.5,
  },
  loaderBox: {
    display: "inline-block",
    zIndex: 999,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  container: {
    background: "#0e1e40",
    padding: "50px",
    color: "#fff",
    marginBottom: "30px",
  },
  courseHeading: {
    fontSize: "40px",
  },
  courseDetail: {
    fontSize: "20px",
    paddingBottom: "10px",
  },
  courseTopic: {
    fontSize: "20px",
    paddingBottom: "15px",
  },
  courseLearn: {
    marginBottom: "20px",
  },
  lessonLink: {
    textDecoration: "none",
    color: "#0e1e40",
    "&:hover": {
      textDecoration: "underline",
    },
    fontWeight: "500",
  },
  accordionDetail: {
    flexDirection: "column",
  },
  button: {
    display: "block",
    padding: "10px",
    backgroundColor: "#0e1e40",
    color: "#fff",
    fontSize: "16px",
    width: "100%",
    "&:hover": {
      backgroundColor: "#10224a",
    },
    marginTop: "10px",
  },
  lessonItem: {
    padding: "10px",
  },
  containerLesson: {
    flex: "50%",
  },
  accordionTitle: {
    fontWeight: "bold",
  },
  addCourseDetail: {
    width: "100%",
    fontFamily: "Roboto, sans-serif",
  },
  action: {
    display: "block",
  },
  courseQuiz: {
    marginTop: "40px",
    fontSize: "20px",
    paddingBottom: "15px",
  },
  youtube: {
    marginTop: "10px",
  },
}));
const schema = yup.object().shape({
  lessonID: yup
    .string()
    .required("ID đang trống !!!")
    .max(5, "ID không vượt quá 5 ký tự !!!"),
  lessonName: yup.string().required("Tên bài học đang trống !!!"),
  lessonDetail: yup.string().required("Chi tiết bài học đang trống !!!"),
  lessonDuration: yup.number().required("Duration bài học đang trống"),
});
export default function CourseDetail(props) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const classes = useStyles();
  const [lessons, setLessons] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [course, setCourse] = useState({});
  const courseID = props.match.params.id;
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [lesson, setLesson] = useState({
    lessonID: "",
    lessonName: "",
    lessonDetail: "",
    lessonDuration: 0,
    urlLesson: "",
  });
  let lessonIDList = [];
  const [errorNotify, setErrorNotify] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleEnroll = () => {
    if (loginInfo) {
      const data = {};
      data["courseID"] = courseID;
      data["accountID"] = loginInfo.id;
      setLoading(true);
      axios({
        url: `http://group04lms.japaneast.azurecontainer.io/api/Course/UserEnrollCourse`,
        method: "POST",
        data,
      })
        .then((result) => {
          loginInfo.enrolled.push(courseID);
          localStorage.setItem("user", JSON.stringify(loginInfo));
          setLoading(false);
          setErrorNotify(null);
          Swal.fire({
            icon: "success",
            title: "Đăng ký khóa học thành công",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.data && error.response) {
            setErrorNotify(error.response.data);
          }
        });
    } else {
      history.push("/login");
    }
  };
  const handleSubmitFile = () => {
    history.push("/submit");
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setLesson({
      ...lesson,
      [name]: value,
    });
  };

  const opts = {
    height: "200",
    width: "350",
    playerVars: {
      autoplay: 0,
    },
  };
  const videoOnReady = (event) => {
    event.target.pauseVideo();
  };
  const handleMember = () => {
    history.push(`/member/${courseID}`);
  };
  const onSubmit = (data) => {
    data["courseID"] = courseID;
    setLoading(true);
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Lesson/CreateLesson`,
      method: "POST",
      data,
    })
      .then((result) => {
        console.log(result.data);
        setLoading(false);
        setOpenDialog(false);
        setErrorNotify(null);
        Swal.fire({
          icon: "success",
          title: "Thêm bài học thành công",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data && error.response) {
          setErrorNotify(error.response.data);
        }
      });
  };
  useEffect(() => {
    axios
      .get(`http://group04lms.japaneast.azurecontainer.io/api/Home/${courseID}`)
      .then((res) => {
        setCourse(res.data);
      });
  }, [courseID]);

  useEffect(() => {
    axios
      .get(
        `http://group04lms.japaneast.azurecontainer.io/api/Course/${courseID}`
      )
      .then((res) => {
        res.data.map((item) => lessonIDList.push(item.lessonID));
        setLessons(res.data);
      });
  }, [courseID, lessons, lessonIDList]);

  useEffect(() => {
    axios
      .get(`http://group04lms.japaneast.azurecontainer.io/api/Quiz/List`)
      .then((res) => {
        let quizList = [];
        quizList = res.data.filter((item) =>
          lessonIDList.includes(item.lessonID)
        );
        setQuizzes(quizList);
      });
  }, []);

  const renderVideo = (url) => {
    if (loginInfo) {
      if (loginInfo.userRole === "student") {
        if (loginInfo.enrolled.includes(courseID)) {
          return (
            <YouTube
              className={classes.youtube}
              videoId={url}
              opts={opts}
              onPause={videoOnReady}
              onReady={videoOnReady}
            />
          );
        } else {
          return "";
        }
      } else {
        return (
          <YouTube
            className={classes.youtube}
            videoId={url}
            opts={opts}
            onPause={videoOnReady}
            onReady={videoOnReady}
          />
        );
      }
    } else {
      return "";
    }
  };

  const renderButton = () => {
    if (loginInfo) {
      if (loginInfo.userRole === "teacher") {
        return (
          <div>
            <Button
              size="small"
              color="primary"
              className={classes.button}
              onClick={handleOpenDialog}
            >
              Thêm bài học
            </Button>
            <CreateQuiz></CreateQuiz>
            <Button
              size="small"
              color="primary"
              className={classes.button}
              onClick={handleMember}
            >
              Danh sách học viên
            </Button>
          </div>
        );
      } else if (loginInfo.userRole === "instructor") {
        return (
          <div>
            <Button
              size="small"
              color="primary"
              className={classes.button}
              onClick={handleOpenDialog}
            >
              Thêm bài học
            </Button>
          </div>
        );
      } else if (loginInfo.userRole === "mentor") {
        return (
          <div>
            <Button
              size="small"
              color="primary"
              className={classes.button}
              onClick={handleMember}
            >
              Danh sách học viên
            </Button>
          </div>
        );
      } else if (loginInfo.userRole === "classAdmin") {
        return "";
      } else if (loginInfo.enrolled.includes(courseID)) {
        return (
          <Button
            size="small"
            className={classes.button}
            onClick={handleSubmitFile}
          >
            Nộp bài tập
          </Button>
        );
      } else {
        return (
          <Button
            size="small"
            color="primary"
            className={classes.button}
            onClick={handleEnroll}
          >
            Đăng ký
          </Button>
        );
      }
    } else {
      return (
        <Button
          size="small"
          color="primary"
          className={classes.button}
          onClick={handleEnroll}
        >
          Đăng ký
        </Button>
      );
    }
  };
  return (
    <>
      <div className={classes.container}>
        <Container>
          <div>
            <Typography variant="h3" className={classes.courseHeading}>
              {course.courseName}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              className={classes.courseDetail}
            >
              {course.courseDetail}
            </Typography>
            <Typography variant="body2" component="span">
              Thời gian: {course.courseDuration} tháng
            </Typography>
          </div>
        </Container>
      </div>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <div>
              <Typography variant="h5" className={classes.courseTopic}>
                Bài học
              </Typography>
              <Grid container>
                {lessons?.map((lesson) => (
                  <Grid
                    className={classes.lessonItem}
                    key={lesson.lessonID}
                    item
                    xs={12}
                    sm={6}
                  >
                    <Link className={classes.lessonLink} href="#">
                      {lesson.lessonName}
                    </Link>
                    {renderVideo(lesson.urlLesson)}
                  </Grid>
                ))}
              </Grid>
            </div>
            <div>
              <Typography variant="h5" className={classes.courseQuiz}>
                Bài kiểm tra
              </Typography>
              {quizzes.map((quiz) => {
                if (
                  loginInfo &&
                  loginInfo.userRole === "student" &&
                  loginInfo.enrolled.includes(courseID)
                ) {
                  return (
                    <div className={classes.lessonItem} key={quiz.quizID}>
                      <Link
                        className={classes.lessonLink}
                        to={`/quiz/${quiz.quizID}`}
                      >
                        {quiz.quizName}
                      </Link>
                    </div>
                  );
                } else {
                  return (
                    <div className={classes.lessonItem} key={quiz.quizID}>
                      <Link className={classes.lessonLink} href="#">
                        {quiz.quizName}
                      </Link>
                    </div>
                  );
                }
              })}
            </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="courseImage"
                  height="200"
                  image={`http://group04lms.japaneast.azurecontainer.io/api/Course/GetUrlFile/${course.courseID}`}
                  title="CourseImage"
                ></CardMedia>
                <CardActions className={classes.action}>
                  {renderButton()}
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Box className={classes.loaderBox}>
        <ScaleLoader
          color="#f50057"
          loading={loading}
          height={45}
          width={5}
          radius={10}
          margin={4}
        />
      </Box>
      <div className={`${classes.root} ${loading ? classes.loaderRoot : null}`}>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle onClose={handleCloseDialog}>
            <Typography variant="h3" align="center" color="secondary">
              Thêm bài học
            </Typography>
          </DialogTitle>
          <DialogContent dividers onSubmit={handleSubmit(onSubmit)}>
            <form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    id="lessonID"
                    label="Mã bài học"
                    name="lessonID"
                    autoComplete="lessonID"
                    inputRef={register}
                    error={!!errors.lessonID}
                    helperText={errors?.lessonID?.message}
                    value={lesson.lessonID}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    id="lessonName"
                    label="Tên bài học"
                    name="lessonName"
                    autoComplete="lessonName"
                    inputRef={register}
                    error={!!errors.lessonName}
                    helperText={errors?.lessonName?.message}
                    value={lesson.lessonName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    id="lessonDetail"
                    label="Mô tả"
                    name="lessonDetail"
                    autoComplete="lessonDetail"
                    inputRef={register}
                    error={!!errors.lessonDetail}
                    helperText={errors?.lessonDetail?.message}
                    value={lesson.lessonDetail}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    id="lessonDuration"
                    label="Thời hạn"
                    name="lessonDuration"
                    autoComplete="lessonDuration"
                    inputRef={register}
                    error={!!errors.lessonDuration}
                    helperText={errors?.lessonDuration?.message}
                    value={lesson.lessonDuration}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    id="urlLesson"
                    label="URL Video (Không bắt buộc)"
                    name="urlLesson"
                    autoComplete="urlLesson"
                    inputRef={register}
                    value={lesson.urlLesson}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              {errorNotify ? <h5>{errorNotify}</h5> : null}
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  autoFocus
                  color="secondary"
                >
                  Thêm
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
