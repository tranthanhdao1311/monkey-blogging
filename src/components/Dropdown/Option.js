import React from "react";
import { useDropdown } from "./dropdown-context";

const Option = ({ children, ...props }) => {
  const { onClick } = props;
  const { setShow } = useDropdown();

  const handleClick = () => {
    onClick && onClick();
    setShow(false);
  };
  return (
    <div onClick={handleClick} className={props.className}>
      {children}
    </div>
  );
};

export default Option;
