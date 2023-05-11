import React from "react";

import { DropdownProvider } from "./dropdown-context";

const Dropdown = ({
  children,
  // placeholder = "Please select an option",
  // setValue,
  // control,
  // name,
  ...props
}) => {
  return <DropdownProvider {...props}>{children}</DropdownProvider>;
};

export default Dropdown;
