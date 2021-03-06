import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "@material-ui/lab";
import {
  Button,
  CircularProgress,
  CssBaseline,
  Grid,
  InputBase,
  TableFooter,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ManageDialog from "./ManageDialog";
import axios from "axios";
import { Redirect } from "react-router";
import Swal from "sweetalert2";
import { actGetUserPaging } from "./modules/action";
import moment from "moment";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  rootAlert: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  rootPagination: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  paper: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "500px",
  },
  inputBase: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchForm: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
    marginTop: theme.spacing(3),
  },
  userForm: {
    marginTop: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(0, 1),
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
}));

const numberElementOfPage = "8";

export default function ManageUser() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const userPaging = useSelector((state) => state.userPagingReducer);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [user, setUser] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date("08/29/2000"));
  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(actGetUserPaging(page.toString(), numberElementOfPage));
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdate = (user) => {
    setSelectedDate(user.ngaySinh);
    setModal({
      title: "Ch???nh S???a Ng?????i D??ng",
      button: "C???p Nh???t",
      id: "sua",
    });
    setUser(user);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedDate(new Date("08/29/2000"));
    setModal({
      title: "Th??m Ng?????i D??ng",
      button: "Th??m",
      id: "them",
    });
    setUser({});

    setOpenDialog(true);
  };

  //Pagination
  const handleChange = (event, value) => {
    event.preventDefault();
    setPage(value);
    {
      search === ""
        ? dispatch(actGetUserPaging(value.toString(), numberElementOfPage))
        : dispatch(actGetUserPaging(value.toString(), numberElementOfPage));
    }
  };

  // search box
  const handleOnChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // find user
  const handleOnClickSearch = () => {
    setPage(1);
    {
      search.trim() === ""
        ? dispatch(actGetUserPaging("1", numberElementOfPage))
        : dispatch(actGetUserPaging("1", numberElementOfPage, search));
    }
  };

  const handleOnKeyPress = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      setPage(1);
      {
        search.trim() === ""
          ? dispatch(actGetUserPaging("1", numberElementOfPage))
          : dispatch(actGetUserPaging("1", numberElementOfPage, search));
      }
    }
  };

  const deleteUser = (userId) => {
    Swal.fire({
      icon: "question",
      title: "X??a t??i kho???n",
      text: "B???n c?? th???t s??? mu???n x??a t??i kho???n n??y ?",
      showCancelButton: true,
      confirmButtonText: "?????ng ??",
      cancelButtonText: "H???y",
    }).then((swalRes) => {
      if (swalRes.isConfirmed) {
        axios({
          url: `http://group04lms.japaneast.azurecontainer.io/api/User/DeleteUser/${userId}`,
          method: "DELETE",
        })
          .then((result) => {
            Swal.fire({
              icon: "success",
              title: "X??a th??nh c??ng",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              search.trim() === ""
                ? dispatch(
                    actGetUserPaging(page.toString(), numberElementOfPage)
                  )
                : dispatch(
                    actGetUserPaging(
                      page.toString(),
                      numberElementOfPage,
                      search
                    )
                  );
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: error.response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const renderUserPaging = (data) => {
    return data.map((user, index) => {
      let roleTemp = "";
      switch (user.userRole) {
        case "student": {
          roleTemp = "H???c vi??n";
          break;
        }
        case "teacher": {
          roleTemp = "Gi??o vi??n";
          break;
        }
        case "instructor": {
          roleTemp = "Tr??? gi???ng";
          break;
        }
        case "mentor": {
          roleTemp = "H??? tr??? l???p";
          break;
        }
        case "classAdmin": {
          roleTemp = "Admin l???p";
          break;
        }
        case "admin": {
          roleTemp = "Qu???n tr??? vi??n";
          break;
        }
        default: {
          roleTemp = "Ch??a x??c nh???n";
          break;
        }
      }

      let genderTemp = "";
      switch (user.gioiTinh) {
        case "nam": {
          genderTemp = "Nam";
          break;
        }
        case "nu": {
          genderTemp = "N???";
          break;
        }
        case "khac": {
          genderTemp = "Kh??c";
          break;
        }
        default: {
          genderTemp = "Kh??ng x??c ?????nh";
          break;
        }
      }

      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row" className={classes.tableCell}>
            {user.userName}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {user.name}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {user.email}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {user.phone}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {moment(user.ngaySinh).format("DD/MM/YYYY")}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {genderTemp}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {roleTemp}
          </TableCell>
          <TableCell align="center">
            <IconButton
              aria-label="edit"
              color="primary"
              disabled={currentUser.id === user.id}
              onClick={() => {
                user.userRole
                  ? handleUpdate(user)
                  : Swal.fire({
                      icon: "error",
                      title: "Ng?????i d??ng ch??a x??c nh???n t??i kho???n",
                    });
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="secondary"
              disabled={currentUser.id === user.id}
              onClick={() => deleteUser(user.id)}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Qu???n l?? ng?????i d??ng</title>
        <meta
          charSet="utf-8"
          name="description"
          content="Trang qu???n l?? ng?????i d??ng"
        />
      </Helmet>
      <CssBaseline />
      <Grid container>
        <Grid container item xs={12} justifyContent="flex-end">
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleAdd}
          >
            Th??m
          </Button>
        </Grid>
        <Grid className={classes.searchForm} container item xs={12}>
          <Paper elevation={1} component="form" className={classes.paper}>
            <InputBase
              placeholder="T??m ki???m ng?????i d??ng"
              className={classes.inputBase}
              onChange={handleOnChangeSearch}
              onKeyDown={handleOnKeyPress}
            />
            <IconButton onClick={handleOnClickSearch}>
              <SearchIcon color="primary" />
            </IconButton>
          </Paper>
        </Grid>
      </Grid>
      <TableContainer className={classes.userForm} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                className={classes.tableCell}
              >
                T??n t??i kho???n
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                H??? t??n
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Email
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                S??? ??i???n tho???i
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                DOB
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Gi???i t??nh
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Lo???i ng?????i d??ng
              </TableCell>
              <TableCell align="center">Ch???c n??ng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userPaging.data && userPaging.data.data
              ? renderUserPaging(userPaging.data.data)
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      {userPaging.data ? (
        <div className={classes.rootPagination}>
          <Pagination
            color="secondary"
            count={userPaging.data.totalPages}
            page={page}
            onChange={handleChange}
          />
        </div>
      ) : null}

      {/* Dialog */}

      <ManageDialog
        search={search}
        page={page}
        numberElementOfPage={numberElementOfPage}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleCloseDialog={handleCloseDialog}
        modal={modal}
        user={user}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}
