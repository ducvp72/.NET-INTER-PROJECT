import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
const useStyles = makeStyles({
  root: {
    height: "100%",
    marginBottom: "100px",
  },
  title: {
    background: "#0E1E40",
    height: "50px",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  titleText: {
    marginLeft: "15px",
    fontSize: "large",
  },
  table: {
    margin: "15px 50px",
  },
  buttonBack: {
    background: "red",
    color: "white",
  },
  back: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
  },
});
const ScoreQuiz = () => {
  const classes = useStyles();
  const history = useHistory();
  const [scoreList, setScoreList] = useState([]);
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const getListScore = async (AccountID) => {
    try {
      const fetch = {
        url: "http://group04lms.japaneast.azurecontainer.io/api/Quiz/ListAttemp",
        method: "get",
        params: {
          AccountID: AccountID,
        },
      };
      const res = await axios(fetch);
      setScoreList(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getListScore(loginInfo.id);
  }, [loginInfo.id]);
  return (
    <div className={classes.root}>
      <Helmet>
        <title>Điểm của quiz</title>
        <meta
          charSet="utf-8"
          name="description"
          content="Trang xem điểm quiz"
        />
      </Helmet>
      <div className={classes.title}>
        <h3 className={classes.titleText}>Điểm của bài Quiz</h3>
      </div>
      <div className={classes.table}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Quiz ID</TableCell>
                <TableCell align="left">Account ID</TableCell>
                <TableCell align="left">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoreList ? (
                scoreList.map((score) => (
                  <TableRow>
                    <TableCell align="left">{score.quizID}</TableCell>
                    <TableCell align="left">{score.accountID}</TableCell>
                    <TableCell align="left">{score.score}</TableCell>
                  </TableRow>
                ))
              ) : (
                <h4>Chưa có điểm cho bài quiz nào</h4>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className={classes.back}>
        <Button
          variant="contained"
          className={classes.buttonBack}
          onClick={() => history.goBack()}
        >
          Trở lại
        </Button>
      </div>
    </div>
  );
};

export default ScoreQuiz;
