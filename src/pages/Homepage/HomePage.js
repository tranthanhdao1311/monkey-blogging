import React from "react";
import AttentionPost from "../../components/AttentionPost/AttentionPost";

import Banner from "../../components/Banner/Banner";
import Featured from "../../components/FeaturedPosts/Featured";
import PostsNewest from "../../components/PostsNewest/PostsNewest";

const HomePage = () => {
  return (
    <>
      <Featured></Featured>
      <PostsNewest></PostsNewest>
      <AttentionPost></AttentionPost>
    </>
  );
};

export default HomePage;
