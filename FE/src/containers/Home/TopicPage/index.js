import React, { useEffect, useState } from "react";
import { actGetTopicList } from "./modules/action";
import { useDispatch, useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import {
  withStyles,
  Avatar,
  Badge,
  Container,
  Divider,
  makeStyles,
  Typography,
  TextField,
  Button,
  CssBaseline,
} from "@material-ui/core";
import moment from "moment";
import axios from "axios";
import { pink } from "@material-ui/core/colors";
import Swal from "sweetalert2";
import BannerImg from "../../../assets/fhqutexBanner.jpg";
import { Helmet } from "react-helmet";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,

      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2)",
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {},
  //topic info

  banner: {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${BannerImg})`,

    height: "400px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundAttachment: "fixed",

    transition: "all .4s ease",

    [theme.breakpoints.down("md")]: {
      height: "300px",
    },
    [theme.breakpoints.down("sm")]: {
      height: "140px",
    },
  },

  container: {
    paddingTop: theme.spacing(3),
  },

  title: {
    color: theme.palette.secondary.main,
    margin: theme.spacing(2),
  },
  noTopic: {
    margin: theme.spacing(0, 2),
  },

  card: {
    backgroundColor: theme.palette.common.white,
    boxShadow: "0 10px 20px 0 rgb(0 0 0 / 5%)",
    borderRadius: theme.spacing(1),

    marginBottom: theme.spacing(3),
  },
  cardHeader: {
    color: "#007bff",

    padding: theme.spacing(2),
  },
  cardContent: {
    padding: theme.spacing(2),
  },

  //comment form
  commentForm: {
    display: "flex",
    alignItems: "flex-start",
    padding: theme.spacing(2),
  },
  commentTextArea: {
    marginLeft: "8px",

    width: "100%",

    // textArea
    "& .MuiOutlinedInput-multiline": {
      padding: "9px 14px !important",
    },
  },
  accountBox: {
    textDecoration: "none",
    cursor: "pointer",
    color: "#9b9b9b",
    margin: "inherit",
    fontSize: theme.typography.h5.fontSize,

    display: "flex",
    alignItems: "center",

    transition: "all .2s",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  icon: {
    marginRight: "5px",
    borderRadius: "25px",
    height: "auto",
    [theme.breakpoints.down("sm")]: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  },
  commentButton: {
    marginLeft: theme.spacing(2),
  },

  commentReplyContainer: {},
  commentReplyBox: {
    display: "flex",
    padding: theme.spacing(1, 2),
    "&::after": {
      display: "block",
      content: "''",
    },
  },
  commentInfo: {
    marginLeft: theme.spacing(2),
  },
  commentName: {},
  commentDate: {
    marginLeft: theme.spacing(1),
    color: theme.palette.grey[500],
  },

  commentContent: {
    padding: "4px 16px ",
    fontWeight: 400,
  },

  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },

  // Comment Box
  commentBoxHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    padding: "8px 16px",
  },
  commentBoxButton: {
    fontSize: "12px",
  },
  commentSeeMore: {
    textAlign: "center",
    color: "#007bff",

    paddingBottom: theme.spacing(1),

    transition: "all .2s",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
}));

function CommentContainer(props) {
  const classes = useStyles();

  const { data } = props;

  const [comments, setComments] = useState(data.comments);

  return (
    <>
      <CommentForm comments={comments} setComments={setComments} data={data} />
      <Divider />
      <CommentBox comments={comments} setComments={setComments} />
    </>
  );
}

function CommentForm(props) {
  const classes = useStyles();
  const [text, setText] = useState("");

  const { data, comments, setComments } = props;

  return (
    <Box className={classes.commentForm}>
      <Box className={classes.accountBox}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
          className={classes.icon}
        >
          <Avatar
            className={classes.pink}
            alt="user-avatar"
            title={
              // localStorage.getItem("user")
              //   ? JSON.parse(localStorage.getItem("user")).name
              //   : "user"
              JSON.parse(localStorage.getItem("user"))?.name
            }
          >
            {localStorage.getItem("user")
              ? JSON.parse(localStorage.getItem("user"))
                  .name.charAt(0)
                  .toUpperCase()
              : null}
          </Avatar>
        </StyledBadge>
      </Box>
      <TextField
        id="outlined-textarea"
        placeholder="Nhập bình luận tại đây..."
        multiline
        variant="outlined"
        name="comment"
        className={classes.commentTextArea}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
      />
      <Button
        className={classes.commentButton}
        variant="contained"
        color="primary"
        onClick={() => {
          // If you did not log in
          if (!localStorage.getItem("user")) {
            Swal.fire({
              icon: "warning",
              title: "Bạn cần đăng nhập để sử dụng chức năng này",
              showConfirmButton: false,
              timer: 1500,
            });
            return;
          }

          // If comment box is empty
          if (text === "") {
            return;
          }

          const newData = {
            accountID: JSON.parse(localStorage.getItem("user")).id,
            topicID: data.topicID,
            commentDetail: text,
          };

          axios({
            url: `http://group04lms.japaneast.azurecontainer.io/api/Comment/CreateComment`,
            method: "POST",
            data: newData,
          })
            .then((result) => {
              setComments(comments.concat([result.data]));
              setText("");
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        Gửi
      </Button>
    </Box>
  );
}

