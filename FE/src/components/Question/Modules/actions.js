import * as actionTypes from "./constant";
import axios from "axios";

export const actGetListQuestion = (QuizID) => {
  return (dispatch) => {
    dispatch(actGetListQuestionRequest());
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Quiz/ListQuestion`,
      method: "GET",
      params: {
        QuizID,
      },
    })
      .then((result) => {
        dispatch(actGetListQuestionSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetListQuestionFailed(error));
      });
  };
};

const actGetListQuestionRequest = () => {
  return {
    type: actionTypes.GET_LIST_QUESTION_REQUEST,
  };
};

const actGetListQuestionSuccess = (payload) => {
  return {
    type: actionTypes.GET_LIST_QUESTION_SUCCESS,
    payload,
  };
};

const actGetListQuestionFailed = (error) => {
  return {
    type: actionTypes.GET_LIST_QUESTION_FAILED,
    payload: error,
  };
};
