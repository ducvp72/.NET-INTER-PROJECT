import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ScaleLoader } from "react-spinners";
import { Box } from "@material-ui/core";
import axios from "axios";
import Swal from "sweetalert2";
const useStyles = makeStyles(() => ({
  root: {},
  linkcreate: {
    textDecoration: "none",
    color: "white",
  },
  loaderBox: {
    display: "inline-block",
    zIndex: "999",

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
  notifyID: yup
    .string()
    .required("ID đang trống !!!")
    .max(5, "ID không vượt quá 5 ký tự !!!"),
  notifyName: yup.string().required("Tên thông báo đang trống !!!"),
  notifyDetail: yup
    .string()
    .required("Chi tiết thông báo không được trống !!!"),
});
const CreateNotify = () => {
  const [notification, setNotification] = useState({
    notifyID: "",
    notifyName: "",
    notifyDetail: "",
  });
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setNotification({
      ...notification,
      [name]: value,
    });
  };
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [errorNotify, setErrorNotify] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const onSubmit = (data) => {
    setLoading(true);
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Notification/CreateNotification`,
      method: "POST",
      data,
    })
      .then((result) => {
        console.log(result.data);
        setLoading(false);
        setOpen(false);
        setErrorNotify(null);
        Swal.fire({
          icon: "success",
          title: "Đăng thông báo thành công",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
        if (error.response.data && error.response) {
          setErrorNotify(error.response.data);
        }
      });
  };
  return (
    <>
      <Link className={classes.linkcreate} onClick={handleClickOpen}>
        Tạo thông báo
      </Link>
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
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create Notify</DialogTitle>
          <DialogContent>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <TextField
                autoFocus
                margin="dense"
                id="notifyID"
                label="Notify ID"
                type="text"
                name="notifyID"
                fullWidth
                autoComplete="notifyID"
                required
                inputRef={register}
                error={!!errors.notifyID}
                helperText={errors?.notifyID?.message}
                value={notification.notifyID}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="notifyName"
                label="Notify Name"
                type="text"
                name="notifyName"
                fullWidth
                autoComplete="notifyName"
                required
                inputRef={register}
                error={!!errors.notifyName}
                helperText={errors?.notifyName?.message}
                value={notification.notifyName}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="notifyDetail"
                label="Notify Detail"
                type="text"
                name="notifyDetail"
                fullWidth
                autoComplete="notifyDetail"
                required
                inputRef={register}
                error={!!errors.notifyDetail}
                helperText={errors?.notifyDetail?.message}
                value={notification.notifyDetail}
                onChange={handleChange}
              />
              {errorNotify ? <h5>{errorNotify}</h5> : null}
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Đăng
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
export default CreateNotify;
