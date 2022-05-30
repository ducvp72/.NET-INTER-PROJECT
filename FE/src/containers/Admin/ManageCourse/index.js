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
import axios from "axios";
import { Redirect } from "react-router";
import Swal from "sweetalert2";
import { actGetCoursePaging } from "./modules/action";
import ManageDialog from "../ManageCourse/ManageDialog";
import { DataGrid, GridRowsProp, GridColDef } from "@material-ui/data-grid";
import { Helmet } from "react-helmet";
import BackgroundImage from "../../../assets/fhqx-bg.jpg";

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

function ManageCourse(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const coursePaging = useSelector((state) => state.coursePagingReducer);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = React.useState(false);

  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [course, setCourse] = useState({});

  const [selectedImage, setSelectedImage] = useState(BackgroundImage);
  const [selectedFile, setSelectedFile] = useState(null);

  const [modal, setModal] = useState({
    title: "",
    button: "",
    id: "",
  });

  useEffect(() => {
    dispatch(actGetCoursePaging(page.toString(), numberElementOfPage));
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdate = (course) => {
    setModal({
      title: "Chỉnh Sửa Khóa Học",
      button: "Cập Nhật",
      id: "sua",
    });
    setCourse(course);
    setSelectedFile(null);
    setSelectedImage(
      `http://group04lms.japaneast.azurecontainer.io/api/Course/GetUrlFile/${course.courseID}`
    );
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setModal({
      title: "Thêm Khóa Học",
      button: "Thêm",
      id: "them",
    });
    setCourse({});
    setSelectedFile(null);
    setSelectedImage(BackgroundImage);
    setOpenDialog(true);
  };

  //Pagination
  const handleChange = (event, value) => {
    event.preventDefault();
    setPage(value);
    {
      search === ""
        ? dispatch(actGetCoursePaging(value.toString(), numberElementOfPage))
        : dispatch(actGetCoursePaging(value.toString(), numberElementOfPage));
    }
  };

  // search box
  const handleOnChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // find course
  const handleOnClickSearch = () => {
    setPage(1);
    {
      search.trim() === ""
        ? dispatch(actGetCoursePaging("1", numberElementOfPage))
        : dispatch(actGetCoursePaging("1", numberElementOfPage, search));
    }
  };
  const handleOnKeyPress = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      setPage(1);
      {
        search.trim() === ""
          ? dispatch(actGetCoursePaging("1", numberElementOfPage))
          : dispatch(actGetCoursePaging("1", numberElementOfPage, search));
      }
    }
  };

  const deleteCourse = (courseId) => {
    Swal.fire({
      icon: "question",
      title: "Xóa khóa học",
      text: "Bạn có thật sự muốn xóa khóa học này ?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((swalRes) => {
      if (swalRes.isConfirmed) {
        axios({
          url: `http://group04lms.japaneast.azurecontainer.io/api/Course/Delete/${courseId}`,
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
                    actGetCoursePaging(page.toString(), numberElementOfPage)
                  )
                : dispatch(
                    actGetCoursePaging(
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

  const renderCoursePaging = (data) => {
    return data.map((course, index) => {
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row" className={classes.tableCell}>
            {course.courseID}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {course.courseName}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {course.courseDetail}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            {course.courseDuration}
          </TableCell>
          <TableCell align="left" className={classes.tableCell}>
            <img
              alt="course"
              src={`http://group04lms.japaneast.azurecontainer.io/api/Course/GetUrlFile/${course.courseID}`}
              style={{
                width: "100px",
                height: "100px",
              }}
            />
          </TableCell>
          <TableCell align="center">
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={() => handleUpdate(course)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="secondary"
              onClick={() => deleteCourse(course.courseID)}
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
        <title>Quản lý khóa học</title>
        <meta
          charSet="utf-8"
          name="description"
          content="Trang quản lý khóa học"
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
              placeholder="Tìm kiếm khóa học"
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
                Mã khóa học
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Tên khóa học
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Mô tả
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Thời hạn
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                Hình ảnh
              </TableCell>
              <TableCell align="center">Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coursePaging.data && coursePaging.data.data
              ? renderCoursePaging(coursePaging.data.data)
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {coursePaging.data ? (
        <div className={classes.rootPagination}>
          <Pagination
            color="secondary"
            count={coursePaging.data.totalPages}
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
        course={course}
        selectedFile={selectedFile}
        selectedImage={selectedImage}
        setSelectedFile={setSelectedFile}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
}

export default ManageCourse;
