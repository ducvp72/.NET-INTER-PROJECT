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
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import moment from "moment";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  root: { marginBottom: "100px", padding: "0 100px" },
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
    width: "200px",
    marginLeft: "200px",
  },
  radioGroup: {
    flexDirection: "row",
  },
  datePicker: {
    display: "flex",
    width: "600px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "600px",
  },
}));
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object().shape({
  name: yup.string().required("Họ và tên đang trống !"),
  phone: yup
    .string()
    .required("Số điện thoại đang trống !")
    .matches(phoneRegExp, "Số điện thoại không đúng định dạng !"),
});

export default function Profiles() {
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const classes = useStyles();
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date(loginInfo.ngaySinh)
  );
  const [valueRadio, setValueRadio] = useState(loginInfo.gioiTinh);
  const [info, setInfo] = useState({
    name: loginInfo.name,
    phone: loginInfo.phone,
  });
  const [errorNotify, setErrorNotify] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleInfoChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setInfo({
      ...info,
      [name]: value,
    });
  };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
  };

  const onInfoSubmit = (e) => {
    e.preventDefault();
    const date = moment(selectedDate).format("yyyy-MM-DD");
    let data = {
      name: info.name,
      ngaySinh: date,
      phone: info.phone,
      gioiTinh: valueRadio,
    };
    setLoading(true);
    axios
      .put(
        `http://group04lms.japaneast.azurecontainer.io/api/User/EditUser/${loginInfo.id}`,
        data
      )
      .then((res) => {
        setLoading(false);
        setErrorNotify(null);
        Swal.fire({
          icon: "success",
          title: "Cập nhật thông tin thành công",
          timer: 1500,
          showConfirmButton: false,
        });
        loginInfo.name = res.data.data.name;
        loginInfo.namSinh = res.data.data.namSinh;
        loginInfo.phone = res.data.data.phone;
        loginInfo.gioiTinh = res.data.data.gioiTinh;
        localStorage.setItem("user", JSON.stringify(loginInfo));
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data && error.response) {
          setErrorNotify(error.response.data);
        }
      });
  };
  return (
    <>
      <Helmet>
        <title>LMS - Hồ sơ cá nhân</title>
        <meta
          charSet="utf-8"
          name="description"
          content="Trang hồ sơ cá nhân"
        />
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
        <form
          className={classes.form}
          noValidate
          onSubmit={(e) => onInfoSubmit(e)}
        >
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="name"
            label="Họ và tên"
            name="name"
            autoComplete="name"
            inputRef={register}
            error={!!errors.name}
            helperText={errors?.name?.message}
            value={info.name}
            onChange={handleInfoChange}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="phone"
            label="Số điện thoại"
            name="phone"
            autoComplete="phone"
            inputRef={register}
            error={!!errors.phone}
            helperText={errors?.phone?.message}
            value={info.phone}
            onChange={handleInfoChange}
          />
          <MuiPickersUtilsProvider
            className={classes.input}
            utils={DateFnsUtils}
          >
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
          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Giới tính</FormLabel>
            <RadioGroup
              name="gioiTinh"
              value={valueRadio}
              onChange={handleRadioChange}
              className={classes.radioGroup}
            >
              <FormControlLabel value="nam" control={<Radio />} label="Nam" />
              <FormControlLabel value="nu" control={<Radio />} label="Nữ" />
              <FormControlLabel value="khac" control={<Radio />} label="Khác" />
            </RadioGroup>
          </FormControl>
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
