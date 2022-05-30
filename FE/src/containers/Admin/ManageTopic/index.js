import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import ManageDialog from "./ManageDialog";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { actGetListTopic } from "./modules/action";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import Row from "./row";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(0, 1),
    marginBottom: "15px",
  },
}));

export default function ManageTopic() {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const listTopic = useSelector((state) => state.listTopicReducer);
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });
  useEffect(() => {
    dispatch(actGetListTopic());
  }, []);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Check Role
  if (JSON.parse(localStorage.getItem("user")).userRole !== "admin") {
    return <Redirect to="/manage-user" />;
  }

  const handleAdd = () => {
    setModal({
      title: "Thêm Topic",
      button: "Thêm",
      id: "them",
    });
    setOpenDialog(true);
  };
  const renderListTopic = () => {
    if (listTopic) {
      const topicList = listTopic.data;
      var result = null;
      if (topicList?.length > 0) {
        if (rowsPerPage === -1) {
          result = topicList?.map((topic) => {
            return <Row key={topic.topicID} topic={topic} />;
          });
        } else
          result = topicList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((topic) => {
              return <Row key={topic.topicID} topic={topic} />;
            });
      }
    }
    return result;
  };
  return (
    <div className={classes.root}>
      <Helmet>
        <title>Quản lý thảo luận</title>
        <meta
          charSet="utf-8"
          name="description"
          content="Trang quản lý thảo luận"
        />
      </Helmet>
      <Grid container item xs={12} justifyContent="flex-end">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleAdd}
        >
          Thêm
        </Button>
      </Grid>
      <ManageDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleCloseDialog={handleCloseDialog}
        modal={modal}
      />
      <TableContainer className="light-grey-bg" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Topic ID</TableCell>
              <TableCell align="left">Topic Name</TableCell>
              <TableCell align="left">Topic Detail</TableCell>
              <TableCell align="left">OutDated</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-white">{renderListTopic()}</TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  { label: "Tất cả", value: 100 },
                ]}
                count={listTopic?.data?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { style: { lineHeight: "16px" } },
                }}
                onChangePage={(e, page) => setPage(page)}
                onChangeRowsPerPage={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
