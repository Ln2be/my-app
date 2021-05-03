import React, { useState } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { setAuth } from "./constants";
import Home from "./home";
import { AppBarPan } from "./app-bar";
import RTL from "./RTL";
import Theme from "./theme";
import { useHistory, useLocation } from "react-router-dom";

export function AuthPan() {
  // routing
  let history = useHistory();
  const [pass, setPass] = useState(null);

  function handleChange(event) {
    setPass(event.target.value);
  }

  function handleSubmitClick() {
    setAuth(pass);

    history.push("/");
    // ReactDOM.render(<Home />, document.getElementById("root"));
  }
  return (
    <RTL>
      <Theme>
        <div className="center-flex">
          <TextField
            label="الرقم السري"
            type="number"
            onChange={handleChange}
          ></TextField>
          <Button variant="outlined" onClick={handleSubmitClick}>
            ارسال
          </Button>
        </div>
      </Theme>
    </RTL>
  );
}

const Auth = () => {
  return (
    <div>
      <AppBarPan />
      <AuthPan />
    </div>
  );
};

export default Auth;
