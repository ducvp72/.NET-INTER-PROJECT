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
import { Visibility, VisibilityOff } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputAdornment, InputLabel, Select } from "@material-ui/core";
import { useForm } from "react-hook-form";
import FormControl from "@material-ui/core/FormControl";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import FormLabel from "@material-ui/core/FormLabel";
import { actGetUserPaging } from "./modules/action";
import Swal from "sweetalert2";
import { Alert } from "@material-ui/lab";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  userName: yup
    .string()
    .required("Tên tài khoản đang trống !")
    .min(5, "Tên tài khoản phải từ 5 đến 16 kí tự")
    .max(16, "Tên tài khoản phải từ 5 đến 16 kí tự"),
  userPassword: yup
    .string()
    .required("Mật khẩu đang trống !")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
    .max(16, "Mật khẩu chỉ tối đa 18 kí tự"),
  name: yup.string().required("Họ và tên đang trống !"),
  email: yup
    .string()
    .required("Email đang trống !")
    .email("Email không đúng định dạng"),
  phone: yup
    .string()
    .required("Số điện thoại đang trống !")
    .matches(phoneRegExp, "Số điện thoại không đúng định dạng !"),
  userRole: yup.string(),
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
  const {
    openDialog,
    setOpenDialog,
    handleCloseDialog,
    modal,
    selectedDate,
    setSelectedDate,
    search,
    page,
    numberElementOfPage,
  } = props;
  const classes = useStyles();
  const [user, setUser] = useState({ ...props.user });

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const onAddSubmit = (data) => {
    data["gioiTinh"] = user.gioiTinh;
    data["ngaySinh"] = moment(selectedDate).format("YYYY-MM-DD");

    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/User/AddUser`,
      method: "POST",
      data,
    })
      .then((result) => {
        setLoginError(null);
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Thêm thành công",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          search.trim() === ""
            ? dispatch(actGetUserPaging(page.toString(), numberElementOfPage))
            : dispatch(
                actGetUserPaging(page.toString(), numberElementOfPage, search)
              );
        });
      })
      .catch((error) => {
        setLoginError(error.response.data.message);
      });
  };

  const onUpdateSubmit = (data) => {
    data["gioiTinh"] = user.gioiTinh;
    data["ngaySinh"] = moment(selectedDate).format("YYYY-MM-DD");

    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/User/UpdateUser/${user.id}`,
      method: "PUT",
      data,
    })
      .then((result) => {
        setLoginError(null);
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Chỉnh sửa thành công",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          search.trim() === ""
            ? dispatch(actGetUserPaging(page.toString(), numberElementOfPage))
            : dispatch(
                actGetUserPaging(page.toString(), numberElementOfPage, search)
              );
        });
      })
      .catch((error) => {
        setLoginError(error.response.data.message);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  console.log("user", user);

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
                  id="userName"
                  label="Tên tài khoản"
                  name="userName"
                  autoComplete="userName"
                  inputRef={register}
                  error={!!errors.userName}
                  helperText={errors?.userName?.message}
                  value={user.userName}
                  onChange={modal.id === "them" ? handleChange : null}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="userPassword"
                  label="Mật Khẩu"
                  type={showPassword ? "text" : "password"}
                  id="userPassword"
                  autoComplete="userPassword"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputRef={register}
                  error={!!errors.userPassword}
                  helperText={errors?.userPassword?.message}
                  value={user.userPassword}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="name"
                  label="Họ và Tên"
                  id="name"
                  autoComplete="name"
                  inputRef={register}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  value={user.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  id="email"
                  autoComplete="email"
                  inputRef={register}
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  value={user.email}
                  onChange={modal.id === "them" ? handleChange : null}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="phone"
                  label="Số điện thoại"
                  id="phone"
                  autoComplete="phone"
                  inputRef={register}
                  error={!!errors.phone}
                  helperText={errors?.phone?.message}
                  value={user.phone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple">
                    Loại người dùng
                  </InputLabel>
                  <Select
                    native
                    value={user.userRole}
                    onChange={handleChange}
                    label="Loại người dùng"
                    inputProps={{
                      name: "userRole",
                      id: "outlined-age-native-simple",
                    }}
                    inputRef={register}
                  >
                    <option value={"student"}>Học viên</option>
                    <option value={"teacher"}>Giáo viên</option>
                    <option value={"instructor"}>Trợ giảng</option>
                    <option value={"admin"}>Quản trị viên</option>
                    <option value={"mentor"}>Hỗ trợ lớp</option>
                    <option value={"classAdmin"}>Admin lớp</option>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="dense"
                    id="date-picker-dialog-register"
                    label="Ngày tháng năm sinh"
                    format="MM/dd/yyyy"
                    name="ngaySinh"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={classes.datePicker}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset" margin="dense">
                  <FormLabel component="legend">Giới tính</FormLabel>
                  <RadioGroup
                    name="gioiTinh"
                    id="gioiTinh"
                    value={user.gioiTinh}
                    onChange={handleChange}
                    className={classes.radioGroup}
                  >
                    <FormControlLabel
                      value="nam"
                      control={<Radio />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value="nu"
                      control={<Radio />}
                      label="Nữ"
                    />
                    <FormControlLabel
                      value="khac"
                      control={<Radio />}
                      label="Khác"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            {/* In ra loi*/}
            {loginError ? (
              <Alert style={{ marginTop: "15px" }} severity="error">
                {loginError}
              </Alert>
            ) : null}
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
