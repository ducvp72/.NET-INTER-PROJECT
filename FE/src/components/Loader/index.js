import React from "react";
import { ScaleLoader } from "react-spinners";
import { Box } from "@material-ui/core";

function Loader(props) {
  const { loading } = props;

  return (
    <Box
      style={{
        display: "inline-block",
        zIndex: "100",

        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <ScaleLoader
        color="#f50057"
        loading={loading}
        height={45}
        width={5}
        radius={10}
        margin={4}
      />
    </Box>
  );
}

export default Loader;
