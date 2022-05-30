import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  Container,
  Grid,
  InputBase,
  Paper,
  IconButton,
} from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import BackArrow from "../../assets/back.png";
import NextArrow from "../../assets/next.png";
import FhqxBg from "../../assets/fhqx-bg.jpg";
import { sliceIntoChunks } from "../../utils";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { actGetCourseList } from "./modules/action";
import SearchIcon from "@material-ui/icons/Search";
import BackgroundImage from "../../assets/fhqx-bg.jpg";

const StyledSlider = styled(Slider)`
   {
    // Arrow Position //
    .slick-prev {
      left: -20px !important;
    }
    .slick-next {
      right: -20px !important;
    }

    // Box Arrow //
    .slick-arrow {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      top: 35%;
      width: 40px;
      height: 40px;
      z-index: 1;
      opacity: 1;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgb(0 0 0 / 8%), 0 4px 12px rgb(0 0 0 / 8%);
      transition: all 0.2s;
    }
    .slick-arrow:hover {
      opacity: 0.7;
    }
    // Icon Next and Prev //
    .slick-next::before {
      background-image: url(${NextArrow});
    }
    .slick-prev::before {
      background-image: url(${BackArrow});
    }
    .slick-arrow::before {
      content: "" !important;
      background-position: center;
      background-size: cover;
      display: block;
      width: 25px;
      height: 25px;
      z-index: 10;
      opacity: 1;
    }
    // space between slides //
    .slick-slide > div {
      margin: 0 8px;
    }
    .slick-list {
      margin: 0 -8px;
    }
  }
`;

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  adaptiveHeight: true,
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "40px 0",
  },
  container: {},
  title: {
    display: "inline-block",

    fontSize: "24px",
    marginBottom: "20px",

    position: "relative",
    "&::after": {
      position: "absolute",
      display: "block",
      content: "''",

      bottom: "-5px",
      left: "0",

      height: "2px",
      width: "120%",

      backgroundColor: theme.palette.primary.main,
    },
  },
  courseLink: {
    textDecoration: "none",
    color: "black",
  },
  courseBox: {
    "&:hover": {},
    "&:hover $courseImg": {
      boxShadow:
        "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
    },
    "&:hover $courseInfo": {
      visibility: "hidden",
      opacity: 0,
    },
    "&:hover $courseButton": {
      visibility: "visible",
      opacity: 1,
    },
  },
  courseImg: {
    position: "relative",
    height: "224px",

    backgroundPosition: "center center !important ",
    backgroundSize: "cover !important",
    backgroundRepeat: "no-repeat !important",

    marginBottom: "10px",

    borderRadius: "4px",

    overflow: "hidden !important",
  },
  courseInfoWrapper: {
    position: "relative",
  },

  courseInfo: {
    position: "relative",

    visibility: "visible",
    opacity: 1,
    transition: "all .3s",
  },
  courseButton: {
    position: "absolute",
    top: "10px",
    left: 0,

    padding: "15px",
    width: "100%",

    fontSize: "18px",
    textAlign: "center",

    visibility: "hidden",
    opacity: 0,
    transition: "all .3s",
  },

  courseName: {
    height: "32px",
    maxHeight: "32px",

    fontSize: "18px",
    fontWeight: 500,
    color: theme.palette.common.black,
    lineHeight: "32px",
    textAlign: "left",

    display: "-webkit-box",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  courseDetail: {
    height: "42px",
    maxHeight: "42px",

    fontSize: "15px",
    color: theme.palette.common.black,
    lineHeight: "22px",
    textAlign: "left",

    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  courseDuration: {
    fontSize: "15px",
    fontWeight: 500,
    textAlign: "left",
    color: "#4a4a4a",
    lineHeight: 1.42,

    margin: "2px 0 4px 0 ",

    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },

  // Tin
  paper: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "70%",
  },
  inputBase: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchForm: {
    backgroundColor: theme.palette.common.white,

    marginLeft: "15px",
  },

  courseListContainer: {
    marginTop: "10px",
  },
}));

const CourseList = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const theme = useTheme();
  const isMatchLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isMatchMd = useMediaQuery(theme.breakpoints.down("md"));
  const isMatchSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isMatchXs = useMediaQuery(theme.breakpoints.down("xs"));

  const [value, setValue] = useState(0);
  const [coursePerSlide, setCoursePerSlide] = useState(4);

  const [courseList, setCourseList] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isMatchLg) {
      setCoursePerSlide(4);
    } else if (isMatchXs) {
      setCoursePerSlide(1);
    } else if (isMatchSm) {
      setCoursePerSlide(2);
    } else if (isMatchMd) {
      setCoursePerSlide(3);
    }
  }, [isMatchLg, isMatchMd, isMatchSm, isMatchXs]);

  const getCourseList = (searchcourseInfo) => {
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/Course/AllCourse`,
      method: "GET",
      params: {
        searchcourseInfo,
      },
    })
      .then((result) => {
        setCourseList(result.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("Called func axios");
  };

  useEffect(() => {
    getCourseList(search);
  }, [search]);

  // search box
  const handleOnChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // find course
  const handleOnClickSearch = () => {
    {
      search.trim() === "" ? getCourseList() : getCourseList(search);
    }
  };
  const handleOnKeyPress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      {
        search.trim() === "" ? getCourseList() : getCourseList(search);
      }
    }
  };

  const renderCourseList = (arr) => {
    return arr.map((item, index) => {
      return (
        <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
          <Link
            className={classes.courseLink}
            to={`/course/id/${item.courseID}`}
          >
            <div className={classes.courseBox}>
              <div
                className={classes.courseImg}
                style={{
                  background: `url(http://group04lms.japaneast.azurecontainer.io/api/Course/GetUrlFile/${item.courseID}),url(${BackgroundImage})`,
                }}
              ></div>
              <div className={classes.courseInfoWrapper}>
                <div className={classes.courseInfo}>
                  <Typography component="p" className={classes.courseName}>
                    {item.courseName}
                  </Typography>
                  <Typography component="p" className={classes.courseDetail}>
                    <span
                      style={{
                        fontWeight: 500,
                      }}
                    ></span>
                    {item.courseDetail}
                  </Typography>
                  <Typography component="p" className={classes.courseDuration}>
                    Thời gian: {item.courseDuration} tháng
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.courseButton}
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </Link>
        </Grid>
      );
    });
  };

  return (
    <section id="course-list" className={classes.root}>
      <Container component="div" maxWidth="lg" className={classes.container}>
        <Grid container>
          <Grid item md={6}>
            <Typography
              variant="h2"
              color="primary"
              component="p"
              className={classes.title}
            >
              Danh sách khóa học
            </Typography>
          </Grid>
          <Grid container item justify="flex-end" md={6}>
            <Paper elevation={1} component="form" className={classes.paper}>
              <InputBase
                placeholder="Tìm kiếm khóa học"
                className={classes.inputBase}
                onChange={handleOnChangeSearch}
                onKeyDown={handleOnKeyPress}
              />
              <IconButton>
                <SearchIcon color="primary" onClick={handleOnClickSearch} />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>

        {/* <StyledSlider {...settings}> */}
        {courseList &&
          courseList.length > 0 &&
          sliceIntoChunks(courseList, coursePerSlide).map((item, index) => {
            return (
              <div key={index}>
                <Grid
                  container
                  spacing={4}
                  className={classes.courseListContainer}
                >
                  {renderCourseList(item)}
                </Grid>
              </div>
            );
          })}
        {/* </StyledSlider> */}
      </Container>
    </section>
  );
};
export default CourseList;
