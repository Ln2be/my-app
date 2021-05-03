import ReactDOM from "react-dom";
import Home from "./home";

import "./posts.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AboutUs from "./about-us";
import Add from "./add";
import { Menu } from "@material-ui/core";
import Posts from "./posts";

import AuthExample from "./Test";

// ReactDOM.render(<Home />, document.getElementById("root"));
const rootElement = document.getElementById("root");

ReactDOM.render(<AuthExample />, rootElement);
