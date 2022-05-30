import * as actionTypes from "./constant";
import axios from "axios";

export const actGetUserPaging = (PageNumber, PageSize, userInfo) => {
  return (dispatch) => {
    dispatch(actGetUserPagingRequest());
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/User/ListUserPagination`,
      method: "GET",
      params: {
        PageNumber,
        PageSize,
        userInfo,
      },
    })
      .then((result) => {
        dispatch(actGetUserPagingSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetUserPagingFailed(error));
      });
  };
};

const actGetUserPagingRequest = () => {
  return {
    type: actionTypes.GET_USER_PAGING_REQUEST,
  };
};

const actGetUserPagingSuccess = (payload) => {
  return {
    type: actionTypes.GET_USER_PAGING_SUCCESS,
    payload,
  };
};

const actGetUserPagingFailed = (error) => {
  return {
    type: actionTypes.GET_USER_PAGING_FAILED,
    payload: error,
  };
};
