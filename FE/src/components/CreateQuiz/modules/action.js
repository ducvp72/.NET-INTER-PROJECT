import * as actionTypes from "./constant";
import axios from "axios";

export const actGetListQuiz = () => {
  return (dispatch) => {
    dispatch(actGetListQuizRequest());
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Quiz/List`,
      method: "GET",
    })
      .then((result) => {
        dispatch(actGetListQuizSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetListQuizFailed(error));
      });
  };
};

const actGetListQuizRequest = () => {
  return {
    type: actionTypes.GET_LIST_QUIZ_REQUEST,
  };
};

const actGetListQuizSuccess = (payload) => {
  return {
    type: actionTypes.GET_LIST_QUIZ_SUCCESS,
    payload,
  };
};

const actGetListQuizFailed = (error) => {
  return {
    type: actionTypes.GET_LIST_QUIZ_FAILED,
    payload: error,
  };
};
