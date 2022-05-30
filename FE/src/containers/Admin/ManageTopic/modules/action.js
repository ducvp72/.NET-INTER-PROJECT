import * as actionTypes from "./constant";
import axios from "axios";

export const actGetListTopic = () => {
  return (dispatch) => {
    dispatch(actGetListTopicRequest());
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Topic/List`,
      method: "GET",
    })
      .then((result) => {
        dispatch(actGetListTopicSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetListTopicFailed(error));
      });
  };
};

const actGetListTopicRequest = () => {
  return {
    type: actionTypes.GET_LIST_TOPIC_REQUEST,
  };
};

const actGetListTopicSuccess = (payload) => {
  return {
    type: actionTypes.GET_LIST_TOPIC_SUCCESS,
    payload,
  };
};

const actGetListTopicFailed = (error) => {
  return {
    type: actionTypes.GET_LIST_TOPIC_FAILED,
    payload: error,
  };
};
