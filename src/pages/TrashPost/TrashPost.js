import React from "react";
import classNames from "classnames/bind";
import styles from "./TrashPost.module.scss";
import { useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ActionDelete from "../../components/Action/ActionDelete";
import ActionRestore from "../../components/Action/ActionRestore";
import { statusAddPost } from "../../configStatus";
import LabelStatus from "../../components/label/LabelStatus";
import Swal from "sweetalert2";

const cx = classNames.bind(styles);
const TrashPost = () => {
  const [trashPost, setTrashPost] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posttrash");
    onSnapshot(colRef, (snapshot) => {
      const result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setTrashPost(result);
    });
  }, []);

  const handleRestore = async (item) => {
    const docRefDelete = doc(db, "posttrash", item.id);
    Swal.fire({
      title: "Bạn chắc chắn muốn khôi phục?",
      text: `Bài viết  ${item.id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await setDoc(doc(db, "posts", item.id), {
            ...item,
          });
          await deleteDoc(docRefDelete);
          toast.success(`Đã khôi phục bài viết ${item.id} thành công!`);
        } catch (error) {
          toast.error(`Không thể khôi phục bài viết ${item.id}!`);
        }

        Swal.fire(
          "Khôi phục thành công!",
          `Khôi phục bài viết ${item.id} thành công!`,
          "success"
        );
      }
    });
  };
  const handleDelete = async (item) => {
    const docRefDelete = doc(db, "posttrash", item.id);
    Swal.fire({
      title: "Bạn chắc chắn muốn xóa vĩnh viễn?",
      text: `Bài viết  ${item.id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(docRefDelete);
          toast.success(`Xóa vĩnh viễn bài viết ${item.id} thành công!`);
        } catch (error) {
          toast.error(`Không thể xóa bài viết ${item.id}!`);
        }

        Swal.fire(
          "Xóa vĩnh viễn thành công!",
          `Xóa vĩnh viễn bài viết ${item.id} thành công!`,
          "success"
        );
      }
    });
  };
  return (
    <div>
      <div className={cx("heading")}>
        <div>
          <h2 className={cx("title")}>Thùng rác bài viết</h2>
          <span className={cx("desc-title")}>
            Quản lý tất cả các bài viết trong thùng rác
          </span>
        </div>
      </div>
      <div className={cx("box-dropdown-search")}>
        <div>
          {/* <Dropdown control={control} name="category">
              <Dropdown.SelectDropdown
                placeholder={label || "Category"}
                className={cx("dropdown-w")}
              ></Dropdown.SelectDropdown>
              <Dropdown.List className={cx("list")}>
                {category.length > 0 &&
                  category.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      className={cx("dropdown-item")}
                      onClick={() => handleSelectCategory(item)}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown> */}
        </div>

        {/* <SearchManage
            onChange={handleInputFilter}
            placeholder="Search post..."
          ></SearchManage> */}
      </div>
      <div className={cx("table-posts")}>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Bài viết</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {trashPost.length > 0 &&
              trashPost.map((item) => (
                <tr key={item.id}>
                  <td
                    style={{
                      fontSize: "16px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "13ch",
                    }}
                  >
                    {item.id}
                  </td>
                  <td className={cx("padding-right")}>
                    <div className={cx("post-item")}>
                      <img src={item.image} alt="" className={cx("post-img")} />
                      <div className={cx("info-post")}>
                        <h3 className={cx("post-title")}>{item.title}</h3>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "#6b7280", fontSize: "16px" }}>
                    {item?.category?.name}
                  </td>

                  <td>
                    {item.status === statusAddPost.APPROVED && (
                      <LabelStatus type="success">Đã duyệt</LabelStatus>
                    )}
                    {item.status === statusAddPost.PENDING && (
                      <LabelStatus type="warning">Đang duyệt</LabelStatus>
                    )}
                    {item.status === statusAddPost.REJECT && (
                      <LabelStatus type="danger">Từ chối</LabelStatus>
                    )}
                  </td>
                  <td>
                    <div className={cx("actions")}>
                      <ActionRestore
                        onClick={() => handleRestore(item)}
                      ></ActionRestore>
                      <ActionDelete
                        onClick={() => handleDelete(item)}
                      ></ActionDelete>
                    </div>
                  </td>
                </tr>
              ))}
            {/* {trashPost.length <= 0 && filter && (
                <div className={cx("no-results")}>
                  {`Can't find posts with keyword "${filter}"`}
                </div>
              )} */}
          </tbody>
        </table>
      </div>
      <div className={cx("table-posts-mobile")}>
        {trashPost.length > 0 &&
          trashPost.map((post) => (
            <div className={cx("posts-mobile")}>
              <div className={cx("posts-mobile-top")}>
                <span>{post.id}</span>
              </div>
              <div className={cx("posts-mobile-middle")}>
                <img
                  className={cx("posts-mobile-middle-img")}
                  src={post.image}
                  alt=""
                />
                <p className={cx("posts-mobile-middle-title")}>{post.title}</p>
              </div>
              <div className={cx("posts-mobile-bot")}>
                <table className={cx("posts-mobile-bot-table")}>
                  <tr className={cx("posts-mobile-bot-table-tr")}>
                    <td style={{ fontWeight: "600" }}>Danh mục</td>
                    <td style={{ color: "#6b7280" }}>{post?.category?.name}</td>
                  </tr>
                  <tr className={cx("posts-mobile-bot-table-tr")}>
                    <td style={{ fontWeight: "600" }}>Tác giả</td>
                    <td style={{ color: "#6b7280" }}>{post?.user?.email}</td>
                  </tr>
                  <tr className={cx("posts-mobile-bot-table-tr")}>
                    <td style={{ fontWeight: "600" }}>Trạng thái</td>
                    <td>
                      {post.status === statusAddPost.APPROVED && (
                        <LabelStatus type="success">Đã duyệt</LabelStatus>
                      )}
                      {post.status === statusAddPost.PENDING && (
                        <LabelStatus type="warning">Đang duyệt</LabelStatus>
                      )}
                      {post.status === statusAddPost.REJECT && (
                        <LabelStatus type="danger">Từ chối</LabelStatus>
                      )}
                    </td>
                  </tr>
                  <tr className={cx("posts-mobile-bot-table-tr")}>
                    <td style={{ fontWeight: "600" }}>Hành động</td>
                    <td>
                      <div className={cx("actions")}>
                        <div className={cx("actions")}>
                          <ActionRestore
                            onClick={() => handleRestore(post)}
                          ></ActionRestore>
                          <ActionDelete
                            onClick={() => handleDelete(post)}
                          ></ActionDelete>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          ))}
      </div>
      {/* {currentItem > 0 && (
          <div className={cx("info-pagination")}>
            {currentItem} trên {total} danh mục
          </div>
        )} */}
      {/* {currentItem > 0 && total > currentItem && (
          <div className={cx("load-more")}>
            <Button
              onClick={handleLoadmoreCategory}
              className={cx("btn-load-more")}
              type="button"
            >
              Load more
            </Button>
          </div> */}
      {/* )} */}
    </div>
  );
};

export default TrashPost;
