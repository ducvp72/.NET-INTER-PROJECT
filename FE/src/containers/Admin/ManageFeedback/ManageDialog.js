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
import moment from "moment";
import Swal from "sweetalert2";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import DateFnsUtils from "@date-io/date-fns";

const schema = yup.object().shape({
  feedbackName: yup.string().required("Tên bài đánh giá đang rỗng"),
  feedbackDetail: yup.string().required("Mô tả đánh giá đang rỗng"),
  ques1: yup.string().required("Câu hỏi đang rỗng"),
  ques2: yup.string().required("Câu hỏi đang rỗng"),
  ques3: yup.string().required("Câu hỏi đang rỗng"),
  ques4: yup.string().required("Câu hỏi đang rỗng"),
  ques5: yup.string().required("Câu hỏi đang rỗng"),
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

  ////
  datePicker: {
    display: "flex",
  },

  radioGroup: {
    flexDirection: "row",
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
  const { openDialog, setOpenDialog, handleCloseDialog } = props;
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const onSubmit = (data) => {
    data["expiredDate"] = moment(selectedDate).format("YYYY-MM-DD");

    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/controller/CreateFeedback`,
      method: "POST",
      data,
    })
      .then((result) => {
        setOpenDialog(false);
        // setLoginError(true);
        Swal.fire({
          icon: "success",
          title: "Thêm thành công !",
        });
      })
      .catch((error) => {
        setOpenDialog(false);
        // setLoginError(false);
        console.log(error);
      });
  };

  return (
    <div>
      <Dialog maxWidth="xs" onClose={handleCloseDialog} open={openDialog}>
        <DialogTitle onClose={handleCloseDialog}>Thêm đánh giá</DialogTitle>
        <DialogContent dividers>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="feedbackName"
                  label="Tên bài đánh giá"
                  name="feedbackName"
                  autoComplete="feedbackName"
                  inputRef={register}
                  error={!!errors.feedbackName}
                  helperText={errors?.feedbackName?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="feedbackDetail"
                  label="Mô tả bài đánh giá"
                  name="feedbackDetail"
                  autoComplete="feedbackDetail"
                  inputRef={register}
                  error={!!errors.feedbackDetail}
                  helperText={errors?.feedbackDetail?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="ques1"
                  label="Câu hỏi thứ 1"
                  name="ques1"
                  autoComplete="ques1"
                  inputRef={register}
                  error={!!errors.ques1}
                  helperText={errors?.ques1?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="ques2"
                  label="Câu hỏi thứ 2"
                  name="ques2"
                  autoComplete="ques2"
                  inputRef={register}
                  error={!!errors.ques2}
                  helperText={errors?.ques2?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="ques3"
                  label="Câu hỏi thứ 3"
                  name="ques3"
                  autoComplete="ques3"
                  inputRef={register}
                  error={!!errors.ques3}
                  helperText={errors?.ques3?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="ques4"
                  label="Câu hỏi thứ 4"
                  name="ques4"
                  autoComplete="ques4"
                  inputRef={register}
                  error={!!errors.ques4}
                  helperText={errors?.ques4?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="ques5"
                  label="Câu hỏi thứ 5"
                  name="ques5"
                  autoComplete="ques5"
                  inputRef={register}
                  error={!!errors.ques5}
                  helperText={errors?.ques5?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="dense"
                    id="date-picker-dialog-register"
                    label="Ngày hết hạn"
                    format="MM/dd/yyyy"
                    name="expiredDate"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={classes.datePicker}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>

            {/* In ra loi neu dang nhap that bai */}
            {/* {loginError ? (
              <Alert style={{ marginTop: "15px" }} severity="error">
                {loginError}
              </Alert>
            ) : null} */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={handleSubmit(onSubmit)}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
