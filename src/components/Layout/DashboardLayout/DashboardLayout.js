import React from "react";
import classNames from "classnames/bind";
import styles from "./DashboardLayout.module.scss";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import SidebarDashboard from "../SidebarDashboard/SidebarDashboard";
import { useAuth } from "../../../context/auth-context";
import NotFoundPage from "../../../pages/NotFoundPage/NotFoundPage";
import { useState } from "react";
import { useToggleSideBar } from "../../../context/dashboard-context";

const cx = classNames.bind(styles);
const DashboardLayout = ({ children }) => {
  const { userInfo } = useAuth();

  const { show } = useToggleSideBar();

  if (!userInfo) return <NotFoundPage></NotFoundPage>;
  return (
    <div className={cx("wrapper")}>
      <DashboardHeader></DashboardHeader>
      <div className={cx("dashboard-main")}>
        {show && (
          <div className={cx("sidebar-mobile")}>
            <SidebarDashboard></SidebarDashboard>
          </div>
        )}
        <div className={cx("sidebar")}>
          <SidebarDashboard></SidebarDashboard>
        </div>
        <div className={cx("dashboard-children")}>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
