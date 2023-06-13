import React from "react";
import classNames from "classnames/bind";
import styles from "./MainLayout.module.scss";
import Header from "../Header/Header";
import Footer from "../../Footer/Footer";
import { useToggleSideBar } from "../../../context/dashboard-context";

const cx = classNames.bind(styles);
const MainLayout = ({ children }) => {
  const { show } = useToggleSideBar();
  return (
    <div style={{ position: "relative" }}>
      <div className={cx("wrapper")}>
        <Header></Header>
        {children}
        <Footer></Footer>
      </div>
      {show && <div className={cx("overlay")}></div>}
    </div>
  );
};

export default MainLayout;
