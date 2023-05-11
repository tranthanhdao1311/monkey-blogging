import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { db } from "../firebase/firebase-config";

const useRoleUser = () => {
  const [roleUserId, setRoleUserId] = useState("");
  const { userInfo } = useAuth();

  useEffect(() => {
    async function fetchUserInfo() {
      const docRefUserId = doc(db, "users", userInfo.uid);
      const getRefUserId = await getDoc(docRefUserId);
      setRoleUserId(getRefUserId.data().role);
    }
    fetchUserInfo();
  }, [userInfo.uid]);
  return {
    roleUserId,
  };
};

export default useRoleUser;
