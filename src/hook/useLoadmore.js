import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CATEGORY_PER_PAGE } from "../configStatus";
import { db } from "../firebase/firebase-config";

const useLoadmore = (doc) => {
  const [lastDoc, setLastDoc] = useState("");

  const nextRef = query(
    collection(db, "posts"),
    startAfter(lastDoc),
    limit(CATEGORY_PER_PAGE)
  );
  const documentSnapshots = getDocs(doc);

  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

  return {
    lastDoc,
    setLastDoc,
    nextRef,
    lastVisible,
  };
};

export default useLoadmore;
