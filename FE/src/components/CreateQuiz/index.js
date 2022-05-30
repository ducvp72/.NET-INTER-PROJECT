import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import { Box } from "@material-ui/core";
import Swal from "sweetalert2";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { TextField } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { actGetListQuiz } from "./modules/action";
import ManageDialog from "./manageDialog";
import { actGetListQuestion } from "../Question/Modules/actions";
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  input1: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    margin: "15px 15px",
  },
  inputDate: {
    display: "flex",
    flexDirection: "column",
    width: "200px",
    margin: "15px 15px",
  },
  form: {
    display: "flex",
  },
  checkbox: {
    display: "flex",
    flexDirection: "column",
    width: "310px",
    margin: "15px 15px",
  },
  question: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
  },

  table: {
    width: "700px",
  },
  button: {
    margin: "10px",
    width: "200px",
  },
  btnCreate: {
    width: "200px",
    marginLeft: "100px",
  },
  loaderBox: {
    display: "inline-block",
    zIndex: "100",

    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  quizForm: {
    display: "flex",
  },
  tableQuestion: {
    display: "flex",
    marginTop: "50px",
    justifyContent: "end",
    flexDirection: "column",
    marginLeft: "560px",
  },
  selectQuizID: {
    width: "200px",
    height: "25px",
  },
  iconButton: {
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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const schema = yup.object().shape({
  quizID: yup.string().required("ID đang trống!!!"),
  quizName: yup.string().required("Ten quiz không được bỏ trống !!!"),
  quizDetail: yup.string().required("Quiz detail không bỏ trống !!!"),
  lessonID: yup.string().required("Lesson ID không được bỏ trống !!!"),
});

export default function FullScreenDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const listQuiz = useSelector((state) => state.listQuizReducer);
  const listQuestion = useSelector((state) => state.listQuestionReducer);
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartData] = useState(new Date("2021-08-24"));
  const [endDate, setEndDate] = useState(new Date("2021-08-25"));
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [ID, setID] = useState([]);
  const [idQuiz, setIdQuiz] = useState({
    quizId: "1",
  });
  const [quiz, setQuiz] = useState({
    quizID: "",
    quizName: "",
    quizDetail: "",
    lessonID: "",
  });
  console.log(idQuiz.quizId);
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setQuiz({
      ...quiz,
      [name]: value,
    });
  };
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });
  useEffect(() => {
    dispatch(actGetListQuiz());
    dispatch(actGetListQuestion(idQuiz.quizId));
  }, [idQuiz.quizId]);

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const getAllQuiz = async () => {
    try {
      const fetch = {
        url: "http://group04lms.japaneast.azurecontainer.io/api/Quiz/List",
        method: "get",
      };
      const res = await axios(fetch);
      setID(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllQuiz();
  }, []);
  const handleAdd = () => {
    setModal({
      title: "Tạo câu hỏi",
      button: "Tạo",
      id: "tao",
    });
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleDateChange = (date) => {
    setStartData(date);
  };
  const handleDateChange2 = (date) => {
    setEndDate(date);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
    data["startTime"] = moment(startDate).format("yyyy-MM-DD");
    data["endTime"] = moment(endDate).format("yyyy-MM-DD");

    setLoading(true);

    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Quiz/CreateQuiz`,
      method: "POST",
      data,
    })
      .then((result) => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Tạo quiz thành công",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          dispatch(actGetListQuiz());
        });
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
      });
  };
  const renderQuizList = (data) => {
    return data?.map((quiz, index) => {
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            {quiz.quizID}
          </TableCell>
          <TableCell align="left">{quiz.quizName}</TableCell>
          <TableCell align="left">{quiz.startTime}</TableCell>
          <TableCell align="left">{quiz.endTime}</TableCell>
          <TableCell align="left">{quiz.quizDetail}</TableCell>
          <TableCell align="left">{quiz.lessonID}</TableCell>
          <TableCell align="center">
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Tạo
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };
  const renderQuestionList = (data) => {
    return data?.map((question, index) => {
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            {question.questionNo}
          </TableCell>
          <TableCell align="left">{question.question}</TableCell>
          <TableCell align="left">{question.rightAnswer}</TableCell>
          <TableCell align="left">{question.wrongAnswer1}</TableCell>
          <TableCell align="left">{question.wrongAnswer2}</TableCell>
          <TableCell align="left">{question.wrongAnswer3}</TableCell>
          <TableCell align="left">{question.quizID}</TableCell>
        </TableRow>
      );
    });
  };
  return (
    <>
      <ManageDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleCloseDialog={handleCloseDialog}
        modal={modal}
        quiz={ID}
      />
      <div>
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
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClickOpen}
          className={classes.iconButton}
        >
          Tạo quiz
        </Button>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Create quiz
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.divider}>
            <div className={classes.quizForm}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={classes.form}>
                  <div className={classes.input1}>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      required
                      fullWidth
                      id="quizID"
                      label="Mã quiz"
                      name="quizID"
                      autoComplete="quizID"
                      inputRef={register}
                      error={!!errors.quizID}
                      helperText={errors?.quizID?.message}
                      value={quiz.quizID}
                      onChange={handleChange}
                    />
                    <TextField
                      variant="outlined"
                      margin="dense"
                      required
                      fullWidth
                      id="quizName"
                      label="Quiz name"
                      name="quizName"
                      autoComplete="quizName"
                      inputRef={register}
                      error={!!errors.quizName}
                      helperText={errors?.quizName?.message}
                      value={quiz.quizName}
                      onChange={handleChange}
                    />
                    <TextField
                      variant="outlined"
                      margin="dense"
                      required
                      fullWidth
                      id="quizDetail"
                      label="Quiz detail"
                      name="quizDetail"
                      autoComplete="quizDetail"
                      inputRef={register}
                      error={!!errors.quizDetail}
                      helperText={errors?.quizDetail?.message}
                      value={quiz.quizDetail}
                      onChange={handleChange}
                    />
                    <TextField
                      variant="outlined"
                      margin="dense"
                      required
                      fullWidth
                      id="lessonID"
                      label="Lesson ID"
                      name="lessonID"
                      autoComplete="lessonID"
                      inputRef={register}
                      error={!!errors.lessonID}
                      helperText={errors?.lessonID?.message}
                      value={quiz.lessonID}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={classes.inputDate}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="dense"
                        id="date-picker-dialog-register"
                        label="Ngày bắt đầu"
                        format="MM/dd/yyyy"
                        name="startDate"
                        value={startDate}
                        onChange={handleDateChange}
                        className={classes.datePicker}
                      />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="dense"
                        id="date-picker-dialog-register2"
                        label="Ngày kết thúc"
                        format="MM/dd/yyyy"
                        name="endDate"
                        value={endDate}
                        onChange={handleDateChange2}
                        className={classes.datePicker}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.btnCreate}
                >
                  Create
                </Button>
              </form>
              <TableContainer
                className={classes.table}
                elevation={3}
                component={Paper}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px">QuizID</TableCell>
                      <TableCell width="150px">QuizName</TableCell>
                      <TableCell width="130px">Start Date</TableCell>
                      <TableCell width="125px">End Date</TableCell>
                      <TableCell width="150px">QuizDetail</TableCell>
                      <TableCell width="50px">LessonID</TableCell>
                      <TableCell width="150px"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listQuiz.data ? renderQuizList(listQuiz.data) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className={classes.tableQuestion}>
              <select
                value={idQuiz.quizId}
                onChange={(e) => {
                  setIdQuiz({
                    quizId: e.target.options[e.target.selectedIndex].value,
                  });
                }}
                className={classes.selectQuizID}
              >
                {ID?.map((id, index) => (
                  <option key={index} value={id.quizID}>
                    {id.quizID}
                  </option>
                ))}
              </select>
              <TableContainer
                className={classes.table}
                elevation={3}
                component={Paper}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px">Question No</TableCell>
                      <TableCell width="150px">Question</TableCell>
                      <TableCell width="125px">Right Answer</TableCell>
                      <TableCell width="125px">Wrong Answer1</TableCell>
                      <TableCell width="125px">Wrong Answer1</TableCell>
                      <TableCell width="125px">Wrong Answer1</TableCell>
                      <TableCell width="50px">Quiz ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listQuestion.data
                      ? renderQuestionList(listQuestion.data)
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
}
