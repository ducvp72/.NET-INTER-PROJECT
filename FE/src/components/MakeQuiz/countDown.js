import React from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import axios from "axios";
const Timer = ({ quizID, score }) => {
  const initialMinute = 5;
  const initialSeconds = 0;
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  const history = useHistory();
  const loginInfo = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
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
    const minutesStore = localStorage.getItem("minutes");
    const secondsStore = localStorage.getItem("seconds");
    if (minutesStore && secondsStore) {
      setMinutes(parseInt(minutesStore));
      setSeconds(parseInt(secondsStore));
    }
    return () => {
      localStorage.removeItem("minutes");
      localStorage.removeItem("seconds");
    };
  }, []);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
          submitQuiz(loginInfo.id, score);
          Swal.fire({
            icon: "success",
            title: "Đã hết thời gian",
            text: `Vui lòng kiểm tra lại điểm`,
            // timer: 2000,
            confirmButtonText: "Đồng ý",
          }).then((result) => {
            if (result.isConfirmed) {
              history.push("/");
            }
          });
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      if (localStorage.getItem("questionNo")) {
        localStorage.setItem("minutes", minutes);
        localStorage.setItem("seconds", seconds);
      }
      clearInterval(myInterval);
    };
  });

  return (
    <div>
      {minutes === 0 && seconds === 0 ? null : (
        <h1>
          {" "}
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </h1>
      )}
    </div>
  );
};

export default Timer;
