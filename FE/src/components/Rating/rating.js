import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

const labels = {
  0.5: "Không dạy gì luôn á",
  1: "Hơi tệ",
  1.5: "Tệ bạc",
  2: "Bình thường",
  2.5: "Ổn",
  3: "Nhiệt tình",
  3.5: "Xuất sắc",
  4: "Qúa xuất sắc",
  4.5: "Tuyệt vời",
  5: "Qúa tuyệt vời",
};

const useStyles = makeStyles({
  root: {
    width: 300,
    display: "flex",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    color: "blue",
  },
});

export default function HoverRating() {
  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {value !== null && (
        <Box className={classes.text} ml={2}>
          {labels[hover !== -1 ? hover : value]}
        </Box>
      )}
    </div>
  );
}
