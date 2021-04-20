import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import "./drawer.css";
import Feed from "./feed";
import ReactDOM from "react-dom";
import { AppBarPan } from "./appBar";
import Help from "./help";

const MenuDrawer = (props) => {
  const [id, setId] = useState(null);
  const [pass, setPass] = useState(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(props.open);
    setOpen(props.open);
  }, [props.open]);

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handlePassChange = (event) => {
    setPass(event.target.value);
  };

  const handleIdSubmit = () => {
    setOpen(false);
    props.onHideClick();
    const query = "?id=" + id;
    ReactDOM.render(
      <div>
        <AppBarPan />
        <Feed endpoint={"post"} query={query}></Feed>
      </div>,
      document.getElementById("root")
    );
  };

  const handlePassSubmit = () => {
    setOpen(false);
    props.onHideClick();
    const query = "?pass=" + pass;
    ReactDOM.render(
      <div>
        <AppBarPan />
        <Feed endpoint={"myPosts"} query={query}></Feed>,
      </div>,
      document.getElementById("root")
    );
  };

  const handleHideClick = () => {
    setOpen(false);
    props.onHideClick();
  };

  const handleAboutSubmit = () => {
    setOpen(false);
    ReactDOM.render(
      <div>
        <AppBarPan />
        <Help></Help>
      </div>,
      document.getElementById("root")
    );
  };

  // drawer content
  const drawerContent = (
    <div>
      <div className="dContent">
        <Button
          className="hideB"
          variant="contained"
          // color="primary"
          onClick={handleHideClick}
        >
          اخفاء
        </Button>
        <div className="idForm">
          <h3>ابحث عن اعلان معين:</h3>
          <TextField label="رقم الاعلان" onChange={handleIdChange} />
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
          <TextField label="كلمة السر" onChange={handlePassChange} />
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
          onClick={handleAboutSubmit}
          className="callUs"
        >
          اتصل بنا
        </Button>
      </div>
      <div className="admin" onClick={props.onAdminClick}>
        Admin
      </div>
    </div>
  );

  return (
    <Drawer
      // container={container}
      variant="temporary"
      anchor={"left"}
      open={open}
      // onClose={handleDrawerToggle}
      // ModalProps={{
      //   keepMounted: true, // Better open performance on mobile.
      // }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default MenuDrawer;
