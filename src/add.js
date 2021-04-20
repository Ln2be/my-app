import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "./appBar.css";
import axios from "axios";
import "./add.css";
import { BASE } from "./constants";
import RTL from "./RTL";
import ReactDOM from "react-dom";
import { AppBarPan } from "./appBar";
import { SearchPan } from "./search";
import Feed from "./feed";
import Switch from "@material-ui/core/Switch";
import Resizer from "react-image-file-resizer";
import Theme from "./theme";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// Add Panel
export const AddPan = ({ search, post }) => {
  var postI = post
    ? post
    : {
        kind: search.kind,
        lat: search.position.lat,
        lng: search.position.lng,
        description: "",
        tel: "",
        pass: "",
        price: "",
        images: [],
        occupied: false,
      };

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
    console.log(event.target.checked);
    console.log(postF.occupied);
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
        // console.log(image);
      } catch (err) {
        console.log(err);
      }
    });

    setPostF({ ...postF, images: ims });
  }

  function handleAddSubmit(event) {
    setUploading(true);
    console.log(postF.images);
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
      url: BASE + "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((response) => {
      const id = response.data.post.id;
      ReactDOM.render(
        <div>
          <AppBarPan />
          <Feed endpoint="post" query={"?id=" + id}></Feed>
        </div>,
        document.getElementById("root")
      );
    });
    event.preventDefault();
  }

  const handleConcelSubmit = () => {
    ReactDOM.render(
      <div>
        <AppBarPan home={true} />
        <SearchPan />
      </div>,
      document.getElementById("root")
    );
  };

  const handleSaveSubmit = () => {
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
      url: BASE + "update",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((response) => {
      const id = response.data.post.id;
      ReactDOM.render(
        <div>
          <AppBarPan />
          <Feed endpoint="post" query={"?id=" + id}></Feed>
        </div>,
        document.getElementById("root")
      );
    });
  };

  return !uploding ? (
    <RTL>
      {/* <ThemeProvider theme={theme}> */}
      <Theme>
        <div dir="rtl" className="rootAdd">
          <form noValidate autoComplete="off">
            <div className="form-container">
              {post ? null : <h2 className="heading">اكمل الاعلان</h2>}
              <TextField
                type="number"
                id="standard-basic"
                label="مزيد من المعلومات"
                multiline
                onChange={handleChange}
                name="description"
                defaultValue={postI.description}
                // Style="width:100%"
              />
              <TextField
                id="standard-basic"
                type="number"
                label="السعر"
                onChange={handleChange}
                name="price"
                defaultValue={postI.price}
              />
              <TextField
                id="standard-basic"
                label="الهاتف"
                onChange={handleChange}
                type="number"
                name="tel"
                defaultValue={postI.tel}
              />

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
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  color="secondary"
                >
                  {postI.kind === "Offer Rent" ||
                  postI.kind === "Offer Sell" ? (
                    <div>
                      <Button
                        variant="contained"
                        // color="secondary"
                        component="span"
                        helperText="5 صور على الاكثر"
                      >
                        اضافة صور
                      </Button>
                      <div className="decr">5 صور على الاكثر</div>
                    </div>
                  ) : null}

                  {/* <PhotoCamera /> */}
                </IconButton>
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
              {post ? (
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

// resize the images and convert them to base64
async function resize(file) {
  // Create image and context
  var image = document.createElement("img");
  image.src = URL.createObjectURL(file);

  var canvas = document.createElement("canvas");

  var ctx = canvas.getContext("2d");

  // When image is loaded draw the canvas with image resized

  return await new Promise((resolve) => {
    image.addEventListener("load", (e) => {
      const imw = image.width;
      const imh = image.height;
      const nheigt = (imh / imw) * 140;

      canvas.width = imw;
      canvas.height = nheigt;

      if (ctx) ctx.drawImage(image, 0, 0, imw, nheigt);

      resolve(canvas.toDataURL());
    });
  });
}
