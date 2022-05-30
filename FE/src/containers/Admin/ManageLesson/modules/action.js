import * as actionTypes from "./constant";
import axios from "axios";

export const actGetLessonPaging = (PageNumber, PageSize, lessInfo) => {
  return (dispatch) => {
    dispatch(actGetLessonPagingRequest());
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/LessonForAdmin/LessonList`,
      method: "GET",
      params: {
        PageNumber,
        PageSize,
        lessInfo,
      },
    })
      .then((result) => {
        dispatch(actGetLessonPagingSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetLessonPagingFailed(error));
      });
  };
};

const actGetLessonPagingRequest = () => {
  return {
    type: actionTypes.GET_LESSON_PAGING_REQUEST,
  };
};

const actGetLessonPagingSuccess = (payload) => {
  return {
    type: actionTypes.GET_LESSON_PAGING_SUCCESS,
    payload,
  };
};

const actGetLessonPagingFailed = (error) => {
  return {
    type: actionTypes.GET_LESSON_PAGING_FAILED,
    payload: error,
  };
};
