import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@material-ui/core";
import Button from "@restart/ui/esm/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

const useStyle = makeStyles(() => ({
  root: {
    marginTop: "30px",
    minHeight: "60vh",
  },
  button: {
    display: "block",
    padding: "10px",
    backgroundColor: "#0e1e40",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "10px",
    width: "100%",
    "&:hover": {
      backgroundColor: "#10224a",
    },
    marginTop: "10px",
  },
  name: {
    textAlign: "center",
    padding: "10px 0",
  },
  email: {
    textAlign: "center",
  },
}));

export default function Member(props) {
  const classes = useStyle();
  const [members, setMembers] = useState([]);
  const [folders, setFolders] = useState([]);
  const history = useHistory();
  const courseID = props.match.params.id;
  useEffect(() => {
    axios
      .get(
        `http://group04lms.japaneast.azurecontainer.io/api/Student/ListByCourse/${courseID}`
      )
      .then((res) => {
        setMembers(res.data.data);
      });
  }, [courseID]);
  useEffect(() => {
    axios
      .get(
        `http://group04lms.japaneast.azurecontainer.io/api/SubmitPoint/ListSubmit`
      )
      .then((res) => {
        setFolders(res.data);
      });
  }, []);
  const handleFolder = (folderName) => {
    history.push(`/submitdetail/${folderName}`);
  };

  return (
    <Container className={classes.root}>
      <Grid container spacing={3}>
        {members.length > 0 ? (
          members.map((member, index) => {
            return (
              <Grid item xs={12} sm={3} key={index}>
                <Card>
                  <CardContent>
                    <Typography className={classes.name} variant="h3">
                      {member.name}
                    </Typography>
                    <Typography className={classes.email} variant="h5">
                      {member.email}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      className={classes.button}
                      onClick={() => handleFolder(member.studentID)}
                    >
                      Bài nộp
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        ) : (
          <h4>Chưa có học viên đăng ký khóa học này</h4>
        )}
      </Grid>
    </Container>
  );
}
