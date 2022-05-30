import * as actionTypes from "./constant";
import axios from "axios";

export const actGetCoursePaging = (PageNumber, PageSize, courseInfo) => {
  return (dispatch) => {
    dispatch(actGetCoursePagingRequest());
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Course/CourseListPagination`,
      method: "GET",
      params: {
        PageNumber,
        PageSize,
        courseInfo,
      },
    })
      .then((result) => {
        dispatch(actGetCoursePagingSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetCoursePagingFailed(error));
      });
  };
};

const actGetCoursePagingRequest = () => {
  return {
    type: actionTypes.GET_COURSE_PAGING_REQUEST,
  };
};

const actGetCoursePagingSuccess = (payload) => {
  return {
    type: actionTypes.GET_COURSE_PAGING_SUCCESS,
    payload,
  };
};

const actGetCoursePagingFailed = (error) => {
  return {
    type: actionTypes.GET_COURSE_PAGING_FAILED,
    payload: error,
  };
};
