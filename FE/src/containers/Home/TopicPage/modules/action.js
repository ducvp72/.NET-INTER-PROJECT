import * as actionTypes from "./constant";
import axios from "axios";

export const actGetTopicList = () => {
  return (dispatch) => {
    dispatch(actGetTopicListRequest());
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Topic/List`,
      method: "GET",
    })
      .then((result) => {
        dispatch(actGetTopicListSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetTopicListFailed(error));
      });
  };
};

const actGetTopicListRequest = () => {
  return {
    type: actionTypes.GET_TOPIC_LIST_REQUEST,
  };
};

const actGetTopicListSuccess = (payload) => {
  return {
    type: actionTypes.GET_TOPIC_LIST_SUCCESS,
    payload,
  };
};

const actGetTopicListFailed = (error) => {
  return {
    type: actionTypes.GET_TOPIC_LIST_FAILED,
    payload: error,
  };
};
