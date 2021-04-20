import axios from "axios";
import { useEffect, useState } from "react";
import ReactDom from "react-dom";
import React, { Component } from "react";
import Resizer from "react-image-file-resizer";

export const UpImage = () => {
  var images = [];

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

  const handleChange = async (event) => {
    // images = Array.from(event.target.files);
    // console.log(images);

    try {
      const file = event.target.files[0];
      const image = await resizeFile(file);
      images.push(image);
      // console.log(image);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    console.log(images);
    var formData = new FormData();
    images.forEach((im) => {
      formData.append("images", im);
    });

    axios({
      method: "post",
      url: "http://localhost:3000/postO",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => {
      const src = "http://localhost/images/" + res.data;
      ReactDom.render(
        <img src={src} alt="h"></img>,
        document.getElementById("root")
      );
    });
  };
  return (
    <div>
      <input type="file" multiple onChange={handleChange} />
      <input type="button" value="submit" onClick={handleSubmit} />
    </div>
  );
};

// export default UpImage;

const App = () => {
  // constructor(props) {
  //   super(props);
  //   this.fileChangedHandler = this.fileChangedHandler.bind(this);
  //   this.state = {
  //     newImage: "",
  //   };
  // }

  const [newImage, setNewImage] = useState("");

  const fileChangedHandler = (event) => {
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log(uri);
            // this.setState({ newImage: uri });
            setNewImage(uri);
          },
          "base64",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="App">
      <input type="file" onChange={fileChangedHandler} />
      <img src={newImage} alt="" />
    </div>
  );
};

export default App;
