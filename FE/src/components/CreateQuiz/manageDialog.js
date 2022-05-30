import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { actGetListQuestion } from "../Question/Modules/actions";
const schema = yup.object().shape({
  quizID: yup.string().required("Vui lòng nhập ID của quiz !!!"),
  questionNo: yup.string().required("Vui lòng nhập thứ tự câu hỏi !!!"),
  question: yup.string().required("Vui lòng nhập câu hỏi !!"),
  rightAnswer: yup.string().required("Vui lòng nhập đáp án đúng"),
  wrongAnswer1: yup.string().required("Vui lòng nhập đáp án sai 1"),
  wrongAnswer2: yup.string().required("Vui lòng nhập đáp án sai 2"),
  wrongAnswer3: yup.string().required("Vui lòng nhập đáp án sai 3"),
  questionScore: yup.string().required("Vui lòng nhập điểm cho câu hỏi !!!"),
});

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  formControl: {
    width: "100%",
  },
  button: {
    marginRight: "8px",
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography color="secondary" variant="h3" align="center">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function ManageDialog(props) {
  const { openDialog, setOpenDialog, handleCloseDialog, modal, quiz } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [questions, setQuestions] = useState({
    quizID: "",
    questionNo: "",
    question: "",
    rightAnswer: "",
    wrongAnswer1: "",
    wrongAnswer2: "",
    wrongAnswer3: "",
    questionScore: "",
  });
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setQuestions({
      ...questions,
      [name]: value,
    });
  };
  const onAddSubmit = () => {
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Quiz/CreateQuestion`,
      method: "POST",
      params: {
        QuizID: questions.quizID,
      },
      data: questions,
    })
      .then(() => {
        setOpenDialog(false);
        dispatch(actGetListQuestion(quiz.quizID));
        alert("Tạo thành công");
      })
      .catch((error) => {
        console.log(error);
        setOpenDialog(false);
      });
  };

  return (
    <div>
      <Dialog maxWidth="xs" onClose={handleCloseDialog} open={openDialog}>
        <DialogTitle onClose={handleCloseDialog}>{modal.title}</DialogTitle>
        <DialogContent dividers>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="quizID"
                  label="Quiz ID"
                  name="quizID"
                  autoComplete="quizID"
                  inputRef={register}
                  error={!!errors.quizID}
                  helperText={errors?.quizID?.message}
                  value={questions.quizID}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="questionNo"
                  label="Question No"
                  name="questionNo"
                  autoComplete="questionNo"
                  inputRef={register}
                  error={!!errors.questionNo}
                  helperText={errors?.questionNo?.message}
                  value={questions.questionNo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="question"
                  label="Question"
                  name="question"
                  autoComplete="question"
                  inputRef={register}
                  error={!!errors.question}
                  helperText={errors?.question?.message}
                  value={questions.question}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="rightAnswer"
                  label="Right Answer"
                  name="rightAnswer"
                  autoComplete="rightAnswer"
                  inputRef={register}
                  error={!!errors.rightAnswer}
                  helperText={errors?.rightAnswer?.message}
                  value={questions.rightAnswer}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="wrongAnswer1"
                  label="Wrong Answer 1"
                  name="wrongAnswer1"
                  autoComplete="wrongAnswer1"
                  inputRef={register}
                  error={!!errors.wrongAnswer1}
                  helperText={errors?.wrongAnswer1?.message}
                  value={questions.wrongAnswer1}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="wrongAnswer2"
                  label="Wrong Answer 2"
                  name="wrongAnswer2"
                  autoComplete="wrongAnswer2"
                  inputRef={register}
                  error={!!errors.wrongAnswer2}
                  helperText={errors?.wrongAnswer2?.message}
                  value={questions.wrongAnswer2}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="wrongAnswer3"
                  label="Wrong Answer 3"
                  name="wrongAnswer3"
                  autoComplete="wrongAnswer3"
                  inputRef={register}
                  error={!!errors.wrongAnswer3}
                  helperText={errors?.wrongAnswer3?.message}
                  value={questions.wrongAnswer3}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="questionScore"
                  label="Question Score"
                  name="questionScore"
                  autoComplete="questionScore"
                  inputRef={register}
                  error={!!errors.questionScore}
                  helperText={errors?.questionScore?.message}
                  value={questions.questionScore}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={modal.id === "tao" ? handleSubmit(onAddSubmit) : null}
          >
            {modal.button}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
