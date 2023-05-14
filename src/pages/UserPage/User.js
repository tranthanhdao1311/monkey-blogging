import React from "react";
import Button from "../../button/Button";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import classNames from "classnames/bind";
import styles from "./User.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useState } from "react";
import UserItem from "../../components/UserItem/UserItem";
import { CATEGORY_PER_PAGE, statusRoleUser } from "../../configStatus";
import useRoleUser from "../../hook/useRoleUser";
import Swal from "sweetalert2";

const cx = classNames.bind(styles);

const User = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/manage/add-user");
  };
  const [users, setUsers] = useState([]);
  const currentItem = users.length;

  const [lastDoc, setLastDoc] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "users");
      const q = query(colRef, limit(CATEGORY_PER_PAGE));
      const documentSnapshots = await getDocs(q);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });
      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setUsers(results);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, []);

  const handleLoadmoreCategory = async () => {
    const nextRef = query(
      collection(db, "users"),
      startAfter(lastDoc),
      limit(CATEGORY_PER_PAGE)
    );

    onSnapshot(nextRef, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUsers([...users, ...result]);
    });
    const documentSnapshots = await getDocs(nextRef);

    // Get the last visible document
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    setLastDoc(lastVisible);
  };

  const { roleUserId } = useRoleUser();
  if (roleUserId !== statusRoleUser.ADMIN) return null;

  return (
    <>
      <div className={cx("heading")}>
        <DashboardTitle
          title="Tất cả người dùng"
          desc="Trang quản lý người dùng"
        ></DashboardTitle>
        <Button
          className={cx("btn-create")}
          type="button"
          onClick={handleClick}
        >
          Thêm người dùng
        </Button>
      </div>
      <div className={cx("table-posts")}>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Thông tin</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Quyền hạn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserItem data={user} key={user.id}></UserItem>
            ))}
          </tbody>
        </table>
      </div>

      <div className={cx("table-posts-mobile")}>
        {users.map((user) => (
          <UserItem data={user} key={user.id}></UserItem>
        ))}
      </div>
      <div className={cx("info-pagination")}>
        {currentItem} trên {total} danh mục
      </div>
      {total > currentItem && (
        <div className={cx("load-more")}>
          <Button
            onClick={handleLoadmoreCategory}
            className={cx("btn-load-more")}
            type="button"
          >
            Xem thêm
          </Button>
        </div>
      )}
    </>
  );
};

export default User;
