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
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  formControl: {
    width: "100%",
  },
  button: {
    marginRight: "8px",
  },

  userForm: {
    marginTop: theme.spacing(1),
  },

  firstSentence: {
    color: theme.palette.secondary.main,
  },

  root: {
    "& p": {
      "& > span": {
        color: theme.palette.secondary.main,
      },
    },
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
      <Typography color="secondary" variant="h3" align="center">
        {children}
      </Typography>
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

function ManageDialogDetail(props) {
  const {
    openDialogDetail,
    setOpenDialogDetail,
    handleCloseDialogDetail,
    feedbackDetail,
  } = props;
  const classes = useStyles();

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  console.log("feedbackDetail", feedbackDetail);

  return (
    <div>
      <Dialog
        maxWidth="sm"
        onClose={handleCloseDialogDetail}
        open={openDialogDetail}
        className={classes.root}
      >
        <DialogTitle onClose={handleCloseDialogDetail}>
          Xem chi tiết
        </DialogTitle>
        <DialogContent dividers>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h1" component="p" color="primary">
                  <span>Tên:</span> {feedbackDetail?.feedbackName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h2" component="p" color="primary">
                  <span>Mô tả:</span> {feedbackDetail?.feedbackDetail}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" component="p" color="primary">
                  <span>Ngày hết hạn: </span>
                  {moment(feedbackDetail?.expiredDate).format("DD/MM/YYYY")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" component="p">
                  <span>Câu hỏi 1:</span> {feedbackDetail?.ques1}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" component="p">
                  <span>Câu hỏi 2:</span> {feedbackDetail?.ques2}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" component="p">
                  <span>Câu hỏi 3:</span> {feedbackDetail?.ques3}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" component="p">
                  <span>Câu hỏi 4:</span> {feedbackDetail?.ques4}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" component="p">
                  <span>Câu hỏi 5:</span> {feedbackDetail?.ques5}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h3"
                  component="p"
                  style={{
                    fontWeight: 400,
                    color: "#9e9e9e",
                  }}
                >
                  Các bài đánh giá (Trên thang điểm từ 1 - 5)
                </Typography>
              </Grid>

              {/* Table List */}
              <TableContainer className={classes.userForm} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Tài khoản
                      </TableCell>

                      <TableCell align="center">1</TableCell>
                      <TableCell align="center">2</TableCell>
                      <TableCell align="center">3</TableCell>
                      <TableCell align="center">4</TableCell>
                      <TableCell align="center">5</TableCell>
                      <TableCell align="right">Thời gian</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {" "}
                    {feedbackDetail &&
                      feedbackDetail.feedbackAttemps.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {item.accountID}
                            </TableCell>
                            <TableCell align="center">{item.answer1}</TableCell>
                            <TableCell align="center">{item.answer2}</TableCell>
                            <TableCell align="center">{item.answer3}</TableCell>
                            <TableCell align="center">{item.answer4}</TableCell>
                            <TableCell align="center">{item.answer5}</TableCell>
                            <TableCell align="right">
                              {moment(item.attempWhen).format("DD/MM/YYYY")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageDialogDetail;
