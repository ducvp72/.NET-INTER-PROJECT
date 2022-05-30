import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { Button } from "@material-ui/core";
import axios from "axios";
import { useDispatch } from "react-redux";
import { actGetListNotify } from "./modules/action";
import Swal from "sweetalert2";
const Row = ({ notify }) => {
  const dispatch = useDispatch();
  const acceptNotify = async (notifyID) => {
    try {
      const fetch = {
        method: "put",
        url: `http://group04lms.japaneast.azurecontainer.io/api/Notification/AllNotifyAdmin/${notifyID}`,
      };
      await axios(fetch);
      dispatch(actGetListNotify());
      Swal.fire({
        icon: "success",
        title: "Duyệt thành công",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <TableRow hover style={{ transform: "scale(1)" }}>
        <TableCell align="left" className="border-right">
          {notify.notifyID}
        </TableCell>
        <TableCell align="left" className="border-right">
          {notify.notifyName}
        </TableCell>
        <TableCell align="left" className="border-right">
          {notify.notifyDetail}
        </TableCell>
        <TableCell align="left" className="border-right">
          {notify.isConfirmed.toString()}
        </TableCell>

        <TableCell align="center" className="border-right">
          <Button
            onClick={() => acceptNotify(notify.notifyID)}
            color="secondary"
            variant="contained"
          >
            Duyệt
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};
export default Row;
