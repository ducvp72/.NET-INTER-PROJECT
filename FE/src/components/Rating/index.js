import React from "react";
import HoverRating from "./rating";
import { Button, makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import imgpd from "../../assets/pd.jpg";
const useStyles = makeStyles(() => ({
  title: {
    background: "#0E1E40",
    color: "white",
    height: "100px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "25px",
  },
  content: {
    margin: "40px 10px",
  },
  avatar: {
    height: "150px",
    width: "150px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    marginLeft: "25px",
    marginTop: "25px",
  },
  rating: {
    display: "flex",
    flexDirection: "column",
    width: "500px",
    height: "100px",
  },
  major: {
    marginLeft: "15px",
  },
}));
const Rating = () => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.title}>
        <h3>Đánh giá giáo viên</h3>
      </div>
      <div className={classes.content}>
        <div className={classes.profile}>
          <Avatar className={classes.avatar} alt="teacher" src={imgpd} />
          <div className={classes.major}>
            <h4 style={{ color: "red" }}>Võ Phú Đức</h4>
            <p style={{ fontWeight: "bold" }}>Professor</p>
          </div>
        </div>
        <div className={classes.vote}>
          <h5>Vote</h5>
          <HoverRating />
        </div>
        <div className={classes.rating}>
          <h5>Viết đánh giá</h5>
          <textarea />
        </div>
        <Button variant="contained" color="primary">
          Gửi đánh giá
        </Button>
      </div>
    </div>
  );
};
export default Rating;
