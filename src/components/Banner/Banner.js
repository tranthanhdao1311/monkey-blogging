import React from "react";
import images from "../../asset/image";
import Button from "../../button/Button";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Banner.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import parse from "html-react-parser";
import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import PostImage from "../PostImage/PostImage";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";

const cx = classNames.bind(styles);

const Banner = () => {
  SwiperCore.use([Autoplay]);

  const [postBanner, setPostBanner] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef,
      where("status", "==", 1),
      where("bannerPost", "==", true),
      limit(5)
    );
    onSnapshot(queries, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPostBanner(result);
    });
  }, []);

  return (
    <div className={cx("banner")}>
      <Swiper
        autoplay={{ delay: 4000 }}
        grabCursor={"true"}
        slidesPerView={"auto"}
        className={cx("swiper-custom")}
      >
        {postBanner.length > 0 ? (
          postBanner.map((item, index) => (
            <SwiperSlide key={index} className={cx("swipper-slide-custom")}>
              <Link to={item.slug} className={cx("overplay")}></Link>
              <PostImage
                url={item.image}
                to={item.slug}
                className={cx("img")}
              ></PostImage>
              <div className={cx("info")}>
                <Link to={item.slug} className={cx("tilte")}>
                  {item.title}
                </Link>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <Skeleton></Skeleton>
        )}
      </Swiper>
    </div>
  );
};

export default Banner;

export const Skeleton = () => {
  return (
    <>
      <LoadingSkeleton width="100%" height="520px"></LoadingSkeleton>
    </>
  );
};
