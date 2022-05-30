import { Container, Button, Box, Typography } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";

const useStyle = makeStyles((theme) => ({
  submit: {
    padding: "15px 25px",
    backgroundColor: "#0e1e40",
    color: "#fff",
  },
  cancel: {
    padding: "15px 25px",
    backgroundColor: "#f00",
    color: "#fff",
    margin: "10px",
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
  form: {
    marginTop: "50px",
  },
}));

export default function Submit() {
  const classes = useStyle();
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifyError, setNotifyError] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    axios
      .post(
        `http://localhost:5000/api/SubmitFile/UploadFile/${loginInfo.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((result) => {
        setLoading(false);
        setNotifyError(null);
        Swal.fire({
          icon: "success",
          title: "Upload thành công",

          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data && error.response) {
          setNotifyError(error.response.data);
        }
      });
  };
  const handleChange = (files) => {
    setFile(files[0]);
  };
  return (
    <div>
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
      <Container>
        <form
          className={classes.form}
          noValidate
          onSubmit={(e) => handleSubmit(e)}
        >
          <DropzoneArea
            onChange={(files) => handleChange(files)}
            filesLimit={1}
          ></DropzoneArea>
          <Button type="submit" className={classes.submit}>
            Submit
          </Button>
          <Button
            onClick={() => window.history.back()}
            className={classes.cancel}
          >
            Cancel
          </Button>
        </form>
      </Container>
    </div>
  );
}
