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
import ActionView from "../Action/ActionView";

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
      <tr className={cx("table-desktop")} key={data.id}>
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

      {/* mobile */}
      <div className={cx("table-mobile")}>
        <div className={cx("user-mobile-top")}>
          <span>{data.id}</span>
          <span>{time + ", " + formatDate}</span>
        </div>
        <div className={cx("user-mobile-middle")}>
          <img
            className={cx("user-mobile-middle-img")}
            src={data.image}
            alt=""
          />
          <p className={cx("user-mobile-middle-title")}>{data.username}</p>
        </div>
        <div className={cx("user-mobile-bot")}>
          <table className={cx("user-mobile-bot-table")}>
            <tr className={cx("user-mobile-bot-table-tr")}>
              <td style={{ fontWeight: "600" }}>Email</td>
              <td style={{ color: "#6b7280" }}>{data?.email}</td>
            </tr>
            <tr className={cx("user-mobile-bot-table-tr")}>
              <td style={{ fontWeight: "600" }}>Quyền hạn</td>
              <td style={{ color: "#6b7280" }}>
                {data.role === statusRoleUser.ADMIN && <span>Admin</span>}
                {data.role === statusRoleUser.MODERATOR && (
                  <span>Moderator</span>
                )}
                {data.role === statusRoleUser.USER && <span>User</span>}
              </td>
            </tr>
            <tr className={cx("user-mobile-bot-table-tr")}>
              <td style={{ fontWeight: "600" }}>Trạng thái</td>
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
            </tr>
            <tr className={cx("user-mobile-bot-table-tr")}>
              <td style={{ fontWeight: "600" }}>Hành động</td>
              <td>
                <div className={cx("actions")}>
                  <ActionEdit
                    onClick={() => {
                      handleUpdateUser(data.id);
                    }}
                  ></ActionEdit>
                  <ActionDelete
                    onClick={() => handleDelete(data.id)}
                  ></ActionDelete>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserItem;
