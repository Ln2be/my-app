import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import ReactDOM from "react-dom";
import { AppBarPan } from "./app-bar";
import Auth from "./auth";
import Theme from "./theme";
import RTL from "./RTL";
import Posts from "./posts";
import AboutUs from "./about-us";

import "./menu.css";
import { useHistory } from "react-router-dom";

const MenuPan = () => {
  let history = useHistory();

  const [id, setId] = useState(null);
  const [pass, setPass] = useState(null);

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handlePassChange = (event) => {
    setPass(event.target.value);
  };

  const handleIdSubmit = () => {
    const query = "id=" + id;

    // routing
    const location = {
      pathname: "/post",
      search: query,
    };

    history.push(location);

    // ReactDOM.render(
    //   <Posts endpoint={"post"} query={query} />,
    //   document.getElementById("root")
    // );
  };

  const handlePassSubmit = () => {
    const query = "pass=" + pass;

    // routing
    const location = {
      pathname: "/myPosts",
      search: query,
    };

    history.push(location);

    // ReactDOM.render(
    //   <Posts endpoint={"myPosts"} query={query} />,
    //   document.getElementById("root")
    // );
  };

  function handleAdminClick() {
    // routing
    history.push("/auth");

    // ReactDOM.render(<Auth />, document.getElementById("root"));
  }

  const handleAboutClick = () => {
    // routing
    history.push("/about");
    // ReactDOM.render(<AboutUs />, document.getElementById("root"));
  };

  return (
    <RTL>
      <Theme>
        <div className="dContent">
          <div className="idForm">
            <h3>ابحث عن اعلان معين:</h3>
            <TextField
              label="رقم الاعلان"
              type="number"
              onChange={handleIdChange}
            />
            <Button
              // variant="contained"
              color="primary"
              variant="outlined"
              onClick={handleIdSubmit}
              className="t-margin"
            >
              ارسال
            </Button>
          </div>
          <div className="passForm">
            <h3>تعديل اعلاناتي :</h3>
            <TextField
              label="كلمة السر"
              type="number"
              onChange={handlePassChange}
            />
            <Button
              // variant="contained"
              color="primary"
              variant="outlined"
              onClick={handlePassSubmit}
              className="t-margin"
            >
              ارسال
            </Button>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAboutClick}
            className="callUs"
          >
            اتصل بنا
          </Button>
        </div>
        <div className="admin" onClick={handleAdminClick}>
          Admin
        </div>
      </Theme>
    </RTL>
  );
};

const IMenu = () => {
  return (
    <div>
      <AppBarPan />
      <MenuPan />
    </div>
  );
};

export default IMenu;
