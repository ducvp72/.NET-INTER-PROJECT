import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { actGetListQuestion } from "../Question/Modules/actions";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Timer from "./countDown";
import { Helmet } from "react-helmet";
import { Typography } from "@material-ui/core";
import moment from "moment";
const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: "#282c34",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  questionClass: {
    backgroundColor: "white",
    borderRadius: "10px",
    border: "1px solid gray",
    padding: "16px",
    margin: "10px auto",
    minWidth: "400px",
    maxWidth: "900px",
    textAlign: "center",
    color: "#282c34",
  },
  buttonOverall: {
    columnCount: "2",
    padding: "20px 450px",
  },
  normalButton: {
    backgroundColor: "white",
    width: "380px",
    padding: "8px",
    margin: "24px",
    color: "orange",
    fontWeight: "bold",
    height: "80px",
    fontSize: "large",
    borderRadius: "10px",
    outline: "none",
    border: "none",
    justifyContent: "center",

    "&:hover": {
      transform: "scale(1.1)",
      transition: "transform 200ms ease-in-out",
      cursor: "pointer",
    },
  },
  count: {
    display: "flex",
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "large",
  },
  time: {
    display: "flex",
    justifyContent: "space-between",
    width: "1000px",
  },
  groupButtonAnswer: {
    display: "flex",
    padding: "15px 0",
    backgroundColor: "#282c34",
  },
  answerButton: {
    width: "30px",
    height: "30px",
    margin: "0 5px",
    "&:hover": {
      background: "yellow",
    },
    "&:focus": {
      background: "yellow",
    },
  },
  selectQuiz: {
    width: "150px",
    height: "30px",
  },
  startquiz: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40px",
    marginBottom: "40px",
  },
  info: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "100px",
  },
  infoDetail: {
    paddingBottom: "40px",
  },
}));
const MakeQuiz = (props) => {
  const quizID = props.match.params.id;
  const classes = useStyles();
  const listQuestion = useSelector((state) => state.listQuestionReducer);
  const dispatch = useDispatch();
  const [ID, setID] = useState([]);
  const [listQuestions, setListQuestions] = useState([]);
  const [submitAnswer, setSubmitAnswer] = useState([]);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [openQuiz, setOpenQuiz] = useState(false);
  const [quizInfo, setQuizInfo] = useState({});

  let scoreQuiz = 0;
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [score, setScore] = useState(0);
  const [questionNo, setQuestionNo] = useState({
    questionNo: 1,
  });
  const [answer, setAnswer] = useState([]);
  const getAllQuiz = async () => {
    try {
      const fetch = {
        url: "http://group04lms.japaneast.azurecontainer.io/api/Quiz/List",
        method: "get",
      };
      const res = await axios(fetch);
      setID(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const answers = localStorage.getItem("answers");
    const questionNo = localStorage.getItem("questionNo");
    const scoreStore = localStorage.getItem("score");

    if (answers && questionNo) {
      setOpenQuiz(true);
      setSubmitAnswer(JSON.parse(answers));
      setQuestionNo(JSON.parse(questionNo));
      setScore(parseInt(scoreStore));
    }
    return () => {
      localStorage.removeItem("answers");
      localStorage.removeItem("questionNo");
      localStorage.removeItem("score");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(submitAnswer));
    if (
      submitAnswer.length === listQuestions.length &&
      submitAnswer.length > 0
    ) {
      Swal.fire({
        icon: "success",
        title: "Kết thúc bài Quiz",
        text: `Số điểm của bạn là: ${score + scoreQuiz}`,
        confirmButtonText: "Đồng ý",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/");
          submitQuiz(loginInfo.id, score + scoreQuiz);
        }
      });
    }
  }, [submitAnswer]);

  const getListQuestionNo = async (quizID) => {
    try {
      const fetch = {
        url: "http://group04lms.japaneast.azurecontainer.io/api/Quiz/ListQuestion",
        method: "get",
        params: {
          quizID: quizID,
        },
      };
      const res = await axios(fetch);
      setListQuestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllQuestionByID = async (quizID, questionNo) => {
    try {
      const fetch = {
        url: "http://group04lms.japaneast.azurecontainer.io/api/Quiz/GetQuestion",
        method: "get",
        params: {
          quizID: quizID,
          questionNo: questionNo,
        },
      };
      const res = await axios(fetch);
      setAnswer(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const checkAnswer = async (answer) => {
    try {
      const fetch = {
        url: `http://group04lms.japaneast.azurecontainer.io/api/Quiz/GetQuestion/${quizID}/${questionNo.questionNo}`,
        method: "post",
        params: {
          Answer: answer,
        },
      };
      await axios(fetch).then((res) => {
        scoreQuiz = res.data.data;
      });
      Swal.fire({
        icon: "success",
        title: "Đáp án chính xác",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        setScore(score + scoreQuiz);
        setQuestionNo({ questionNo: questionNo.questionNo + 1 });
        setSubmitAnswer([
          ...submitAnswer,
          { question: questionNo.questionNo, answer: answer, check: true },
        ]);
        // if (submitAnswer.length + 1 === listQuestions.length) {
        //   Swal.fire({
        //     icon: "success",
        //     title: "Kết thúc bài Quiz",
        //     text: `Số điểm của bạn là: ${score + scoreQuiz}`,
        //     // timer: 2000,
        //     confirmButtonText: "Đồng ý",
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //       history.push("/");
        //       submitQuiz(loginInfo.id, score + scoreQuiz);
        //     }
        //   });
        // }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Đáp án sai rồi !!!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        setQuestionNo({ questionNo: questionNo.questionNo + 1 });
        setSubmitAnswer([
          ...submitAnswer,
          { question: questionNo.questionNo, answer: answer, check: false },
        ]);
        // if (submitAnswer.length + 1 === listQuestions.length) {
        //   Swal.fire({
        //     icon: "success",
        //     title: "Kết thúc bài Quiz",
        //     text: `Số điểm của bạn là: ${score + scoreQuiz}`,
        //     confirmButtonText: "Đồng ý",
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //       history.push("/");
        //       submitQuiz(loginInfo.id, score + scoreQuiz);
        //     }
        //   });
        // }
      });
    }
  };
  const submitQuiz = async (AccountID, Score) => {
    try {
      const fetch = {
        url: `http://group04lms.japaneast.azurecontainer.io/api/Quiz/SubmitQuiz/${quizID}`,
        method: "post",
        params: {
          AccountID: AccountID,
          Score: Score,
        },
      };
      await axios(fetch);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllQuiz();
    getListQuestionNo(quizID);
    dispatch(actGetListQuestion(quizID));
  }, [quizID]);

  useEffect(() => {
    getAllQuestionByID(quizID, questionNo.questionNo);
    localStorage.setItem("questionNo", JSON.stringify(questionNo));
  }, [questionNo.questionNo]);

  useEffect(() => {
    axios
      .get(`http://group04lms.japaneast.azurecontainer.io/api/Quiz/${quizID}`)
      .then((res) => {
        setQuizInfo(res.data[0]);
      });
  }, [quizID]);

  const renderQuestion = (question) => {
    return (
      <>
        <div className={classes.time}>
          <div className={classes.count}>
            <p>Thời gian còn lại:</p>
            <Timer quizID={quizID} score={score + scoreQuiz} />
          </div>
          <div className={classes.count}>
            <label>Số điểm:{score}</label>
          </div>
        </div>
        <div className={classes.questionClass}>
          <h1>{question?.question}</h1>
        </div>
        <div className={classes.buttonOverall}>
          <button
            onClick={() => checkAnswer(question.answer1)}
            className={classes.normalButton}
          >
            {question?.answer1}
          </button>
          <button
            onClick={() => checkAnswer(question.answer2)}
            className={classes.normalButton}
          >
            {question?.answer2}
          </button>
          <button
            onClick={() => checkAnswer(question.answer3)}
            className={classes.normalButton}
          >
            {question?.answer3}
          </button>
          <button
            onClick={() => checkAnswer(question.answer4)}
            className={classes.normalButton}
          >
            {question?.answer4}
          </button>
        </div>
      </>
    );
  };
  return (
    <>
      <Helmet>
        <title>Trang làm Quiz</title>
        <meta charSet="utf-8" name="description" content="Trang làm quiz" />
      </Helmet>
      {openQuiz ? (
        <>
          <div className={classes.groupButtonAnswer}>
            {listQuestions?.map((question, index) =>
              submitAnswer.find((x) => x.question === question.questionNo) ? (
                <button
                  key={index}
                  value={question.questionNo}
                  className={classes.answerButton}
                  style={
                    submitAnswer.find(
                      (x) =>
                        x.question === question.questionNo && x.check === true
                    )
                      ? { background: "#00CC00" }
                      : { background: "red" }
                  }
                >
                  {question.questionNo}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    setQuestionNo({
                      questionNo: e.target.value,
                    });
                  }}
                  key={index}
                  value={question.questionNo}
                  className={classes.answerButton}
                >
                  {question.questionNo}
                </button>
              )
            )}
          </div>
          <div className={classes.container}>
            {answer ? renderQuestion(answer) : null}
          </div>
        </>
      ) : (
        <>
          <div className={classes.info}>
            <Typography className={classes.infoDetail} variant="h3">
              {quizInfo.quizName}
            </Typography>
            <Typography className={classes.infoDetail} variant="p">
              Ngày bắt đầu: {moment(quizInfo.startTime).format("DD/MM/yyyy")}
            </Typography>
            <Typography className={classes.infoDetail} variant="p">
              Ngày kết thúc: {moment(quizInfo.endTime).format("DD/MM/yyyy")}
            </Typography>
          </div>
          <div className={classes.startquiz}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleClickOpen();
                setOpenQuiz(true);
              }}
            >
              Bắt đầu
            </Button>
          </div>
        </>
      )}
    </>
  );
};
export default MakeQuiz;
