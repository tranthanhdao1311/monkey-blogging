import React from "react";
import classNames from "classnames/bind";
import styles from "./UserItem.module.scss";
import LabelStatus from "../label/LabelStatus";
import { statusAddPost, statusRoleUser } from "../../configStatus";
import ActionEdit from "../Action/ActionEdit";
import ActionDelete from "../Action/ActionDelete";
import { useNavigate } from "react-router-dom";
import images from "../../asset/image";
import { deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { db } from "../../firebase/firebase-config";

const cx = classNames.bind(styles);

const UserItem = ({ data }) => {
  const navigate = useNavigate();
  const handleUpdateUser = (id) => {
    navigate(`/manage/update-user?id=${id}`);
  };
  const date = new Date(data.createdAt?.seconds * 1000);
  const time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  const handleDelete = (item) => {
    const docRefDel = doc(db, "users", item);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(docRefDel);
        Swal.fire(
          "Deleted!",
          `Delete category ${data.name} successfully!`,
          "success"
        );
      }
    });
  };
  return (
    <>
      <tr key={data.id}>
        <td
          title={data.id}
          style={{
            fontSize: "16px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "13ch",
          }}
        >
          {data.id}
        </td>
        <td className={cx("padding-right")}>
          <div className={cx("post-item")}>
            <img
              src={data.image ? data.image : images.logo}
              alt=""
              className={cx("post-img")}
            />
            <div className={cx("info-post")}>
              <h3 className={cx("post-title")}>{data.fullname}</h3>
              <time>
                Thời gian tạo: {time}, {formatDate}
              </time>
            </div>
          </div>
        </td>
        <td title={data.username} className={cx("user")}>
          {data.username}
        </td>
        <td title={data.email} className={cx("email")}>
          {data.email}
        </td>
        <td>
          {data.status === statusAddPost.APPROVED && (
            <LabelStatus type="success">Duyệt</LabelStatus>
          )}
          {data.status === statusAddPost.PENDING && (
            <LabelStatus type="warning">Đang duyệt</LabelStatus>
          )}
          {data.status === statusAddPost.REJECT && (
            <LabelStatus type="danger">Từ chối</LabelStatus>
          )}
        </td>
        <td>
          {data.role === statusRoleUser.ADMIN && <span>Admin</span>}
          {data.role === statusRoleUser.MODERATOR && <span>Moderator</span>}
          {data.role === statusRoleUser.USER && <span>User</span>}
        </td>
        <td>
          <div className={cx("actions")}>
            <ActionEdit
              onClick={() => {
                handleUpdateUser(data.id);
              }}
            ></ActionEdit>
            <ActionDelete onClick={() => handleDelete(data.id)}></ActionDelete>
          </div>
        </td>
      </tr>
    </>
  );
};

export default UserItem;
