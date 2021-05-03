import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BASE, auth } from "./constants";
import { Grid } from "@material-ui/core";
import Post from "./post";
import axios from "axios";
import { AppBarPan } from "./app-bar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Add from "./add";
import { Button } from "@material-ui/core";

import "./posts.css";
import { useHistory, useLocation } from "react-router-dom";

// The feed
const Feed = () =>
  // { endpoint, query, showRegionButton }
  {
    // routing section
    const location = useLocation();
    let history = useHistory();
    const showRegionButton = location.pathname === "/news";

    // The posts stored as state
    const [posts, setPosts] = useState([]);
    const [admin, setAdmin] = useState(false);

    const [loading, setLoading] = useState(true);

    // Admin actions
    const deleteP = (post) => {
      // delete the post from the backend
      console.log("deleting the post");
      axios
        .post(BASE + "/delete", {
          kind: post.kind,
          id: post.id,
        })
        .then(function (response) {
          console.log(response);
          if (response.data.ok === 1) {
            // remove it from the posts
            const nPosts = posts.filter((value) => value.id !== post.id);

            if (nPosts.length() === 0) history.push("/");
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
      const location = {
        pathname: "/add",
        state: post,
      };

      history.push(location);
      // ReactDOM.render(<Add post={post} />, document.getElementById("root"));
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
            // show the region button if asked
            showRegionButton={showRegionButton}
          />
        ))
      ) : (
        <div>لا توجد اعلانات</div>
      );

    // Get the authentification
    const authQ = "&auth=" + auth;
    // const url = BASE + endpoint + query + authQ;
    console.log(location.search);

    console.log(auth);
    // routing section
    const url = BASE + location.pathname + location.search + authQ;

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
            console.log(result.data.admin);
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

const Posts = () =>
  // { endpoint, query, showRegionButton }
  {
    return (
      <div>
        <AppBarPan />
        <Feed
        // endpoint={endpoint}
        // query={query}
        // showRegionButton={showRegionButton}
        />
      </div>
    );
  };

export default Posts;

// MiniPost

export const MiniPost = ({ id }) => {
  let history = useHistory();
  const [post, setPost] = useState({});
  const [admin, setAdmin] = useState(false);

  console.log("here minipost");
  const minifiedQ = "&minified=" + true;
  const url = BASE + "/post?id=" + id + minifiedQ;

  useEffect(() => {
    let mounted = true;
    // construct the url to search query

    const source = axios.CancelToken.source();

    async function getUser() {
      try {
        const result = await axios.get(url);
        // console.log(result);
        if (mounted) {
          const rpost = result.data.posts[0];
          setAdmin(result.data.admin);
          setPost(rpost);
          console.log(rpost);
          // setLoading(false);
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

  const handleMoreClick = () => {
    // new feature paging
    const location = {
      pathname: "/post",
      search: `&id=${id}`,
    };

    history.push(location);
  };

  const miniView = (
    <div className="postInformation">
      <div className="text-center">{post.description}</div>
      <div className="infoEl">
        <div>
          للاتصال : {admin && post.tel === "48692007" ? post.cTel : post.tel}
        </div>
        <Button variant="outlined" color="secondary" onClick={handleMoreClick}>
          المزيد
        </Button>
      </div>
    </div>
  );

  return post ? miniView : null;
};
