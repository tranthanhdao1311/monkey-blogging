import React from "react";
import classNames from "classnames/bind";
import styles from "./AddBanner.module.scss";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";

const cx = classNames.bind(styles);

const AddBanner = () => {
  return (
    <div>
      <DashboardTitle title="New Banner" desc="Add new banner"></DashboardTitle>
    </div>
  );
};

export default AddBanner;
