import React, { useEffect, useState } from "react";
import Button from "../../button/Button";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import classNames from "classnames/bind";
import styles from "./Category.module.scss";
import { useNavigate } from "react-router-dom";
import SearchManage from "../../components/SearchManage/SearchManage";
import CateItem from "../../components/CateItem/CateItem";
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
import debounce from "lodash.debounce";
import { CATEGORY_PER_PAGE, statusRoleUser } from "../../configStatus";
import useRoleUser from "../../hook/useRoleUser";

const cx = classNames.bind(styles);

const Category = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/manage/add-category");
  };

  const [category, setCategory] = useState([]);
  const currentItem = category.length;

  const [filter, setFilter] = useState("");
  const [lastDoc, setLastDoc] = useState("");
  const [total, setTotal] = useState(0);

  const handleLoadmoreCategory = async () => {
    // Construct a new query starting at this document,
    // get the next 25 cities.
    const nextRef = query(
      collection(db, "categories"),
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
      setCategory([...category, ...result]);
    });
    const documentSnapshots = await getDocs(nextRef);

    // Get the last visible document
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    setLastDoc(lastVisible);
  };

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      const valueFilter = filter
        ? query(
            colRef,
            where("name", ">=", filter),
            where("name", "<=", filter + "uf8")
          )
        : query(colRef, limit(CATEGORY_PER_PAGE));

      const documentSnapshots = await getDocs(valueFilter);

      // Get the last visible document
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });

      onSnapshot(valueFilter, (snapshot) => {
        let result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setCategory(result);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter]);

  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  const { roleUserId } = useRoleUser();
  if (roleUserId !== statusRoleUser.ADMIN) return null;

  return (
    <>
      <div className={cx("heading")}>
        <DashboardTitle
          title="Tất cả danh mục bài viết"
          desc="Quản lí danh mục bài viết"
        ></DashboardTitle>
        <Button
          className={cx("btn-create")}
          type="button"
          onClick={handleClick}
        >
          Thêm danh mục
        </Button>
      </div>
      <SearchManage
        onChange={handleInputFilter}
        placeholder="Tìm kiếm..."
      ></SearchManage>
      <div className={cx("table-posts")}>
        {currentItem > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Tên danh mục</th>
                <th>Đường dẫn</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {category.length > 0 &&
                category.map((item) => (
                  <CateItem key={item.id} data={item}></CateItem>
                ))}
            </tbody>
          </table>
        ) : (
          <div className={cx("no-results")}>
            No search results for articles with keyword
          </div>
        )}
      </div>

      {currentItem > 0 && (
        <div className={cx("info-pagination")}>
          {currentItem} trên {total} danh mục
        </div>
      )}

      {/* <Pagination></Pagination> */}
      {currentItem > 0 && currentItem < total && (
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

export default Category;
