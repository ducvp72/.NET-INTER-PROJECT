import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Swal from "sweetalert2";
import moment from "moment";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {
    padding: "40px 0",
    [theme.breakpoints.down("sm")]: {
      padding: "0",
    },
  },
  wrapperForm: {
    boxShadow: "0 0 11px rgb(0 0 0 / 12%)",
  },
  header: {
    backgroundColor: "#03787C",
    color: theme.palette.common.white,
    padding: "50px",

    [theme.breakpoints.down("sm")]: {
      padding: "10px",
    },
  },
  headerTitle: {
    fontSize: "38px",
    fontWeight: 400,
    lineHeight: "1.43",

    [theme.breakpoints.down("md")]: {
      fontSize: "28px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "21px",
    },
  },
  headerDetail: {
    marginTop: "25px",

    fontWeight: 400,
    lineHeight: "1.6",

    [theme.breakpoints.down("md")]: {
      marginTop: "15px",
      fontSize: "14px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "12px",
    },
  },
  body: {
    padding: "20px 30px 70px",

    backgroundColor: theme.palette.common.white,
  },
  bodyTitle: {
    marginBottom: "15px",

    fontWeight: 400,
  },
  bodyDescBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  bodyDesc: {},

  questionContainer: {
    marginTop: "30px",
  },
  questionBox: {
    "& > p": {
      fontSize: "18px",
      fontWeight: 300,
    },

    marginBottom: "15px",
  },
  fieldSet: {
    marginTop: theme.spacing(1),
  },

  sendButton: {
    textTransform: "unset",
    fontSize: "18px",

    marginTop: "30px",
    padding: theme.spacing(1),

    width: "100%",
    background: "#03787C",
    "&:hover": {
      background: "rgba(2,88,90,1)",
    },
  },
}));

function FeedBack(props) {
  const classes = useStyles();
  const history = useHistory();

  const [data, setData] = useState(null);

  const [questionList, setQuestionList] = useState(null);

  const [radio, setRadio] = useState({
    answer1: 0,
    answer2: 0,
    answer3: 0,
    answer4: 0,
    answer5: 0,
  });

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setRadio({
      ...radio,
      [name]: value,
    });
  };

  useEffect(() => {
    const feedBackId = props.match.params.id;
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/controller/ByIdFeed/${feedBackId}`,
      method: "GET",
    })
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log("error question list: ", error);
      });
  }, []);

  console.log("data list", data);

  if (data && !questionList) {
    let questionListTemp = [];
    for (let index = 0; index < Object.keys(data).length - 5; index++) {
      questionListTemp.push(data[`ques${index + 1}`]);
    }
    setQuestionList(questionListTemp);
  }

  console.log("question list", questionList);

  console.log("radio value", radio);

  const handleClick = () => {
    // Kiem tra coi checked h???t radio ch??a
    for (const property in radio) {
      // console.log(`${property}: ${radio[property]}`);
      // Kiem tra neu radio = 0 c?? ngh??a l?? ch??a ch???n, alert ra l???i
      if (radio[property] === 0) {
        Swal.fire({
          icon: "error",
          title: "B???n ch??a ch???n ????? !",
        });
        // Ng???ng ch????ng tr??nh
        return;
      }
    }

    // N???u kh??ng l???i => t???o data ????? POST
    const sendData = {
      accountID: JSON.parse(localStorage.getItem("user")).id,
      attempWhen: moment(Date()).format("YYYY-MM-DD"),
      feedbackID: data.feedbackID,
      answer1: radio.answer1,
      answer2: radio.answer2,
      answer3: radio.answer3,
      answer4: radio.answer4,
      answer5: radio.answer5,
    };

    console.log("sendData", sendData);
    // POST
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/controller/Feedback`,
      method: "POST",
      data: sendData,
    })
      .then((result) => {
        // Log v?? Alert ra khi ng?????i d??ng ????nh gi?? TH??NH C??NG
        console.log("result.data", result.data);
        Swal.fire({
          icon: "success",
          title: "C???m ??n b???n ???? ????nh gi??",
          text: "C??c c??u tr??? l???i c???a b???n ???? ???????c ghi l???i",
        }).then((resSwal) => {
          if (resSwal.isConfirmed) {
            history.replace("/home");
          }
        });
      })
      .catch((error) => {
        // Log v?? Alert ra l???i n???u user ???? tr??? l???i feedback hay v?? m???t l?? do n??o ????
        console.log("L???i error POST answer: ", error.response);
        Swal.fire({
          icon: "error",
          title: error.response.data.message,
        });
      });
  };

  return (
    <Box className={classes.root}>
      <Helmet>
        <title>LMS - Feedback</title>
        <meta charSet="utf-8" name="description" content="Trang feedback" />
      </Helmet>
      <Container maxWidth="md" className={classes.container}>
        {data ? (
          <Box className={classes.wrapperForm}>
            <Box className={classes.header}>
              <Typography
                variant="h1"
                component="h1"
                className={classes.headerTitle}
              >
                {data.feedbackName}
              </Typography>
              <Typography
                variant="h3"
                component="p"
                className={classes.headerDetail}
              >
                {data.feedbackDetail}
              </Typography>
            </Box>
            <Box className={classes.body}>
              <Typography
                variant="h3"
                component="p"
                className={classes.bodyTitle}
              >
                H??y cho bi???t m???c ????? ?????ng ?? c???a b???n b???ng c??ch t?? tr??n v??o ?? th??ch
                h???p cho c??c ti??u ch?? t??? 1 ?????n 5.
              </Typography>

              <Box className={classes.bodyDescBox}>
                <Typography
                  variant="h3"
                  component="p"
                  className={classes.bodyDesc}
                >
                  1-Ho??n to??n kh??ng ?????ng ??
                </Typography>
                <Typography
                  variant="h3"
                  component="p"
                  className={classes.bodyDesc}
                >
                  2-Kh??ng ?????ng ??
                </Typography>
                <Typography
                  variant="h3"
                  component="p"
                  className={classes.bodyDesc}
                >
                  3-Ph??n v??n
                </Typography>
                <Typography
                  variant="h3"
                  component="p"
                  className={classes.bodyDesc}
                >
                  4-?????ng ??
                </Typography>
                <Typography
                  variant="h3"
                  component="p"
                  className={classes.bodyDesc}
                >
                  5-Ho??n to??n ?????ng ??
                </Typography>
              </Box>

              <Box className={classes.questionContainer}>
                {questionList
                  ? questionList.map((item, index) => {
                      return (
                        <Box className={classes.questionBox} key={index}>
                          <Typography variant="h3" component="p">
                            {`${index + 1}. ${item}`}
                          </Typography>

                          <FormControl
                            className={classes.fieldSet}
                            component="fieldset"
                          >
                            <RadioGroup
                              aria-label={`answer${index + 1}`}
                              name={`answer${index + 1}`}
                              value={radio[`answer${index + 1}`]}
                              onChange={handleChange}
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="1"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="2"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="3"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="4"
                              />
                              <FormControlLabel
                                value="5"
                                control={<Radio color="primary" />}
                                label="5"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      );
                    })
                  : null}
              </Box>

              <Button
                color="primary"
                variant="contained"
                className={classes.sendButton}
                onClick={handleClick}
              >
                G???i
              </Button>
            </Box>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}

export default FeedBack;
