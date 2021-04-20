import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
// import "./appBar.css";
import { setAuth } from "./constants";
import { SearchPan } from "./search";
import { createMuiTheme } from "@material-ui/core/styles";
import RTL from "./RTL";
import MenuDrawer from "./drawer";
import Feed from "./feed";
import Theme from "./theme";
// import cairo from "./Cairo-SemiBold.ttf";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 0,
    marginLeft: 0,
  },
  title: {
    flexGrow: 1,
  },
}));

// const theme = createMuiTheme({
//   direction: "rtl", // Both here and <body dir="rtl">
// });

export function AuthPan() {
  const [pass, setPass] = useState(null);

  function handleChange(event) {
    setPass(event.target.value);
  }

  function handleSubmitClick() {
    setAuth(pass);
    ReactDOM.render(
      <div>
        <AppBarPan />
        <SearchPan />
      </div>,
      document.getElementById("root")
    );
  }
  return (
    <div>
      <TextField onChange={handleChange}></TextField>
      <Button variant="outlined" onClick={handleSubmitClick}>
        ارسال
      </Button>
    </div>
  );
}

export function AppBarPan(props) {
  const classes = useStyles();

  const handleNewsClick = () => {
    ReactDOM.render(
      <div>
        <AppBarPan></AppBarPan>
        <Feed endpoint="news" query="?void=1"></Feed>
      </div>,
      document.getElementById("root")
    );
  };

  const handleHomeClick = () => {
    ReactDOM.render(
      <div>
        <AppBarPan home={true} />
        <SearchPan />
      </div>,
      document.getElementById("root")
    );
  };

  const quickButton = props.home ? (
    <Button color="inherit" onClick={handleNewsClick}>
      الجديد
    </Button>
  ) : (
    <Button color="inherit" onClick={handleHomeClick}>
      الرئيسية
    </Button>
  );
  // Drawer here
  const [isDOpen, setIsDOpen] = useState(false);

  const handleToggleDrawer = () => {
    setIsDOpen(!isDOpen);
  };

  function handleAdminClick() {
    ReactDOM.render(<AuthPan />, document.getElementById("root"));
  }

  return (
    <Theme>
      <RTL>
        {/* <ThemeProvider theme={theme}> */}
        <div dir="rtl" className="rootA">
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon
                  className="menuIcon"
                  onClick={handleToggleDrawer}
                ></MenuIcon>
              </IconButton>
              {/* <Typography variant="h6" className={classes.title}>
                عقار انواكشوط
              </Typography> */}
              <div className="iqar">عقار انواكشوط</div>
              {quickButton}
            </Toolbar>
          </AppBar>
          <MenuDrawer
            open={isDOpen}
            onHideClick={handleToggleDrawer}
            onAdminClick={handleAdminClick}
          ></MenuDrawer>
        </div>
        {/* </ThemeProvider> */}
      </RTL>
    </Theme>
  );
}
