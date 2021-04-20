import Collapse from "@material-ui/core/Collapse";
import { Button } from "@material-ui/core";
import { useState } from "react";
import "./post.css";
import { KIND } from "./constants";

const Post = ({ post, admin, onEditClick, onDeleteClick }) => {
  const [expanded, setExpanded] = useState();

  const handleDeleteClick = () => {
    onDeleteClick(post);
  };

  const handleEditClick = () => {
    onEditClick(post);
  };

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

  const AltImage = () => {
    const file = post.kind + ".png";
    return <img src={file} alt="house" />;
  };

  return (
    <div className="post">
      {
        post.images && post.images.length > 0 ? (
          // <img src={IMAGEBASE + post.images[0]} alt="house" />
          <img src={post.images[0]} alt="house" />
        ) : null
        // <AltImage></AltImage>
      }
      <div className="postInformation">
        <div className="infoEl">
          <div> رقم الاعلان : {post.id}</div>
          <div>{KIND[post.kind]}</div>
        </div>
        <div className="text-center">{post.description}</div>
        <div className="infoEl">
          <div>السعر : {post.price}</div>
          <div>للاتصال : {post.tel}</div>
        </div>
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
