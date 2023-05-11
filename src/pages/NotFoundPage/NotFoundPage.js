import React from "react";
import classNames from "classnames/bind";
import styles from "./NotFoundPage.module.scss";
import images from "../../asset/image";
import Button from "../../button/Button";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
const NotFoundPage = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <img className={cx("img")} src={images.notFound} alt="" />
        <h1 className={cx("title")}>404 - Looks like you're lost.</h1>
        <p className={cx("desc")}>
          Maybe this page used to exist or you just spelled something wrong.
          Chances are your spelled something wrong, so can you double check the
          URL?
        </p>
        <Link to="/">
          <Button type="button" className={cx("style-btn")}>
            Go back
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
