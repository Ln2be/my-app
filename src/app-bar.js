import React from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Home from "./home";
import RTL from "./RTL";
import Posts from "./posts";
import Theme from "./theme";
import Menu from "./menu";
import { useHistory } from "react-router-dom";

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

export function AppBarPan(props) {
  // routing
  let history = useHistory();

  const classes = useStyles();

  const handleNewsClick = () => {
    //
    // old before routing
    // ReactDOM.render(
    //   <Posts endpoint="news" query="?void=1" showRegionButton={true} />,
    //   document.getElementById("root")
    // );

    const location = {
      pathname: "/news",
      search: "news=news",
    };

    history.push(location);
  };

  const handleHomeClick = () => {
    // routing
    history.push("/");
    // ReactDOM.render(<Home />, document.getElementById("root"));
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

  const handleMenuClick = () => {
    history.push("/menu");
    // ReactDOM.render(<Menu />, document.getElementById("root"));
  };

  return (
    <Theme>
      <RTL>
        <div dir="rtl" className="rootA">
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <div className="iqar">عقار انواكشوط</div>
              {quickButton}
            </Toolbar>
          </AppBar>
        </div>
      </RTL>
    </Theme>
  );
}
