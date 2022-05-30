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
import { actGetTopicList } from "../../containers/Home/TopicPage/modules/action";
import { useDispatch } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {},
  linkcreate: {
    textDecoration: "none",
    color: "white",
  },
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
  // topicID: yup
  //   .string()
  //   .required("ID đang trống !!!")
  //   .max(5, "ID không vượt quá 5 ký tự !!!"),
  topicName: yup.string().required("Tên topic đang trống !!!"),
  topicDetail: yup.string().required("Chi tiết topic không được trống !!!"),
});
const CreateTopic = () => {
  const dispatch = useDispatch();

  const [topic, setTopic] = useState({
    // topicID: "",
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
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [errorTopic, setErrorTopic] = useState(null);
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
      url: "http://group04lms.japaneast.azurecontainer.io/api/Topic/CreateTopic",
      method: "POST",
      data,
    })
      .then((result) => {
        console.log(result.data);
        dispatch(actGetTopicList());
        setLoading(false);
        setOpen(false);
        setErrorTopic(null);
        Swal.fire({
          icon: "success",
          title: "Đăng topic thành công",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
        if (error.response.data && error.response) {
          setErrorTopic(error.response.data);
        }
      });
  };
  return (
    <>
      <Link className={classes.linkcreate} onClick={handleClickOpen}>
        Tạo topic
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
          <DialogTitle id="form-dialog-title">Create Topic</DialogTitle>
          <DialogContent>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              {/* <TextField
                autoFocus
                margin="dense"
                id="topicID"
                label="Topic ID"
                type="text"
                name="topicID"
                fullWidth
                autoComplete="topicID"
                required
                inputRef={register}
                error={!!errors.topicID}
                helperText={errors?.topicID?.message}
                value={topic.topicID}
                onChange={handleChange}
              /> */}
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
export default CreateTopic;
