import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Table,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import { ScaleLoader } from "react-spinners";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { set } from "date-fns";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "50px",
    minHeight: "60vh",
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
}));

const schema = yup.object().shape({
  point: yup
    .number()
    .required("Điểm đang trống")
    .min(0, "Điểm không nhỏ hơn 0")
    .max(10, "Điểm không lớn hơn 10"),
});

export default function SubmitDetail(props) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const userID = props.match.params.id;
  const [submitID, setSubmitID] = useState("");
  const classes = useStyles();
  const [submitList, setSubmitList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorNotify, setErrorNotify] = useState(null);
  const [point, setPoint] = useState({
    point: 0,
  });

  const handlePointChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setPoint({
      ...point,
      [name]: value,
    });
  };
  useEffect(() => {
    axios
      .get(
        `http://group04lms.japaneast.azurecontainer.io/api/SubmitPoint/ListSubmitByFolder/${userID}`
      )
      .then((res) => {
        setSubmitList(res.data);
      });
  }, [userID, submitList]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onSubmitPoint = (e, p) => {
    e.preventDefault();
    console.log(submitID);
    setLoading(true);
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/SubmitPoint/ListSubmit/${submitID}`,
      method: "put",
      params: {
        point: p,
      },
    })
      .then((res) => {
        setLoading(false);
        setErrorNotify(null);
        setOpenDialog(false);
        Swal.fire({
          icon: "success",
          title: "Chấm điểm thành công",
          showConfirmButton: false,
          timer: 1500,
        });
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
        <title>Danh sách bài nộp</title>
        <meta charSet="utf-8" name="description" content="Danh sách bài nộp" />
      </Helmet>
      <Container className={classes.root}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Link</TableCell>
                <TableCell align="left">Điểm</TableCell>
                <TableCell align="left">Chấm điểm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submitList && submitList.length > 0 ? (
                submitList.map((submit) => (
                  <TableRow key={submit.id}>
                    <TableCell align="left">{submit.id}</TableCell>
                    <TableCell align="left" component="a" href={submit.url}>
                      {submit.url}
                    </TableCell>
                    <TableCell align="center">{submit.point}</TableCell>
                    <TableCell align="center">
                      <EditIcon
                        onClick={() => {
                          setOpenDialog(true);
                          setSubmitID(submit.id);
                        }}
                      ></EditIcon>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <h4>Chưa có bài nộp</h4>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
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
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle onClose={handleCloseDialog}>
            <Typography variant="h3" align="center" color="secondary">
              Chấm điểm bài nộp
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <form noValidate onSubmit={(e) => onSubmitPoint(e, point.point)}>
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                id="point"
                label="Điểm"
                name="point"
                autoComplete="point"
                inputRef={register}
                error={!!errors.point}
                helperText={errors?.point?.message}
                value={point.point}
                onChange={handlePointChange}
              />
              {errorNotify ? <h5>{errorNotify}</h5> : null}
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  autoFocus
                  color="secondary"
                >
                  Chấm điểm
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
