import Login from "../containers/Auth/Login";
import Register from "../containers/Auth/Register";
import Forget from "../containers/Auth/Forget";
import GetNewPassword from "../containers/Auth/GetNewPassword";
import HomePage from "./../containers/Home/HomePage";

import ManageUser from "../containers/Admin/ManageUser";
import ManageCourse from "../containers/Admin/ManageCourse";
import ManageLesson from "../containers/Admin/ManageLesson";

import CreateQuiz from "../components/CreateQuiz/index";
import MakeQuiz from "../components/MakeQuiz/index";
import Profile from "../components/Profiles/index";
import ManageNotification from "../containers/Admin/ManageNotification";
import ManageTopic from "../containers/Admin/ManageTopic";

import CourseDetail from "./../containers/Home/CourseDetail";
import Rating from "../components/Rating/index";
import MyCourse from "../components/MyCourse";
import TopicPage from "../containers/Home/TopicPage";
import Submit from "./../components/Submit/index";
import FeedBack from "../containers/Home/FeedBack";
import ManageFeedback from "../containers/Admin/ManageFeedback";
import Member from "./../components/Member/index";
import ScoreQuiz from "../components/ScoreQuiz/index";
import SubmitDetail from './../components/SubmitDetail/index';

export const routeHome = [
  {
    exact: true,
    path: ["/", "/home"],
    component: HomePage,
  },
  {
    exact: false,
    path: "/createquiz",
    component: CreateQuiz,
  },
  {
    exact: false,
    path: "/quiz/:id",
    component: MakeQuiz,
  },
  {
    exact: false,
    path: "/profile",
    component: Profile,
  },
  {
    exact: false,
    path: "/course/id/:id",
    component: CourseDetail,
  },
  {
    exact: false,
    path: "/rating",
    component: Rating,
  },
  {
    exact: false,
    path: "/topic",
    component: TopicPage,
  },
  {
    exact: false,
    path: "/submit",
    component: Submit,
  },
  {
    exact: false,
    path: "/feedback/:id",
    component: FeedBack,
  },

  {
    exact: false,
    path: "/mycourse",
    component: MyCourse,
  },
  {
    exact: false,
    path: "/member/:id",
    component: Member,
  },
  {
    exact: false,
    path: "/scorequiz",
    component: ScoreQuiz,
  },
  {
    exact: false,
    path: "/submitdetail/:id",
    component: SubmitDetail
  }
];

export const routeAdmin = [
  {
    exact: false,
    path: "/manage-user",
    component: ManageUser,
  },
  {
    exact: false,
    path: "/manage-course",
    component: ManageCourse,
  },
  {
    exact: false,
    path: "/manage-lesson",
    component: ManageLesson,
  },
  {
    exact: false,
    path: "/manage-feedback",
    component: ManageFeedback,
  },
  {
    exact: false,
    path: "/manage-notification",
    component: ManageNotification,
  },
  {
    exact: false,
    path: "/manage-topic",
    component: ManageTopic,
  },
];

export const routeAuth = [
  {
    exact: false,
    path: "/login",
    component: Login,
  },
  {
    exact: false,
    path: "/register",
    component: Register,
  },
  {
    exact: false,
    path: "/forgot",
    component: Forget,
  },
  {
    exact: false,
    path: "/get-new-password",
    component: GetNewPassword,
  },
];
