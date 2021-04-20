import ReactDOM from "react-dom";
import { AppBarPan } from "./appBar";
import { SearchPan } from "./search";
import Post from "./post";
import Feed from "./feed";
import { UpImage } from "./Test";
import { AddPan } from "./add";
import "./feed.css";

ReactDOM.render(
  <div className="root">
    <AppBarPan home={true} />
    <SearchPan />
    {/* <AddPan></AddPan> */}
    {/* <UpImage></UpImage> */}
  </div>,
  document.getElementById("root")
);
