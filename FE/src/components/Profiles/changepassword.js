import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Box,
  Button,
  Container,
  IconButton,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "100px",
    marginTop: "25px",
  },
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
  tabRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 224,
    width: "100%",
    marginTop: 30,
    marginBottom: 100,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  button: {
    marginTop: 10,
    width: "150px",
    marginLeft: "85px",
  },
  radioGroup: {
    flexDirection: "row",
  },
  datePicker: {
    display: "flex",
  },
  form: {
    padding: "0 100px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "400px",
  },
}));
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Mật khẩu mới đang trống !")
    .min(8, "Mật khẩu mới phải có ít nhất 8 kí tự")
    .max(16, "Mật khẩu mới chỉ tối đa 16 kí tự"),
  confirmPassword: yup
    .string()
    .required("Xác nhận mật khẩu mới đang trống !")
    .min(8, "Xác nhận mật khẩu mới phải có ít nhất 8 kí tự")
    .oneOf([yup.ref("newPassword")], "Mật khẩu không khớp !"),
  name: yup.string().required("Họ và tên đang trống !"),
  phone: yup
    .string()
    .required("Số điện thoại đang trống !")
    .matches(phoneRegExp, "Số điện thoại không đúng định dạng !"),
});

export default function ChangePassword() {
  const { register, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errorNotify, setErrorNotify] = useState(null);

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleOnChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password.newPassword === loginInfo.userPassword) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu mới trùng với mật khẩu hiện tại",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      let data = {
        userName: loginInfo.userName,
        oldPassword: loginInfo.userPassword,
        userPassword: password.newPassword,
        confirmPassword: password.confirmPassword,
      };
      setLoading(true);
      axios
        .put(
          `http://group04lms.japaneast.azurecontainer.io/api/ChangePassword`,
          data
        )
        .then((res) => {
          setLoading(false);
          setErrorNotify(null);
          Swal.fire({
            icon: "success",
            title: "Đổi mật khẩu thành công",
            timer: 1500,
            showConfirmButton: false,
          });
          loginInfo.userPassword = res.data.data.userPassword;
          localStorage.setItem("user", JSON.stringify(loginInfo));
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.data && error.response) {
            setErrorNotify(error.response.data);
          }
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>LMS - Đổi mật khẩu</title>
        <meta charSet="utf-8" name="description" content="Trang đổi mật khẩu" />
      </Helmet>
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
      <Container className={classes.root}>
        <form className={classes.form} noValidate onSubmit={(e) => onSubmit(e)}>
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            type={showNewPassword ? "text" : "password"}
            label="Nhập mật khẩu mới"
            name="newPassword"
            autoComplete="newPassword"
            inputRef={register}
            error={!!errors.newPassword}
            helperText={errors?.newPassword?.message}
            onChange={handleOnChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowNewPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    color="primary"
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            autoComplete="confirmPassword"
            inputRef={register}
            error={!!errors.confirmPassword}
            helperText={errors?.confirmPassword?.message}
            onChange={handleOnChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    color="primary"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
          {errorNotify ? <h5>{errorNotify}</h5> : null}
          <Button
            type="submit"
            variant="contained"
            autoFocus
            color="primary"
            className={classes.button}
          >
            Thay đổi
          </Button>
        </form>
      </Container>
    </>
  );
}
