import { combineReducers } from "redux";
import { userPagingReducer } from "../containers/Admin/ManageUser/modules/reducer";
import { coursePagingReducer } from "../containers/Admin/ManageCourse/modules/reducer";
import { lessonPagingReducer } from "../containers/Admin/ManageLesson/modules/reducer";
import { topicListReducer } from "../containers/Home/TopicPage/modules/reducer";
import { listQuizReducer } from "../components/CreateQuiz/modules/reducer";
import { listQuestionReducer } from "../components/Question/Modules/reducer";
import { userReducer } from "./userReducer";
import { listNotifyReducer } from "../containers/Admin/ManageNotification/modules/reducer";
import { listTopicReducer } from "../containers/Admin/ManageTopic/modules/reducer";
import { courseListReducer } from "../components/CourseList/modules/reducer";
export const rootReducer = combineReducers({
  userPagingReducer,
  coursePagingReducer,
  lessonPagingReducer,
  topicListReducer,
  listQuizReducer,
  listQuestionReducer,

  userReducer,

  listNotifyReducer,
  listTopicReducer,
  courseListReducer,
});
