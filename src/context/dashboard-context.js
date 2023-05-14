import { createContext, useContext, useState } from "react";

const ToggleSideBar = createContext();

function ToggleSideBarProvider(props) {
  const [show, setShow] = useState(false);
  const values = { show, setShow };

  return (
    <ToggleSideBar.Provider value={values} {...props}></ToggleSideBar.Provider>
  );
}

function useToggleSideBar() {
  const context = useContext(ToggleSideBar);
  return context;
}

export { ToggleSideBarProvider, useToggleSideBar };
