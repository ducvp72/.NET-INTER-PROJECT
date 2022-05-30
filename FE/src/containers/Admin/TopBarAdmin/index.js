import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Avatar, Grid, useMediaQuery } from "@material-ui/core";
import uteLogo from "../../../assets/ute_flower.jpg";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    boxShadow: "none",
  },
  logo: {
    height: "50px",
    width: "50px",
    cursor: "pointer",
  },
  menuButton: {},
  title: {
    flexGrow: 1,
  },
  offset: theme.mixins.toolbar,
}));

export default function TopBarAdmin({ openDrawer, setOpenDrawer }) {
  const classes = useStyles();

  const history = useHistory();

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Grid container>
            <Grid item xs={6}>
              <Avatar
                src={uteLogo}
                alt="logo"
                className={classes.logo}
                onClick={() => {
                  history.push("/home");
                }}
              />
            </Grid>
            {isMatch ? (
              <Grid container justify="flex-end" item xs={6}>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  onClick={() => setOpenDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            ) : null}
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.offset}></Toolbar>
    </div>
  );
}
