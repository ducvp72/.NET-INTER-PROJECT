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
import { actGetCoursePaging, actGetLessonPaging } from "./modules/action";
import { FormControl, InputLabel, Select } from "@material-ui/core";

const schema = yup.object().shape({
  //   courseID: yup.string().required("Vui lòng nhập mã khóa học"),
  lessonID: yup.string().required("Vui lòng nhập mã bài học"),
  lessonName: yup.string().required("Vui lòng nhập tên bài học"),
  lessonDetail: yup.string().required("Vui lòng nhập mô tả bài học"),
  lessonDuration: yup
    .number()
    .required("Vui lòng thời hạn bài học")
    .typeError("Vui lòng nhập số")
    .positive("Vui lòng nhập số hợp lệ")
    .integer("Vui lòng nhập số hợp lệ")
    .min(2, "Thời hạn bài học phải tối thiểu 2 tháng")
    .max(24, "Thời hạn bài học chỉ tối đa 24 tháng"),
  urlLesson: yup.string(),
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
  const {
    openDialog,
    setOpenDialog,
    handleCloseDialog,
    modal,
    courseArr,
    setCourseArr,
    search,
    page,
    numberElementOfPage,
  } = props;
  const classes = useStyles();
  const [lesson, setLesson] = useState({ ...props.lesson });

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setLesson(props.lesson);
  }, [props.lesson]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setLesson({
      ...lesson,
      [name]: value,
    });
  };

  const onAddSubmit = (data) => {
    console.log("data", data);
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/LessonForAdmin/CreateLessonForAdmin`,
      method: "POST",
      data,
    })
      .then((result) => {
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Thêm thành công",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          search.trim() === ""
            ? dispatch(actGetLessonPaging(page.toString(), numberElementOfPage))
            : dispatch(
                actGetLessonPaging(page.toString(), numberElementOfPage, search)
              );
        });
      })
      .catch((error) => {
        setOpenDialog(false);
        Swal.fire({
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const onUpdateSubmit = (data) => {
    console.log("data", data);
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/LessonForAdmin/Update`,
      method: "PUT",
      data,
    })
      .then((result) => {
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Chỉnh sửa thành công",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          search.trim() === ""
            ? dispatch(actGetLessonPaging(page.toString(), numberElementOfPage))
            : dispatch(
                actGetLessonPaging(page.toString(), numberElementOfPage, search)
              );
        });
      })
      .catch((error) => {
        setOpenDialog(false);
        Swal.fire({
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  //   console.log("lesson", lesson);
  console.log("courseArr", courseArr);
  return (
    <div>
      <Dialog maxWidth="xs" onClose={handleCloseDialog} open={openDialog}>
        <DialogTitle onClose={handleCloseDialog}>{modal.title}</DialogTitle>
        <DialogContent dividers>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple">
                    Khóa học
                  </InputLabel>
                  <Select
                    native
                    value={lesson.courseID}
                    onChange={handleChange}
                    label="Khóa học"
                    inputProps={{
                      name: "courseID",
                      id: "outlined-age-native-simple",
                    }}
                    inputRef={register}
                  >
                    {courseArr.map((item) => {
                      return (
                        <option value={item.courseID} key={item.courseId}>
                          {item.courseName}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
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
                  id="urlLesson"
                  label="Đường dẫn video"
                  name="urlLesson"
                  autoComplete="urlLesson"
                  inputRef={register}
                  error={!!errors.urlLesson}
                  helperText={errors?.urlLesson?.message}
                  value={lesson.urlLesson}
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
            onClick={
              modal.id === "them"
                ? handleSubmit(onAddSubmit)
                : handleSubmit(onUpdateSubmit)
            }
          >
            {modal.button}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
