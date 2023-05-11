import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Checkbox.module.scss";
import { useController } from "react-hook-form";

const cx = classNames.bind(styles);

const Checkbox = ({ control, setValue, checked, ...props }) => {
  const { field } = useController({
    control,
    name: props.name,
    checked: checked,
  });

  const [toggleCheckbox, setToggleCheckbox] = useState(false);
  const handleChangeCheckBox = () => {
    setValue("FeaturePost", !checked);
  };
  useEffect(() => {
    setValue(props.name, toggleCheckbox);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleCheckbox]);
  return (
    <label>
      <input
        type="checkbox"
        className={cx("hidden")}
        onClick={handleChangeCheckBox}
        onChange={() => {}}
        {...field}
        {...props}
      />
      <div
        className={cx("custom-checkbox", `${toggleCheckbox ? "active" : ""}`)}
      >
        <span
          className={cx("spinner", `${toggleCheckbox ? "active" : ""}`)}
        ></span>
      </div>
    </label>
  );
};

export default Checkbox;
