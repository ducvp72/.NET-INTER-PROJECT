import { Container, Grid, Link } from '@material-ui/core'
import React from 'react'
import Logo from '../../assets/logo.png'
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  grid: {
    marginTop: "30px",
  },
  root: {
    boxShadow: "0 0 10px rgb(0 0 0 / 30%)"
  },
  linkList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  link: {
    color: "#0e1e40",
    marginTop: "15px"
  },
  copyright: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0e1e40",
    color: "#fff"
  },
  info: {
    display: "flex",
    alignItems: "center",
    "&:nth-of-type(1)": {
      marginBottom: "5px"
    }
  },
  icon: {
    marginRight: "5px"
  },
  ["@media (max-width: 1023px)"]: {
    linkList: {
      justifyContent: "center",
      alignItems: "center"
    }
  },
  ["@media (max-width: 767px)"]: {
    grid: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    },
    linkList: {
      alignItems: "center"
    },
    infoList: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    },
    info: {
      marginTop: "10px",
      marginBottom: 0
    },
    desc: {
      textAlign: "center"
    }
  }
}))
export default function Footer() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
      <Container>
        <Grid container spacing={3} className={classes.grid}>
          <Grid item xs={12} sm={3} className={classes.infoList}>
            <img src={Logo} />
            <div className={classes.info}>
              <PhoneIcon className={classes.icon} />
              <span>0123456789</span>
            </div>
            <div className={classes.info}>
              <EmailIcon className={classes.icon} />
              <span>group04lms@gmail.com</span>
            </div>
          </Grid>
          <Grid item xs={12} sm={3} className={classes.linkList}>
            <Link className={classes.link} underline="none" href='#'>KHOÁ HỌC</Link>
            <Link className={classes.link} underline="none" href='#'>BLOG</Link>
            <Link className={classes.link} underline="none" href='#'>LIÊN HỆ</Link>
            <Link className={classes.link} underline="none" href='#'>VỀ CHÚNG TÔI</Link>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.desc}>
            <h2>GROUP 04 LMS</h2>
            <p>Nền tảng học trực tuyến trong thời kỳ COVID-19</p>
            <p>Mang tri thức đẩy lùi dịch bệnh</p>
            <p>Địa chỉ: 1 Võ Văn Ngân, phường Linh Chiểu, TP Thủ Đức, TPHCM</p>
          </Grid>
        </Grid>
      </Container>
      <div className={classes.copyright}>
        <p>Copyright Group 04 LMS © 2021</p>
      </div>
      </div>
    </>
  )
}

