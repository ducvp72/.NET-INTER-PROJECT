import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import axios from "axios";
import Swal from "sweetalert2";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import AvatarUte from "../../../assets/ute_flower.jpg";
import AuthBackground from "../../../assets/auth_background.jpg";
import { Helmet } from "react-helmet";
import { Box } from "@material-ui/core";
import { ScaleLoader } from "react-spinners";

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
  userPassword: yup
    .string()
    .required("Mật khẩu đang trống !")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
    .max(16, "Mật khẩu chỉ tối đa 18 kí tự"),
  confirmPassword: yup
    .string()
    .required("Xác nhận mật khẩu đang trống !")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
    .oneOf([yup.ref("userPassword")], "Mật khẩu không khớp !"),
});

function GetNewPassword(props) {
  const classes = useStyles();

  const history = useHistory();

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickConfirmShowPassword = () => {
    setConfirmShowPassword(!confirmShowPassword);
  };
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("UserPassword", data.userPassword);
    formData.append("ConfirmPassword", data.confirmPassword);
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/User/Forget/${localStorage.getItem(
        "userNameForChangePassword"
      )}`,
      method: "POST",
      data: formData,
    })
      .then((result) => {
        setLoading(false);
        setLoginError(null);
        localStorage.removeItem("userNameForChangePassword");
        Swal.fire({
          icon: "success",
          title: result.data.message,
        }).then((resSwal) => {
          if (resSwal.isConfirmed) {
            history.replace("/login");
          }
        });
      })
      .catch((error) => {
        setLoading(false);
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
        <title>LMS - Mật khẩu mới</title>
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
              />
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type={confirmShowPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="confirmPassword"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickConfirmShowPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                        color="secondary"
                      >
                        {confirmShowPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputRef={register}
                error={!!errors.confirmPassword}
                helperText={errors?.confirmPassword?.message}
              />

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

export default GetNewPassword;
