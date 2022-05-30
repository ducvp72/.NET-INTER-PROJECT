import * as actionTypes from "./constant";
import axios from "axios";

// Đang cần update thêm API

export const actGetCourseList = (searchcourseInfo) => {
  return (dispatch) => {
    dispatch(actGetCourseListRequest());
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Course/AllCourse`,
      method: "GET",
      params: {
        searchcourseInfo,
      },
    })
      .then((result) => {
        dispatch(actGetCourseListSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetCourseListFailed(error));
      });
  };
};

const actGetCourseListRequest = () => {
  return {
    type: actionTypes.GET_COURSE_LIST_REQUEST,
  };
};

const actGetCourseListSuccess = (payload) => {
  return {
    type: actionTypes.GET_COURSE_LIST_SUCCESS,
    payload,
  };
};

const actGetCourseListFailed = (error) => {
  return {
    type: actionTypes.GET_COURSE_LIST_FAILED,
    payload: error,
  };
};
