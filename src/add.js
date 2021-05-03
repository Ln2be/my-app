import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "./app-bar.css";
import axios from "axios";
import "./add.css";
import { BASE, auth } from "./constants";
import RTL from "./RTL";
import ReactDOM from "react-dom";

import { AppBarPan } from "./app-bar";
import Home from "./home";
import Posts from "./posts";
import Switch from "@material-ui/core/Switch";
import Resizer from "react-image-file-resizer";
import Theme from "./theme";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useHistory, useLocation } from "react-router-dom";

// Add Panel
export const AddPan = () => {
  const location = useLocation();
  let history = useHistory();

  var postI = location.state.id
    ? location.state
    : {
        kind: location.state.kind,
        lat: location.state.lat,
        lng: location.state.lng,
        description: "",
        tel: "",
        pass: "",
        price: "",
        images: [],
        occupied: false,
        cTel: "",
      };

  // var postI = post
  //   ? post
  //   : {
  //       kind: search.kind,
  //       lat: search.position.lat,
  //       lng: search.position.lng,
  //       description: "",
  //       tel: "",
  //       pass: "",
  //       price: "",
  //       images: [],
  //       occupied: false,
  //       cTel: "",
  //     };

  const [postF, setPostF] = useState({});
  const [uploding, setUploading] = useState(false);

  const [occupied, setOccupied] = useState(postI.occupied);

  useEffect(() => {
    setPostF(postI);
    // setOccupied(postI.occupied);
  }, []);

  const handleOccupiedChange = (event) => {
    setPostF({ ...postF, [event.target.name]: event.target.checked });
    setOccupied(event.target.checked);
  };

  function handleChange(event) {
    setPostF({ ...postF, [event.target.name]: event.target.value });
  }

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });
  async function handleFilesChange(event) {
    const files = Array.from(event.target.files).slice(0, 4);

    var ims = [];

    files.forEach(async (file) => {
      try {
        // const file = event.target.files[0];
        const image = await resizeFile(file);
        ims.push(image);
      } catch (err) {
        console.log(err);
      }
    });

    setPostF({ ...postF, images: ims });
  }

  function handleAddSubmit(event) {
    setUploading(true);
    var formData = new FormData();
    postF.images.forEach((im) => {
      formData.append("images", im);
    });

    Object.keys(postF).forEach((key) => {
      if (key !== "images") {
        formData.append(key, postF[key]);
      }
    });

    axios({
      method: "post",
      url: BASE + "/post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((response) => {
      const id = response.data.post.id;

      const location = {
        pathname: "/post",
        search: "&id=" + id,
      };

      history.push(location);
      // ReactDOM.render(
      //   <Posts endpoint="post" query={"?id=" + id} />,
      //   document.getElementById("root")
      // );
    });
    event.preventDefault();
  }

  const handleConcelSubmit = () => {
    history.push("/");
    // ReactDOM.render(<Home home={true} />, document.getElementById("root"));
  };

  const handleSaveSubmit = () => {
    var formData = new FormData();

    if (postF.images)
      postF.images.forEach((im) => {
        formData.append("images", im);
      });

    Object.keys(postF).forEach((key) => {
      if (key !== "images") {
        formData.append(key, postF[key]);
      }
    });

    axios({
      method: "post",
      url: BASE + "/update",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((response) => {
      const id = response.data.post.id;

      const location = {
        pathname: "/post",
        search: "&id=" + id,
      };

      history.push(location);

      // ReactDOM.render(
      //   <Posts endpoint="post" query={"?id=" + id} />,
      //   document.getElementById("root")
      // );
    });
  };

  // increase the font size
  const styles = {
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      width: 300,
      margin: 100,
    },
    //style for font size
    resize: {
      fontSize: 50,
    },
  };

  return !uploding ? (
    <RTL>
      {/* <ThemeProvider theme={theme}> */}
      <Theme>
        <div dir="rtl" className="rootAdd">
          <form noValidate autoComplete="off">
            <div className="form-container">
              {location.state.id ? null : (
                <h2 className="heading">اكمل الاعلان</h2>
              )}
              <TextField
                type="number"
                id="standard-basic"
                label="التفاصيل"
                multiline
                onChange={handleChange}
                name="description"
                defaultValue={postI.description}
                required={true}
                inputProps={{ style: { fontSize: 20 } }} // font size of input text
                InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
                // Style="width:100%"
              />
              <TextField
                id="standard-basic"
                type="number"
                label="السعر"
                onChange={handleChange}
                name="price"
                defaultValue={postI.price}
                inputProps={{ style: { fontSize: 20 } }} // font size of input text
                InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
              />

              <TextField
                id="standard-basic"
                label="الهاتف"
                onChange={handleChange}
                type="number"
                name="tel"
                defaultValue={postI.tel}
                inputProps={{ style: { fontSize: 20 } }} // font size of input text
                InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
              />

              {auth == "22118721" && (
                <TextField
                  id="standard-basic"
                  label="هاتف الزبون"
                  onChange={handleChange}
                  type="number"
                  name="cTel"
                  defaultValue={postI.cTel}
                  inputProps={{ style: { fontSize: 20 } }} // font size of input text
                  InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
                />
              )}

              <TextField
                id="standard-basic"
                label="كلمة السر"
                type="number"
                onChange={handleChange}
                name="pass"
                defaultValue={postI.pass}
                helperText="يمكنك من حذف اعلانك لاحقا او تعديله"
              />

              <input
                accept="image/*"
                className="file"
                id="icon-button-file"
                type="file"
                onChange={handleFilesChange}
                multiple
              />
              <label htmlFor="icon-button-file" className="t-margin">
                {postI.kind === "Offer Rent" || postI.kind === "Offer Sell" ? (
                  <div>
                    <Button
                      variant="contained"
                      // color="secondary"
                      component="span"
                    >
                      اضافة صور
                    </Button>
                    <div className="decr">5 صور على الاكثر</div>
                  </div>
                ) : null}
              </label>
              {postI.kind === "Offer Rent" ? (
                <div className="switcher">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={occupied}
                        onChange={handleOccupiedChange}
                        name="occupied"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    }
                    label="مشغول حاليا"
                  ></FormControlLabel>
                  <div className="decr">
                    يمكن تفعيلها اثناء فترة العقار مشغول
                  </div>
                </div>
              ) : null}
              {location.state.id ? (
                <div className="space-between">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleConcelSubmit}
                    className="t-margin"
                  >
                    الغاء
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleSaveSubmit}
                    className="t-margin"
                  >
                    حفط
                  </Button>
                </div>
              ) : (
                <div className="submitAdd">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSubmit}
                    className="t-margin"
                  >
                    ارسال
                  </Button>
                </div>
              )}

              {/* <div className="note">
                <Typography variant="body1">
                  <h2>تنبيه:</h2>
                  لا يرتب عقار انواكشوط العروض حسب الزمن و انما حسب قربها من
                  الموقع المحدد من قبل الزبون. تحذف العروض كما يلى :
                  <li>عروض الايجار تبقى دائما</li>
                  <li> عروض البيع تبقى لمدة سنة</li>
                  <li>طلبات الشراء لمدة سنة</li>
                  <li>طلبات الايجار لمدة شهر</li>
                </Typography>
              </div> */}
            </div>
          </form>
        </div>
      </Theme>
      {/* </ThemeProvider> */}
    </RTL>
  ) : (
    <div className="center-flex">
      {/* <CircularProgress color="secondary" /> */}
      بتم رفع الاعلان...
    </div>
  );
};

// add page
const Add = () => {
  return (
    <div>
      <AppBarPan />
      <AddPan />
    </div>
  );
};

export default Add;
