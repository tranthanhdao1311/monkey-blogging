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

const cx = classNames.bind(styles);

const banner = [
  {
    title: "Monkey blogging",
    img: "images.img2",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium magnam similique accusantium natus esse facilis! Quaerat voluptates possimus dolorem officiis pariatur, repellat, cupiditate porro, quidem molestiae impedit laudantium neque quo!",
  },
  {
    title: "Monkey blogging 2",
    img: "images.img2",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium magnam similique accusantium natus esse facilis! Quaerat voluptates possimus dolorem officiis pariatur, repellat, cupiditate porro, quidem molestiae impedit laudantium neque quo!",
  },
  {
    title: "Monkey blogging 3",
    img: "images.img2",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium magnam similique accusantium natus esse facilis! Quaerat voluptates possimus dolorem officiis pariatur, repellat, cupiditate porro, quidem molestiae impedit laudantium neque quo!",
  },
];

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
        {postBanner.length > 0 &&
          postBanner.map((item, index) => (
            <SwiperSlide key={index} className={cx("swipper-slide-custom")}>
              <Link to={item.slug} className={cx("overplay")}></Link>
              {/* <img className={cx("img")} src={item.image} alt="" /> */}
              <PostImage
                url={item.image}
                to={item.slug}
                className={cx("img")}
              ></PostImage>
              <div className={cx("info")}>
                <Link to={item.slug} className={cx("tilte")}>
                  {item.title}
                </Link>
                {/* <p className={cx("desc")}>{parse(item?.content || "")}</p> */}
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Banner;
