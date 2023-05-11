import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Post.module.scss";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import PostItem, { SkeletonPost } from "../../components/PostItem/PostItem";
import SearchManage from "../../components/SearchManage/SearchManage";
import Button from "../../button/Button";
import { CATEGORY_PER_PAGE, statusRoleUser } from "../../configStatus";
import { Dropdown } from "../../components/Dropdown";
import { useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import useRoleUser from "../../hook/useRoleUser";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const Post = () => {
  const [posts, setPosts] = useState([]);
  const currentItem = posts.length;
  const [lastDoc, setLastDoc] = useState("");
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState([]);

  const { control } = useForm({ mode: "onChange" });

  const { roleUserId } = useRoleUser();

  const handleLoadmoreCategory = async () => {
    const nextRef = query(
      collection(db, "posts"),
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
      setPosts([...posts, ...result]);
    });
    const documentSnapshots = await getDocs(nextRef);

    // Get the last visible document
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    setLastDoc(lastVisible);
  };
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const q = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "uf8")
          )
        : query(colRef, limit(CATEGORY_PER_PAGE));

      const documentSnapshots = await getDocs(q);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });
      onSnapshot(q, (snapshot) => {
        let result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(result);
      });

      setLastDoc(lastVisible);
    }

    fetchData();
  }, [filter]);

  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  useEffect(() => {
    async function getDataCategory() {
      const docRef = collection(db, "categories");
      const q = query(docRef, where("status", "==", 1));
      const docData = await getDocs(q);
      let arr = [];
      docData.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data(),
        });
        setCategory(arr);
      });
    }
    getDataCategory();
  }, []);
  const [label, setLabel] = useState("");

  const handleSelectCategory = async (item) => {
    setLabel(item.name);
    const docRef = collection(db, "posts");
    const q = query(docRef, where("category.name", "==", item.name));
    onSnapshot(q, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPosts(results);
      setTotal(snapshot.size);
    });
  };
  if (roleUserId !== statusRoleUser.ADMIN) return null;

  return (
    <div>
      <div className={cx("heading")}>
        <div>
          <h2 className={cx("title")}>Tất cả bài viết</h2>
          <span className={cx("desc-title")}>Quản lý tất cả các bài viết</span>
        </div>
        <Link to="/manage/trash-post">
          <Button type="button" className={cx("trash-post")}>
            <FontAwesomeIcon
              className={cx("icon-trash")}
              icon={faTrash}
            ></FontAwesomeIcon>
            Thùng rác
          </Button>
        </Link>
      </div>
      <div className={cx("box-dropdown-search")}>
        <div>
          <Dropdown control={control} name="category">
            <Dropdown.SelectDropdown
              placeholder={label || "Danh mục"}
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
          </Dropdown>
        </div>

        <SearchManage
          onChange={handleInputFilter}
          placeholder="Tìm kiếm..."
        ></SearchManage>
      </div>
      <div className={cx("table-posts")}>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Bài viết</th>
              <th>Danh mục</th>
              <th>Tác giả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.length <= 0 && total <= 0 && <SkeletonPost></SkeletonPost>}
            {posts.length > 0 &&
              posts.map((post) => (
                <PostItem data={post} key={post.id}></PostItem>
              ))}
            {posts.length <= 0 && filter && (
              <div className={cx("no-results")}>
                {`Can't find posts with keyword "${filter}"`}
              </div>
            )}
          </tbody>
        </table>
      </div>
      {currentItem > 0 && (
        <div className={cx("info-pagination")}>
          {currentItem} trên {total} danh mục
        </div>
      )}

      {currentItem > 0 && total > currentItem && (
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
    </div>
  );
};

export default Post;
