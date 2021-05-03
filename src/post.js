import Collapse from "@material-ui/core/Collapse";
import { Button } from "@material-ui/core";
import { useState } from "react";
import { KIND } from "./constants";
import NumberFormat from "react-number-format";
import ReactDOM from "react-dom";

import "./post.css";
import Home from "./home";
import { useHistory } from "react-router-dom";

const Post = ({
  post,
  admin,
  onEditClick,
  onDeleteClick,
  showRegionButton,
}) => {
  // routing
  let history = useHistory();

  const [expanded, setExpanded] = useState();

  const handleDeleteClick = () => {
    onDeleteClick(post);
  };

  const handleEditClick = () => {
    onEditClick(post);
  };

  // handle clicking region
  const handleRegionClick = () => {
    const opposite = {
      "Offer Rent": "Demand Rent",
      "Offer Sell": "Demand Buy",
      "Demand Rent": "Offer Rent",
      "Demand Buy": "Offer Sell",
    };
    const center = [post.lat, post.lng];
    const zoom = 16;
    const kind = opposite[post.kind];

    const location = {
      pathname: "/",
      state: {
        center: center,
        zoom: zoom,
        kind: kind,
      },
    };

    history.push(location);

    // ReactDOM.render(
    //   <Home center={center} zoom={zoom} kind={kind}></Home>,
    //   document.getElementById("root")
    // );
  };

  // show the region button
  const regionButton = showRegionButton ? (
    <div className="infoEl">
      <Button variant="contained" color="secondary" onClick={handleRegionClick}>
        المنطقة
      </Button>
    </div>
  ) : null;

  console.log(showRegionButton);

  const adminSection = admin ? (
    <div className="infoEl">
      <Button variant="outlined" color="secondary" onClick={handleDeleteClick}>
        حذف
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleEditClick}>
        تعديل
      </Button>
    </div>
  ) : null;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="post">
      {post.images && post.images.length > 0 ? (
        // <img src={IMAGEBASE + post.images[0]} alt="house" />
        <img src={post.images[0]} alt="house" />
      ) : null}
      <div className="postInformation">
        <div className="infoEl">
          <div> رقم الاعلان : {post.id}</div>
          <div>{KIND[post.kind]}</div>
        </div>
        <div className="text-center">{post.description}</div>
        <div className="infoEl">
          <div>
            السعر :
            <NumberFormat
              value={post.price}
              displayType={"text"}
              thousandSeparator={true}
              // prefix={"$"}
            />
          </div>
          <div>للاتصال : {post.tel}</div>
        </div>
        {regionButton}
        {admin && (
          <div className="infoEl">
            <div> هاتف الزبون : {post.cTel}</div>
          </div>
        )}
        {adminSection}
      </div>{" "}
      {post.images && post.images.length > 1 && (
        <Button color="secondary" onClick={handleExpandClick}>
          مزيد من الصور
        </Button>
      )}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {post.images
          ? post.images.map(function (im, i) {
              if (i > 0) return <img key={i} src={im} alt="house" />;
              else return null;
            })
          : null}
      </Collapse>
    </div>
  );
};

export default Post;
