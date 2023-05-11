import React from "react";
import classNames from "classnames/bind";
import styles from "./MainLayout.module.scss";
import Header from "../Header/Header";
import Footer from "../../Footer/Footer";

const cx = classNames.bind(styles);
const MainLayout = ({ children }) => {
  return (
    <div className={cx("wrapper")}>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
