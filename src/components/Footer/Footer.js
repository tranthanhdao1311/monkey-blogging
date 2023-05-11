import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useState } from "react";
import { Link } from "react-router-dom";
import images from "../../asset/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faE, faEnvelope, faV } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faFacebookF,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
const cx = classNames.bind(styles);

const Footer = () => {
  const [cate, setCate] = useState([]);
  const arrCate1 = cate.slice(0, 6);
  const arrCate2 = cate.slice(6, 13);
  const arrCate3 = cate.slice(13, 20);
  const arrCate4 = cate.slice(20);
  useEffect(() => {
    const colRef = collection(db, "categories");
    const q = query(
      colRef,
      where("status", "==", 1),
      where("parentCategory", "==", null)
    );
    onSnapshot(q, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCate(result);
    });
  }, []);

  return (
    <div className={cx("container")}>
      <div className={cx("content-top")}>
        <div className={cx("category")}>
          <ul className={cx("cate-list1")}>
            <li className={cx("cate-item")}>
              <Link to="/">Trang chủ</Link>
            </li>
            {arrCate1.length > 0 &&
              arrCate1.map((item) => (
                <li className={cx("cate-item")} key={item.id}>
                  <Link to={`${item.slug}`}>{item.name}</Link>
                </li>
              ))}
          </ul>
          <ul className={cx("cate-list")}>
            {arrCate2.length > 0 &&
              arrCate2.map((item) => (
                <li className={cx("cate-item")} key={item.id}>
                  <Link to={`${item.slug}`}>{item.name}</Link>
                </li>
              ))}
          </ul>
          <ul className={cx("cate-list")}>
            {arrCate3.length > 0 &&
              arrCate3.map((item) => (
                <li className={cx("cate-item")} key={item.id}>
                  <Link to={`${item.slug}`}>{item.name}</Link>
                </li>
              ))}
          </ul>
          <ul className={cx("cate-list")}>
            {arrCate4.length > 0 &&
              arrCate4.map((item) => (
                <li className={cx("cate-item")} key={item.id}>
                  <Link to={`/category/${item.slug}`}>{item.name}</Link>
                </li>
              ))}
          </ul>
        </div>
        <div className={cx("info-web")}>
          <div className={cx("download-app")}>
            <p className={cx("info-title")}>Tải ứng dụng</p>
            <button className={cx("btn-download")}>
              <img src={images.logo} alt="" />
              <p>Monkey Blogging</p>
            </button>
          </div>
          <div className={cx("contact")}>
            <p className={cx("info-title")}>Liên hệ</p>
            <div className={cx("email")}>
              <FontAwesomeIcon
                className={cx("icon")}
                icon={faEnvelope}
              ></FontAwesomeIcon>{" "}
              Tòa soạn
            </div>
            <div className={cx("ads")}>
              <FontAwesomeIcon
                className={cx("icon")}
                icon={faE}
              ></FontAwesomeIcon>{" "}
              Quảng cáo
            </div>
            <div className={cx("vlight")}>
              <FontAwesomeIcon
                className={cx("icon")}
                icon={faV}
              ></FontAwesomeIcon>{" "}
              Hợp tác bản quyền
            </div>
          </div>
          <div className={cx("hotline")}>
            <p className={cx("info-title")}>Đường dây nóng</p>
            <div className={cx("info-hotline")}>
              <div>
                <p className={cx("phone")}>077.707.0400</p>
                <p className={cx("location")}>(TP. Hồ Chí Minh)</p>
              </div>
              <div>
                <p className={cx("phone")}>093.335.3653</p>
                <p className={cx("location")}>(Hà Nội)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx("content-middle")}>
        <div className={"content-middle-left"}>
          <p>Báo điện tử</p>
        </div>
        <div className={"content-middle-right"}>
          <div className={cx("middle-flex")}>
            <p>Theo dõi MonkeyBlogging trên</p>
            <FontAwesomeIcon
              className={cx("icon-social", "fb")}
              icon={faFacebookF}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              className={cx("icon-social", "twitter")}
              icon={faTwitter}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              className={cx("icon-social", "youtube")}
              icon={faYoutube}
            ></FontAwesomeIcon>
          </div>
        </div>
      </div>
      <div className={cx("content-bot")}>
        <div>
          <strong>Báo tiếng Việt nhiều người xem nhất</strong>
          <p>Thuộc Bộ Khoa học Công nghệ</p>
          <p>Số giấy phép: 548/GP-BTTTT ngày 24/08/2021</p>
        </div>
        <div>
          <p>Tổng biên tập: Thành Đạo</p>
          <p>Địa chỉ: 3 Đề Thám, Phường Cô Giang, Quận 1, TP. Hồ Chí Minh</p>
          <p>Điện thoại: 0777 070 400</p>
        </div>
        <div>
          <p>© 1997-2023. Toàn bộ bản quyền thuộc VnExpress</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
