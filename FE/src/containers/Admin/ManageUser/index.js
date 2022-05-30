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
      title: "Chỉnh Sửa Người Dùng",
      button: "Cập Nhật",
      id: "sua",
    });
    setUser(user);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedDate(new Date("08/29/2000"));
    setModal({
      title: "Thêm Người Dùng",
      button: "Thêm",
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
      title: "Xóa tài khoản",
      text: "Bạn có thật sự muốn xóa tài khoản này ?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((swalRes) => {
      if (swalRes.isConfirmed) {
        axios({
          url: `http://group04lms.japaneast.azurecontainer.io/api/User/DeleteUser/${userId}`,
          method: "DELETE",
        })
          .then((result) => {
            Swal.fire({
              icon: "success",
              title: "Xóa thành công",
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
          roleTemp = "Học viên";
          break;
        }
        case "teacher": {
          roleTemp = "Giáo viên";
          break;
        }
        case "instructor": {
          roleTemp = "Trợ giảng";
          break;
        }
        case "mentor": {
          roleTemp = "Hỗ trợ lớp";
          break;
        }
        case "classAdmin": {
          roleTemp = "Admin lớp";
          break;
        }
        case "admin": {
          roleTemp = "Quản trị viên";
          break;
        }
        default: {
          roleTemp = "Chưa xác nhận";
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
          genderTemp = "Nữ";
          break;
        }
        case "khac": {
          genderTemp = "Khác";
          break;
        }
        default: {
          genderTemp = "Không xác định";
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
                      title: "Người dùng chưa xác nhận tài khoản",
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
        <title>Quản lý người dùng</title>
        <meta
          charSet="utf-8"
          name="description"
          content="Trang quản lý người dùng"
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
            Thêm
          </Button>
        </Grid>
        <Grid className={classes.searchForm} container item xs={12}>
          <Paper elevation={1} component="form" className={classes.paper}>
            <InputBase
              placeholder="Tìm kiếm người dùng"
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
                Tên tài khoản
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Họ tên
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Email
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Số điện thoại
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                DOB
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Giới tính
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Loại người dùng
              </TableCell>
              <TableCell align="center">Chức năng</TableCell>
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
