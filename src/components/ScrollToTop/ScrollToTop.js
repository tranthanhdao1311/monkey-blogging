import React, { useState } from "react";
import styles from "./ScrollToTop.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUps } from "@fortawesome/free-brands-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  const scrollBtn = () => {
    const scrollY = document.documentElement.scrollTop;
    if (scrollY > 300) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  window.addEventListener("scroll", scrollBtn);
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      {show && (
        <div className={cx("box")} onClick={() => handleScrollToTop()}>
          <FontAwesomeIcon
            className={cx("icon-box")}
            icon={faArrowUp}
          ></FontAwesomeIcon>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
