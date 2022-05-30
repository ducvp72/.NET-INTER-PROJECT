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
import { actGetCoursePaging } from "./modules/action";

const schema = yup.object().shape({
  courseID: yup.string().required("Vui lòng nhập mã khóa học"),
  courseName: yup
    .string()
    .required("Vui lòng nhập tên khóa học")
    .max(50, "Tên khóa học phải dưới 50 ký tự"),
  courseDetail: yup
    .string()
    .required("Vui lòng nhập mô tả khóa học")
    .max(255, "Mô tả khóa học phải dưới 255 ký tự"),
  courseDuration: yup
    .number()
    .required("Vui lòng thời hạn khóa học")
    .typeError("Vui lòng nhập số")
    .positive("Vui lòng nhập số hợp lệ")
    .integer("Vui lòng nhập số hợp lệ")
    .min(2, "Thời hạn khóa học phải tối thiểu 2 tháng")
    .max(24, "Thời hạn khóa học chỉ tối đa 24 tháng"),
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
  courseImage: {
    display: "block",
    width: "100%",
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
    search,
    page,
    numberElementOfPage,
    selectedFile,
    selectedImage,
    setSelectedFile,
    setSelectedImage,
  } = props;
  const classes = useStyles();
  const [course, setCourse] = useState({ ...props.course });

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setCourse(props.course);
  }, [props.course]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setCourse({
      ...course,
      [name]: value,
    });
  };

  const fileSelectedHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
    setCourse({
      ...course,
      ["filetype"]: event.target.files[0].name,
    });
  };

  const onAddSubmit = (data) => {
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Course/AddCourse`,
      method: "POST",
      data,
    })
      .then((result) => {
        console.log("result.data", result.data);
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Thêm thành công",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          search.trim() === ""
            ? dispatch(actGetCoursePaging(page.toString(), numberElementOfPage))
            : dispatch(
                actGetCoursePaging(page.toString(), numberElementOfPage, search)
              );
        });

        // Upload image
        const frm = new FormData();
        frm.append("files", selectedFile, selectedFile.name);
        axios({
          url: `http://group04lms.japaneast.azurecontainer.io/api/Course/UploadFile/${course.courseID}`,
          method: "POST",
          data: frm,
        })
          .then((result) => {
            console.log("Upload img success: ", result.data);
          })
          .catch((error) => {
            console.log(error);
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
        console.log(error.response);
      });
  };

  const onUpdateSubmit = (data) => {
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Course/Update/${data.courseID}`,
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
            ? dispatch(actGetCoursePaging(page.toString(), numberElementOfPage))
            : dispatch(
                actGetCoursePaging(page.toString(), numberElementOfPage, search)
              );
        });

        // Upload image
        if (selectedFile) {
          const frm = new FormData();
          frm.append("files", selectedFile, selectedFile.name);
          axios({
            url: `http://group04lms.japaneast.azurecontainer.io/api/Course/UploadFile/${course.courseID}`,
            method: "POST",
            data: frm,
          })
            .then((result) => {
              console.log("Upload img success: ", result.data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
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
                  id="courseID"
                  label="Mã khóa học"
                  name="courseID"
                  autoComplete="courseID"
                  inputRef={register}
                  error={!!errors.courseID}
                  helperText={errors?.courseID?.message}
                  value={course.courseID}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="courseName"
                  label="Tên khóa học"
                  name="courseName"
                  autoComplete="courseName"
                  inputRef={register}
                  error={!!errors.courseName}
                  helperText={errors?.courseName?.message}
                  value={course.courseName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="courseDetail"
                  label="Mô tả"
                  name="courseDetail"
                  autoComplete="courseDetail"
                  inputRef={register}
                  error={!!errors.courseDetail}
                  helperText={errors?.courseDetail?.message}
                  value={course.courseDetail}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="courseDuration"
                  label="Thời gian (tháng)"
                  name="courseDuration"
                  autoComplete="courseDuration"
                  inputRef={register}
                  error={!!errors.courseDuration}
                  helperText={errors?.courseDuration?.message}
                  value={course.courseDuration}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Hình ảnh</Typography>
                <img
                  alt="upload image"
                  src={selectedImage}
                  className={classes.courseImage}
                />
                <input
                  accept="image/*"
                  style={{
                    display: "none",
                  }}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={fileSelectedHandler}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    style={{
                      margin: "10px 0",
                    }}
                  >
                    Chọn ảnh
                  </Button>
                </label>
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
