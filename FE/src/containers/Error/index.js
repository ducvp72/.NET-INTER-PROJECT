import React from "react";
import { Box, Container, Typography, makeStyles } from "@material-ui/core";
// import Page from "../../components/Page";
import errorImage from "../../assets/undraw_page_not_found_su7k.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    width: "100%",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-60%)",
  },
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },
  title: {
    fontSize: "40px",
    fontWeight: 600,
    [theme.breakpoints.down("md")]: {
      fontSize: "30px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
  },
  desc: {
    fontSize: "30px",
    fontWeight: 500,
    [theme.breakpoints.down("md")]: {
      fontSize: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const Error = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} title="404">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography align="center" color="primary" className={classes.title}>
            404: The page you are looking for isn’t here
          </Typography>
          <Typography align="center" color="secondary" className={classes.desc}>
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation
          </Typography>
          <Box textAlign="center">
            <img
              alt="Under development"
              className={classes.image}
              src={errorImage}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Error;
