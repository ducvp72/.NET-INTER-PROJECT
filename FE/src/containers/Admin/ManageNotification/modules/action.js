import * as actionTypes from "./constant";
import axios from "axios";

export const actGetListNotify = () => {
  return (dispatch) => {
    dispatch(actGetListNotifyRequest());
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Notification/AllNotifyAdmin`,
      method: "GET",
    })
      .then((result) => {
        dispatch(actGetListNotifySuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetListNotifyFailed(error));
      });
  };
};

const actGetListNotifyRequest = () => {
  return {
    type: actionTypes.GET_LIST_NOTIFY_REQUEST,
  };
};

const actGetListNotifySuccess = (payload) => {
  return {
    type: actionTypes.GET_LIST_NOTIFY_SUCCESS,
    payload,
  };
};

const actGetListNotifyFailed = (error) => {
  return {
    type: actionTypes.GET_LIST_NOTIFY_FAILED,
    payload: error,
  };
};
