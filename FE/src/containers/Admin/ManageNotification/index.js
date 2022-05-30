import React, { useEffect, useReducer, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import ManageDialog from "./ManageDialog";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { actGetListNotify } from "./modules/action";
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

export default function ManageNotification() {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const listNotify = useSelector((state) => state.listNotifyReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });
  useEffect(() => {
    dispatch(actGetListNotify());
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
      title: "Thêm Thông Báo",
      button: "Thêm",
      id: "them",
    });
    setOpenDialog(true);
  };
  const renderListNotify = () => {
    if (listNotify) {
      const notifyList = listNotify.data;
      var result = null;
      if (notifyList.length > 0) {
        if (rowsPerPage === -1) {
          result = notifyList?.map((notify) => {
            return <Row key={notify.notifyID} notify={notify} />;
          });
        } else
          result = notifyList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((notify) => {
              return <Row key={notify.notifyID} notify={notify} />;
            });
      }
    }
    return result;
  };
  return (
    <div className={classes.root}>
      <Helmet>
        <title>Quản lý thông báo</title>
        <meta
          charSet="utf-8"
          name="description"
          content="Trang quản lý thông báo"
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
              <TableCell align="left">Notify ID</TableCell>
              <TableCell align="left">Notify Name</TableCell>
              <TableCell align="left">Notify Detail</TableCell>
              <TableCell align="left">Confirm</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-white">{renderListNotify()}</TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  { label: "Tất cả", value: 100 },
                ]}
                count={listNotify?.data.length}
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