function CommentBox(props) {
  const classes = useStyles();

  const { comments, setComments } = props;
  const [showComments, setShowComments] = useState(false);
  const [total, setTotal] = useState(3);

  console.log("comment length", comments.length);
  console.log("total comment ", total);

  return (
    <>
      <Box className={classes.commentBoxHead}>
        <Typography variant="h3" component="p">
          Bình luận: {comments.length}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.commentBoxButton}
          onClick={() => {
            if (showComments) {
              setTotal(3);
            }
            setShowComments(!showComments);
          }}
        >
          {showComments ? "Ẩn bình luận" : "Hiển thị bình luận"}
        </Button>
      </Box>

      {/* Check hide or show comments */}
      {/* Reverse the comments */}
      {showComments && (
        <Box>
          {[...comments]
            .reverse()
            .slice(0, total)
            .map((item, index) => {
              return <Comment key={index} data={item} />;
            })}

          {/* Show more comments */}
          {total < comments.length ? (
            <Typography
              className={classes.commentSeeMore}
              variant="h4"
              component="p"
              onClick={() => {
                setTotal(total + 3);
              }}
            >
              xem thêm bình luận
            </Typography>
          ) : null}
        </Box>
      )}
    </>
  );
}

const randomColor = () => {
  let hex = Math.floor(Math.random() * 0xffffff);
  let color = "#" + hex.toString(16);

  return color;
};

function Comment(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <Box className={classes.commentReplyBox}>
      <Avatar
        alt="comment-avatar"
        title={data.accountName}
        style={{
          backgroundColor: randomColor(),
        }}
      >
        {data.accountName.charAt(0).toUpperCase()}
      </Avatar>

      <Box>
        <Box className={classes.commentInfo}>
          <Typography
            className={classes.commentName}
            variant="h5"
            component="span"
          >
            {data.accountName}
          </Typography>
          <Typography
            className={classes.commentDate}
            variant="h5"
            component="span"
          >
            {moment(data.commentTime).fromNow()}
          </Typography>
        </Box>

        <Typography
          className={classes.commentContent}
          variant="h5"
          component="p"
        >
          {data.commentDetail}
        </Typography>
      </Box>
    </Box>
  );
}

function TopicPage(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const topicList = useSelector((state) => state.topicListReducer);

  useEffect(() => {
    dispatch(actGetTopicList());
  }, []);

  const renderTopicList = (arr) => {
    return arr.map((item) => {
      return (
        <Box className={classes.card} key={item.topicID}>
          <Box className={classes.cardHeader}>
            <Typography variant="h2" component="p">
              {item.topicName}
            </Typography>
          </Box>
          <Divider />
          <Box className={classes.cardContent}>
            <Typography variant="h3" component="p">
              {item.topicDetail}
            </Typography>
          </Box>
          <Divider />
          <CommentContainer data={item} />
        </Box>
      );
    });
  };

  console.log("topiclist", topicList);

  return (
    <div className={classes.root}>
      <Helmet>
        <title>LMS - Thảo luận</title>
        <meta charSet="utf-8" name="description" content="Trang thảo luận" />
      </Helmet>
      <CssBaseline />
      <Box className={classes.banner}></Box>
      <Container maxWidth="lg" className={classes.container}>
        {/* <Typography className={classes.title} variant="h1" component="h1">
          Cùng nhau bàn luận
        </Typography> */}

        {topicList.data && topicList.data.length !== 0 ? (
          renderTopicList([...topicList.data].reverse())
        ) : (
          <Typography className={classes.noTopic} variant="h3" component="p">
            Hiện không có chủ đề thảo luận nào...
          </Typography>
        )}
      </Container>
    </div>
  );
}

export default TopicPage;
