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
import {
  InputAdornment,
  InputLabel,
  Select,
  TextareaAutosize,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { actGetListNotify } from "./modules/action";

const schema = yup.object().shape({
  notifyID: yup
    .string()
    .required("Mã thông báo đang trống !")
    .min(1, "Mã thông báo phải có ít nhất 1 ký tự"),
  notifyName: yup.string().required("Tên thông báo đang trống !"),

  notifyDetail: yup.string().required("Nội dung thông báo đang trống !"),
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
    marginTop: "10px",
    marginLeft: "150px",
  },
  content: {
    width: "100%",
    fontFamily: "Roboto, sans-serif",
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
      <Typography variant="h6">{children}</Typography>
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
  const { openDialog, setOpenDialog, handleCloseDialog, modal } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const [notification, setNotification] = useState({
    notifyID: "",
    notifyName: "",
    notifyDetail: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorNotify, setErrorNotify] = useState(null);
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setNotification({
      ...notification,
      [name]: value,
    });
  };
  const onAddSubmit = (data) => {
    setLoading(true);
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Notification/CreateNotification`,
      method: "post",
      data,
    })
      .then((result) => {
        setLoading(false);
        setErrorNotify(null);
        setOpenDialog(false);
        dispatch(actGetListNotify());
        Swal.fire({
          icon: "success",
          title: "Đăng thông báo thành công",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.data && error.response) {
          setErrorNotify(error.response.data);
        }
      });
  };

  return (
    <div>
      <Dialog maxWidth="xs" onClose={handleCloseDialog} open={openDialog}>
        <DialogTitle onClose={handleCloseDialog}>
          <Typography color="secondary" variant="h3" align="center">
            {modal.title}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit(onAddSubmit)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="notifyID"
                  label="Mã thông báo"
                  name="notifyID"
                  autoComplete="notifyID"
                  inputRef={register}
                  error={!!errors.notifyID}
                  helperText={errors?.notifyID?.message}
                  value={notification.notifyID}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="notifyName"
                  label="Tên thông báo"
                  name="notifyName"
                  autoComplete="notifyName"
                  inputRef={register}
                  error={!!errors.notifyName}
                  helperText={errors?.notifyName?.message}
                  value={notification.notifyName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <TextareaAutosize
                  className={classes.content}
                  variant="outlined"
                  margin="dense"
                  minRows={10}
                  required
                  id="notifyDetail"
                  placeholder="Nội dung thông báo"
                  name="notifyDetail"
                  autoComplete="notifyDetail"
                  inputRef={register}
                  error={!!errors.notifyDetail}
                  helperText={errors?.notifyDetail?.message}
                  value={notification.notifyDetail}
                  onChange={handleChange}
                /> */}
                <TextField
                  variant="outlined"
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
              </Grid>
              {errorNotify ? <h5>{errorNotify}</h5> : null}
            </Grid>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              type="submit"
            >
              Thêm
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
