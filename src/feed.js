import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BASE, auth } from "./constants";
import { Grid } from "@material-ui/core";
import { AddPan } from "./add";
import Post from "./post";
import axios from "axios";
import { AppBarPan } from "./appBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./feed.css";

// The feed
const Feed = ({ endpoint, query }) => {
  // The posts stored as state
  const [posts, setPosts] = useState([]);
  const [admin, setAdmin] = useState(false);

  const [loading, setLoading] = useState(true);

  // Admin actions
  const deleteP = (post) => {
    // delete the post from the backend
    console.log("deleting the post");
    axios
      .post(BASE + "delete", {
        kind: post.kind,
        id: post.id,
      })
      .then(function (response) {
        console.log(response);
        if (response.data.ok === 1) {
          // remove it from the posts
          const nPosts = posts.filter((value) => value.id !== post.id);
          setPosts(nPosts);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const editP = (post) => {
    console.log("editing the post");
    // send it to Add page
    ReactDOM.render(
      <div>
        <AppBarPan></AppBarPan>
        <AddPan post={post}></AddPan>
      </div>,
      document.getElementById("root")
    );
  };

  // convert the post data to Post views once ready
  const postsItems =
    posts && posts.length > 0 ? (
      posts.map((post, i) => (
        <Post
          key={i}
          post={post}
          admin={admin}
          onDeleteClick={deleteP}
          onEditClick={editP}
        />
      ))
    ) : (
      <div>لا توجد اعلانات</div>
    );

  // Get the authentification
  const authQ = "&auth=" + auth;
  const url = BASE + endpoint + query + authQ;

  // Get the posts from the api
  useEffect(() => {
    let mounted = true;
    // construct the url to search query

    const source = axios.CancelToken.source();

    async function getUser() {
      try {
        const result = await axios.get(url);
        // console.log(result);
        if (mounted) {
          setAdmin(result.data.admin);
          setPosts(result.data.posts);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getUser();

    return () => {
      mounted = false;
      source.cancel();
    };
  }, [url]);

  return loading ? (
    <div className="center-flex">
      <CircularProgress color="secondary" />
    </div>
  ) : (
    <Grid className="grid"> {postsItems} </Grid>
  );
};

export default Feed;
