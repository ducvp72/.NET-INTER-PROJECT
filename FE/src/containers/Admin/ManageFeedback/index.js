import {
  Button,
  CssBaseline,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SearchIcon from "@material-ui/icons/Search";
import ManageDialog from "../ManageFeedback/ManageDialog";
import { Helmet } from "react-helmet";
import ManageDialogDetail from "./ManageDialogDetail";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  rootAlert: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  rootPagination: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  paper: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "500px",
  },
  inputBase: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchForm: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
    marginTop: theme.spacing(3),
  },
  userForm: {
    marginTop: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(0, 1),
  },

  tableCell: {
    position: "relative",
    "&::after": {
      display: "block",
      content: "''",
      position: "absolute",
      top: "50%",
      right: 0,
      transform: "translateY(-50%)",

      height: "60%",
      width: "1px",

      backgroundColor: "#e0e0e0",
    },
  },
}));

function ManageFeedback(props) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [data, setData] = useState(null);

  const [feedbackDetail, setFeedbackDetail] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  const [openDialogDetail, setOpenDialogDetail] = useState(false);

  console.log("data", data);

  const getFeedbackList = () => {
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/controller/FeedbackQuestionList`,
      method: "GET",
    })
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  useEffect(() => {
    getFeedbackList();
  }, [openDialog]);

  // Check Role
  if (JSON.parse(localStorage.getItem("user")).userRole !== "admin") {
    return <Redirect to="/manage-user" />;
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialogDetail = () => {
    setOpenDialogDetail(false);
  };

  const avgOfAnswer = (arr, res, answerNo) => {
    if (arr.length <= 0) return (res = 0);
    arr.forEach((item, index) => {
      res += parseInt(arr[index][`answer${answerNo}`]);
    });
    return (res / arr.length).toFixed(2);
  };

  const renderFeedbackList = (data) => {
    return data.map((feedback, index) => {
      let totalTemp = 0;
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row" className={classes.tableCell}>
            {feedback.feedbackID}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {feedback.feedbackName}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {feedback.feedbackDetail}
          </TableCell>
          <TableCell align="center" className={classes.tableCell}>
            {avgOfAnswer(feedback.feedbackAttemps, totalTemp, 1)}
          </TableCell>
          <TableCell align="center" className={classes.tableCell}>
            {avgOfAnswer(feedback.feedbackAttemps, totalTemp, 2)}
          </TableCell>
          <TableCell align="center" className={classes.tableCell}>
            {avgOfAnswer(feedback.feedbackAttemps, totalTemp, 3)}
          </TableCell>
          <TableCell align="center" className={classes.tableCell}>
            {avgOfAnswer(feedback.feedbackAttemps, totalTemp, 4)}
          </TableCell>
          <TableCell align="center" className={classes.tableCell}>
            {avgOfAnswer(feedback.feedbackAttemps, totalTemp, 5)}
          </TableCell>
          <TableCell align="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setFeedbackDetail(feedback);
                setOpenDialogDetail(true);
              }}
            >
              Chi tiết
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  console.log("open yet", openDialogDetail);

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Quản lý đánh giá/ phản hồi</title>
        <meta
          charSet="utf-8"
          name="description"
          content="Trang quản lý đánh giá/ phản hồi"
        />
      </Helmet>
      <CssBaseline />
      <Grid container>
        <Grid container item xs={12} justifyContent="flex-end">
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Thêm
          </Button>
        </Grid>
        <Grid className={classes.searchForm} container item xs={12}>
          <Paper elevation={1} component="form" className={classes.paper}>
            <InputBase
              placeholder="Tìm kiếm bài đánh giá"
              className={classes.inputBase}
            />
            <IconButton>
              <SearchIcon color="primary" />
            </IconButton>
          </Paper>
        </Grid>
      </Grid>

      {/* Table List */}
      <TableContainer className={classes.userForm} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                className={classes.tableCell}
              >
                Mã đánh giá
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Tên bài đánh giá
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Mô tả
              </TableCell>
              <TableCell align="center" className={classes.tableCell}>
                Câu 1
              </TableCell>
              <TableCell align="center" className={classes.tableCell}>
                Câu 2
              </TableCell>
              <TableCell align="center" className={classes.tableCell}>
                Câu 3
              </TableCell>
              <TableCell align="center" className={classes.tableCell}>
                Câu 4
              </TableCell>
              <TableCell align="center" className={classes.tableCell}>
                Câu 5
              </TableCell>
              <TableCell align="center">Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{data && renderFeedbackList(data)}</TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <ManageDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleCloseDialog={handleCloseDialog}
      />

      <ManageDialogDetail
        openDialogDetail={openDialogDetail}
        setOpenDialogDetail={setOpenDialogDetail}
        handleCloseDialogDetail={handleCloseDialogDetail}
        feedbackDetail={feedbackDetail}
      />
    </div>
  );
}

export default ManageFeedback;
