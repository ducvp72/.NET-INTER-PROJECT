import React, { useEffect, useState } from "react";
import { Container, makeStyles } from "@material-ui/core";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "40px",
  },
  userForm: {},
  table: {
    minWidth: 800,
  },
  tableCell: {
    position: "relative",
    "&::after": {
      display: "block",
      content: "''",
      position: "absolute",
      top: "50%",
      right: 0,
      transform: "translateY(-50%)",

      height: "60%",
      width: "1px",

      backgroundColor: "#e0e0e0",
    },
  },
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
}));

function FeedBackList(props) {
  const classes = useStyles();

  const history = useHistory();

  const [data, setData] = useState(null);

  useEffect(() => {
    axios({
      url: `http://group04lms.japaneast.azurecontainer.io/api/controller/FeedbackQuestionList`,
      method: "GET",
    })
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCheck = (arr) => {
    let status = {
      name: "Chưa khảo sát",
      link: `feedback/${arr[0].feedbackID}`,
      login: true,
    };
    arr.forEach((item, index) => {
      if (!localStorage.getItem("user")) {
        return (status = {
          name: "Chưa đăng nhập",
          link: "/",
          login: false,
        });
      }
      if (item.accountID === JSON.parse(localStorage.getItem("user")).id) {
        console.log("item", item);
        status = {
          name: "Đã khảo sát",
          link: "/",
          login: true,
        };
      }
    });
    return status;
  };

  return (
    <Container className={classes.root} maxWidth="lg" component="section">
      <Typography
        variant="h2"
        color="primary"
        component="p"
        className={classes.title}
      >
        Khảo sát
      </Typography>
      <TableContainer className={classes.userForm} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width="5%" align="left" className={classes.tableCell}>
                STT
              </TableCell>
              <TableCell width="30%" align="left" className={classes.tableCell}>
                Tên bài đánh giá
              </TableCell>
              <TableCell width="40%" align="left" className={classes.tableCell}>
                Mô tả
              </TableCell>
              <TableCell width="10%" align="left" className={classes.tableCell}>
                Ngày hết hạn
              </TableCell>
              <TableCell width="15%" align="left">
                Khảo sát
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.length > 0 &&
              data.map((item, index) => {
                console.log("item", item);
                let status = {
                  name: localStorage.getItem("user")
                    ? "Chưa khảo sát"
                    : "Chưa đăng nhập",
                  link: `feedback/${item.feedbackID}`,
                  login: localStorage.getItem("user") ? true : false,
                };

                if (item.feedbackAttemps.length > 0) {
                  status = handleCheck(item.feedbackAttemps);
                }

                return (
                  <TableRow key={item.feedbackID}>
                    <TableCell
                      width="5%"
                      align="left"
                      className={classes.tableCell}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      width="30%"
                      align="left"
                      className={classes.tableCell}
                    >
                      {item.feedbackName}
                    </TableCell>
                    <TableCell
                      width="40%"
                      align="left"
                      className={classes.tableCell}
                    >
                      {item.feedbackDetail}
                    </TableCell>
                    <TableCell
                      width="10%"
                      align="left"
                      className={classes.tableCell}
                    >
                      {moment(item.expiredDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell width="15%" align="left">
                      <Link
                        onClick={() => {
                          if (!status.login) {
                            Swal.fire({
                              icon: "info",
                              title:
                                "Bạn cần đăng nhập để sử dụng chức năng này !",
                            });
                            return;
                          } else {
                            history.push(`${status.link}`);
                          }
                        }}
                      >
                        {status.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default FeedBackList;
