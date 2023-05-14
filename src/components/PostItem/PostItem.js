import React from "react";
import classNames from "classnames/bind";
import styles from "./PostItem.module.scss";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import LabelStatus from "../label/LabelStatus";
import ActionView from "../Action/ActionView";
import ActionEdit from "../Action/ActionEdit";
import ActionDelete from "../Action/ActionDelete";
import { statusAddPost } from "../../configStatus";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const PostItem = ({ data }) => {
  const navigate = useNavigate();
  const handleDelete = async (e) => {
    e.preventDefault();
    const docRefDelete = doc(db, "posts", data.id);
    const getData = await getDoc(docRefDelete);
    Swal.fire({
      title: "Xóa bài viết vào thùng rác?",
      text: `Id: ${data.id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
    }).then(async (result) => {
      if (result.isConfirmed) {
        async function docData() {
          try {
            await setDoc(doc(db, "posttrash", docRefDelete.id), {
              ...getData.data(),
            });
            await deleteDoc(docRefDelete);
          } catch (error) {
            toast.error(`Không thể xóa bài viết id: ${data.id} vào thùng rác!`);
          }
        }
        docData();

        Swal.fire(
          "Đã chuyển vào thùng rác bài viết!",
          `Chuyển id: ${data.id} vào thùng rác thành công!`,
          "success"
        );
      }
    });
  };
  const nagigate = useNavigate();

  const handleEditPost = (id) => {
    nagigate(`/manage/update-post?id=${id}`);
  };

  const date = new Date(data.createAt?.seconds * 1000);
  const time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <>
      <tr className={cx("table-desktop")} key={data.id}>
        <td
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
            <img src={data.image} alt="" className={cx("post-img")} />
            <div className={cx("info-post")}>
              <h3 className={cx("post-title")}>{data.title}</h3>
              <time>
                CreatedAt: {time}, {formatDate}
              </time>
            </div>
          </div>
        </td>
        <td style={{ color: "#6b7280", fontSize: "16px" }}>
          {data?.category?.name}
        </td>
        <td style={{ color: "#6b7280", fontSize: "16px" }}>
          {data?.user?.email}
        </td>
        <td>
          {data.status === statusAddPost.APPROVED && (
            <LabelStatus type="success">Đã duyệt</LabelStatus>
          )}
          {data.status === statusAddPost.PENDING && (
            <LabelStatus type="warning">Đang duyệt</LabelStatus>
          )}
          {data.status === statusAddPost.REJECT && (
            <LabelStatus type="danger">Từ chối</LabelStatus>
          )}
        </td>
        <td>
          <div className={cx("actions")}>
            <ActionView
              onClick={() => {
                navigate(`/${data.id}`);
              }}
            ></ActionView>
            <ActionEdit
              onClick={() => {
                handleEditPost(data.id);
              }}
            ></ActionEdit>
            <ActionDelete onClick={handleDelete}></ActionDelete>
          </div>
        </td>
      </tr>
      <div className={cx("posts-mobile")}>
        <div className={cx("posts-mobile-top")}>
          <span>{data.id}</span>
          <span>{time + ", " + formatDate}</span>
        </div>
        <div className={cx("posts-mobile-middle")}>
          <img
            className={cx("posts-mobile-middle-img")}
            src={data.image}
            alt=""
          />
          <p className={cx("posts-mobile-middle-title")}>{data.title}</p>
        </div>
        <div className={cx("posts-mobile-bot")}>
          <table className={cx("posts-mobile-bot-table")}>
            <tr className={cx("posts-mobile-bot-table-tr")}>
              <td style={{ fontWeight: "600" }}>Danh mục</td>
              <td style={{ color: "#6b7280" }}>{data?.category?.name}</td>
            </tr>
            <tr className={cx("posts-mobile-bot-table-tr")}>
              <td style={{ fontWeight: "600" }}>Tác giả</td>
              <td style={{ color: "#6b7280" }}>{data?.user?.email}</td>
            </tr>
            <tr className={cx("posts-mobile-bot-table-tr")}>
              <td style={{ fontWeight: "600" }}>Trạng thái</td>
              <td>
                {data.status === statusAddPost.APPROVED && (
                  <LabelStatus type="success">Đã duyệt</LabelStatus>
                )}
                {data.status === statusAddPost.PENDING && (
                  <LabelStatus type="warning">Đang duyệt</LabelStatus>
                )}
                {data.status === statusAddPost.REJECT && (
                  <LabelStatus type="danger">Từ chối</LabelStatus>
                )}
              </td>
            </tr>
            <tr className={cx("posts-mobile-bot-table-tr")}>
              <td style={{ fontWeight: "600" }}>Hành động</td>
              <td>
                <div className={cx("actions")}>
                  <ActionView
                    onClick={() => {
                      navigate(`/${data.id}`);
                    }}
                  ></ActionView>
                  <ActionEdit
                    onClick={() => {
                      handleEditPost(data.id);
                    }}
                  ></ActionEdit>
                  <ActionDelete onClick={handleDelete}></ActionDelete>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default PostItem;

export const SkeletonPost = () => {
  return (
    <>
      <tr>
        <td
          style={{
            fontSize: "16px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "13ch",
          }}
        >
          <LoadingSkeleton
            width="70px"
            height="20px"
            radius="4px"
          ></LoadingSkeleton>
        </td>
        <td className={cx("padding-right")}>
          <div className={cx("post-item")}>
            <LoadingSkeleton
              width="66px"
              height="55px"
              radius="4px"
            ></LoadingSkeleton>
            <div className={cx("info-post")}>
              <LoadingSkeleton
                width="420px"
                height="24px"
                radius="4px"
                margin="0 0 5px 0"
              ></LoadingSkeleton>
              <LoadingSkeleton
                width="220px"
                height="24px"
                radius="4px"
              ></LoadingSkeleton>
            </div>
          </div>
        </td>
        <td style={{ color: "#6b7280", fontSize: "16px" }}>
          <LoadingSkeleton
            width="100px"
            height="30px"
            radius="4px"
          ></LoadingSkeleton>
        </td>
        <td style={{ color: "#6b7280", fontSize: "16px" }}>
          <LoadingSkeleton
            width="250px"
            height="30px"
            radius="4px"
          ></LoadingSkeleton>
        </td>
        <td>
          <LoadingSkeleton
            width="120px"
            height="40px"
            radius="10px"
          ></LoadingSkeleton>
        </td>
        <td>
          <div className={cx("actions")}>
            <LoadingSkeleton
              width="40px"
              height="40px"
              radius="5px"
            ></LoadingSkeleton>
            <LoadingSkeleton
              width="40px"
              height="40px"
              radius="5px"
            ></LoadingSkeleton>
            <LoadingSkeleton
              width="40px"
              height="40px"
              radius="5px"
            ></LoadingSkeleton>
          </div>
        </td>
      </tr>
    </>
  );
};
