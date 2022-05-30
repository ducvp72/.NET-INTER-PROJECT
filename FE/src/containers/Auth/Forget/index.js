import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import AvatarUte from "../../../assets/ute_flower.jpg";
import AuthBackground from "../../../assets/auth_background.jpg";
import { Helmet } from "react-helmet";
import { ScaleLoader } from "react-spinners";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  backImg: {
    position: "fixed",
    top: 0,
    left: 0,

    minWidth: "100%",
    minHeight: "100%",
  },
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-60%)",
  },
  paper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    background: theme.palette.common.white,

    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),

    boxShadow:
      "-40px 40px 160px 0 rgb(0 0 0 / 8%), -8px 8px 15px 0 rgb(120 120 120 / 4%), 3px 3px 30px 0 rgb(0 0 0 / 4%)",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,

    width: theme.spacing(10),
    height: theme.spacing(10),
  },

  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  bottomLink: {
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: 600,

    color: theme.palette.secondary.main,
  },

  closeBox: {
    position: "absolute",
    top: "-18px",
    right: "-18px",

    width: "36px",
    height: "36px",
    borderRadius: "50%",

    backgroundColor: theme.palette.primary.main,
    color: "#455570",
    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 50%)",
    cursor: "pointer",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    transition: "all .2s",

    "&:hover": {
      opacity: ".7",
    },
  },

  // Loader
  loaderBox: {
    display: "inline-block",
    zIndex: "100",

    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  loaderRoot: {
    opacity: 0.5,
  },
}));

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email đang trống !")
    .email("Vui lòng nhập đúng định dạng"),
  userName: yup
    .string()
    .required("Tên tài khoản đang trống !")
    .min(5, "Tên tài khoản phải từ 5 đến 16 kí tự")
    .max(16, "Tên tài khoản phải từ 5 đến 16 kí tự"),
});

function Forget(props) {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const onSubmit = (data) => {
    setLoading(true);
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/User/ForgotPass`,
      method: "PUT",
      data,
    })
      .then((result) => {
        setLoading(false);
        setLoginError(null);
        localStorage.setItem("userNameForChangePassword", data.userName);
        Swal.fire({
          icon: "success",
          title: result.data.message,
        });
      })
      .catch((error) => {
        setLoading();
        if (error.response.data.message) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError(error.response.data);
        }
      });
  };

  return (
    <>
      <Helmet>
        <title>LMS - Quên mật khẩu</title>
        <meta charSet="utf-8" name="description" content="Trang chủ" />
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
      <div className={classes.root}>
        <img alt="bg" src={AuthBackground} className={classes.backImg} />
        <Container className={classes.container} component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar src={AvatarUte} className={classes.avatar}></Avatar>
            <Typography className={classes.header} component="h1" variant="h1">
              Quên mật khẩu
            </Typography>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={classes.form}
              noValidate
            >
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="email"
                label="Vui lòng nhập email của bạn"
                id="email"
                autoComplete="email"
                inputRef={register}
                error={!!errors.email}
                helperText={errors?.email?.message}
              />
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="userName"
                label="Vui lòng nhập tài khoản của bạn"
                id="userName"
                autoComplete="userName"
                inputRef={register}
                error={!!errors.userName}
                helperText={errors?.userName?.message}
              />

              {loginError ? (
                <Alert style={{ marginTop: "15px" }} severity="error">
                  {loginError}
                </Alert>
              ) : null}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Gửi
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/login" variant="h6" className={classes.bottomLink}>
                    Đăng nhập ngay
                  </Link>
                </Grid>
              </Grid>
            </form>
            <Link to="/home" className={classes.closeBox}>
              <CloseRoundedIcon />
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Forget;
