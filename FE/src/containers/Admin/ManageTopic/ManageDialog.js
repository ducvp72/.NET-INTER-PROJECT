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
import FormControl from "@material-ui/core/FormControl";
import { useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { actGetListTopic } from "./modules/action";
const schema = yup.object().shape({
  topicName: yup
    .string()
    .required("Tên topic đang trống !")
    .min(10, "Tên topic phải có ít nhất 10 ký tự")
    .max(200, "Tên topic chỉ tối đa 200 kí tự"),
  topicDetail: yup
    .string()
    .required("Nội dung topic đang trống !")
    .min(10, "Nội dung topic phải có ít nhất 10 ký tự"),
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
  const [loading, setLoading] = useState(false);
  const [errorTopic, setErrorTopic] = useState(null);
  const [topic, setTopic] = useState({
    topicName: "",
    topicDetail: "",
  });
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setTopic({
      ...topic,
      [name]: value,
    });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    axios({
      url: "http://group04lms.japaneast.azurecontainer.io/api/Topic/CreateTopic",
      method: "POST",
      data,
    })
      .then(() => {
        dispatch(actGetListTopic());
        setLoading(false);
        setErrorTopic(null);
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Đăng topic thành công",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.data && error.response) {
          setErrorTopic(error.response.data);
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
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="dense"
              id="topicName"
              label="Topic Name"
              type="text"
              name="topicName"
              fullWidth
              autoComplete="topicName"
              required
              inputRef={register}
              error={!!errors.topicName}
              helperText={errors?.topicName?.message}
              value={topic.topicName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="topicDetail"
              label="Topic Detail"
              type="text"
              name="topicDetail"
              fullWidth
              autoComplete="topicDetail"
              required
              inputRef={register}
              error={!!errors.topicDetail}
              helperText={errors?.topicDetail?.message}
              value={topic.topicDetail}
              onChange={handleChange}
            />
            {errorTopic ? <h5>{errorTopic}</h5> : null}

            <Button
              type="submit"
              className={classes.button}
              variant="contained"
              color="secondary"
            >
              Thêm
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
