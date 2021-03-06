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
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { ScaleLoader } from "react-spinners";
import { Box } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  root: {},
  backImg: {
    position: "fixed",
    top: 0,
    left: 0,

    minWidth: "100%",
    minHeight: "100%",
  },
  // container ch???a form
  containerMobile: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(6),
  },
  containerDesktop: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-60%)",
  },
  ///////////////////////
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
    padding: theme.spacing(1, 0),
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

  datePicker: {
    display: "flex",
  },

  radioGroup: {
    flexDirection: "row",
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

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  userName: yup
    .string()
    .required("T??n t??i kho???n ??ang tr???ng !")
    .min(5, "T??n t??i kho???n ph???i t??? 5 ?????n 16 k?? t???")
    .max(16, "T??n t??i kho???n ph???i t??? 5 ?????n 16 k?? t???"),
  userPassword: yup
    .string()
    .required("M???t kh???u ??ang tr???ng !")
    .min(8, "M???t kh???u ph???i c?? ??t nh???t 8 k?? t???")
    .max(16, "M???t kh???u ch??? t???i ??a 18 k?? t???"),
  confirmPassword: yup
    .string()
    .required("X??c nh???n m???t kh???u ??ang tr???ng !")
    .min(8, "M???t kh???u ph???i c?? ??t nh???t 8 k?? t???")
    .oneOf([yup.ref("userPassword")], "M???t kh???u kh??ng kh???p !"),
  name: yup.string().required("H??? v?? t??n ??ang tr???ng !"),
  email: yup
    .string()
    .required("Email ??ang tr???ng !")
    .email("Email kh??ng ????ng ?????nh d???ng"),
  phone: yup
    .string()
    .required("S??? ??i???n tho???i ??ang tr???ng !")
    .matches(phoneRegExp, "S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng !"),
});

function Register(props) {
  const history = useHistory();
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const matches = useMediaQuery("(min-height:1350px)");

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = useState(new Date("2000-08-29"));

  const [valueRadio, setValueRadio] = useState("nam");

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
    data["ngaySinh"] = moment(selectedDate).format("yyyy-MM-DD");
    data["gioiTinh"] = valueRadio;

    setLoading(true);

    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Register`,
      method: "POST",
      data,
    })
      .then((result) => {
        console.log(result.data);
        setLoading(false);
        setLoginError(null);

        Swal.fire({
          icon: "success",
          title: "????ng k?? th??nh c??ng",
          text: "Vui l??ng x??c nh???n email c???a b???n ????? ho??n t???t th??? t???c ????ng k??",
          // timer: 1500,
        });
        history.replace("/login");
      })
      .catch((error) => {
        console.log("error.response", error.response);
        if (error.response.data.message) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError(error.response.data);
        }
        setLoading(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>LMS - Trang ch???</title>
        <meta charSet="utf-8" name="description" content="Trang ch???" />
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
      <div className={`${classes.root} ${loading ? classes.loaderRoot : null}`}>
        <img alt="bg" src={AuthBackground} className={classes.backImg} />
        <Container
          className={`${classes.containerMobile} ${
            matches ? classes.containerDesktop : null
          }`}
          component="main"
          maxWidth="xs"
        >
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar src={AvatarUte} className={classes.avatar}></Avatar>
            <Typography className={classes.header} component="h1" variant="h1">
              ????ng k??
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
                id="userName"
                label="T??n t??i kho???n"
                name="userName"
                autoComplete="userName"
                inputRef={register}
                error={!!errors.userName}
                helperText={errors?.userName?.message}
              />
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="userPassword"
                label="M???t Kh???u"
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
                label="X??c nh???n m???t kh???u"
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
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="name"
                label="H??? v?? T??n"
                id="name"
                autoComplete="name"
                inputRef={register}
                error={!!errors.name}
                helperText={errors?.name?.message}
              />
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
              />

              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="phone"
                label="S??? ??i???n tho???i"
                id="phone"
                autoComplete="phone"
                inputRef={register}
                error={!!errors.phone}
                helperText={errors?.phone?.message}
              />

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="dense"
                  id="date-picker-dialog-register"
                  label="Ng??y th??ng n??m sinh"
                  format="MM/dd/yyyy"
                  name="ngaySinh"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className={classes.datePicker}
                />
              </MuiPickersUtilsProvider>

              <FormControl component="fieldset" margin="dense">
                <FormLabel component="legend">Gi???i t??nh</FormLabel>
                <RadioGroup
                  name="gioiTinh"
                  value={valueRadio}
                  onChange={handleRadioChange}
                  className={classes.radioGroup}
                >
                  <FormControlLabel
                    value="nam"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel value="nu" control={<Radio />} label="N???" />
                  <FormControlLabel
                    value="khac"
                    control={<Radio />}
                    label="Kh??c"
                  />
                </RadioGroup>
              </FormControl>

              {/* In ra loi neu dang nhap that bai */}
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
                ????ng K??
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" variant="h6" className={classes.bottomLink}>
                    B???n ???? l?? th??nh vi??n? ????ng nh???p ngay
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

export default Register;
