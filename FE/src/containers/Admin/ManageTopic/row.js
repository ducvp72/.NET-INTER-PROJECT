import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { Button } from "@material-ui/core";
import axios from "axios";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { actGetListTopic } from "./modules/action";
const Row = ({ topic }) => {
  const dispatch = useDispatch();
  const acceptTopic = async (topicID) => {
    try {
      const fetch = {
        method: "put",
        url: `http://group04lms.japaneast.azurecontainer.io/api/Topic/List/${topicID}`,
      };
      await axios(fetch);
      dispatch(actGetListTopic());
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
          {topic.topicID}
        </TableCell>
        <TableCell align="left" className="border-right">
          {topic.topicName}
        </TableCell>
        <TableCell align="left" className="border-right">
          {topic.topicDetail}
        </TableCell>
        <TableCell align="left" className="border-right">
          {topic.isOutDated.toString()}
        </TableCell>

        <TableCell align="center" className="border-right">
          <Button
            onClick={() => acceptTopic(topic.topicID)}
            color="secondary"
            variant="contained"
          >
            Hết hạn
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};
export default Row;
