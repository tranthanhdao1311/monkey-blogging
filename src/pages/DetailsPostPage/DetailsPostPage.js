import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./DetailsPostPage.module.scss";
import { Link, useParams } from "react-router-dom";
import PostTitle from "../../components/PostTitle/PostTitle";
import Button from "../../button/Button";
import PostInfo from "../../components/PostInfo/PostInfo";
import PostSimilar from "../../components/PostSimilar/PostSimilar";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import parse from "html-react-parser";
import Loading from "../../components/loading/Loading";
import Input from "../../components/input/Input";
import { useForm } from "react-hook-form";
import Label from "../../components/label/Label";
import { useAuth } from "../../context/auth-context";
import CommentChildren from "../../components/CommentChildren/CommentChildren";
import TextArea from "../../components/textarea/TextArea";
import images from "../../asset/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";

const cx = classNames.bind(styles);

const DetailsPostPage = () => {
  const { userInfo } = useAuth();
  const { control: control1, handleSubmit: handleSubmitComment1 } = useForm({
    mode: "onChange",
    defaultValues: {
      comment: "",
      createAt: "",
      idPost: "",
      idUser: "",
      userName: "",
      commentChildren: [],
    },
  });

  const {
    control: control2,
    handleSubmit: handleSubmitComment2,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      commentChildren: "",
      createdAt: "",
      idUser: "",
      userName: "",
    },
  });
  // hien thi chi tiet bai viet
  const params = useParams();
  const { slug } = params;
  const [postDetail, setPostDetail] = useState({});
  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      const docRef = collection(db, "posts");
      const q = query(docRef, where("slug", "==", slug));

      onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
          setPostDetail({ id: doc.id, ...doc.data() });
        });
      });
    }
    fetchData();
  }, [slug]);

  const date = new Date(postDetail?.createAt?.seconds * 1000);
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  const formatTime = new Date(date).toLocaleTimeString("vi-VI");

  // scroll
  useEffect(() => {
    window.scroll(0, 0);
  }, [slug]);

  //comment

  const [comment, setComment] = useState([]);
  useEffect(() => {
    if (postDetail.id) {
      const colRef = collection(db, "comment");
      const q = query(colRef, where("idPost", "==", postDetail.id));
      onSnapshot(q, (snapshot) => {
        const result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setComment(result);
      });
    }
  }, [postDetail]);

  const handleSubmitComment = async (values) => {
    try {
      await addDoc(collection(db, "comment"), {
        idPost: postDetail.id,
        idUser: userInfo.uid,
        userName: userInfo.displayName,
        comment: values.comment,
        createAt: serverTimestamp(),
      });
    } catch (error) {}
  };

  const [showFromRepCmt, setShowFromRepCmt] = useState(false);
  console.log(showFromRepCmt);
  const handleRepComment = (item) => {
    setActiveClick(false);

    setShowFromRepCmt((prev) => ({
      ...!prev,
      [item.id]: true,
    }));
  };

  const handleRepCmt = async (item, values) => {
    try {
      const docRef = doc(db, "comment", item.id);
      await updateDoc(docRef, {
        commentChildren: arrayUnion({
          userName: userInfo.displayName,
          commentChildren: values.commentChildren,
          idUser: userInfo.uid,
          createdAt: new Date(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [activeClick, setActiveClick] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const handleClickTextArea = () => {
    const email = userInfo.email;
    const username = email.replace("@gmail.com", "");
    setUserEmail(username);
    setActiveClick(true);
  };

  // if (!postDetail.title)
  //   return <Loading size="size-big" className={cx("style-loading")}></Loading>;
  if (!slug) return <NotFoundPage></NotFoundPage>;
  return (
    <div className={cx("container")}>
      <div className={cx("post-header")}>
        <div className={cx("post-img")}>
          <img className={cx("img")} src={postDetail?.image} alt="" />
        </div>
        <div className={cx("post-info")}>
          <div className={cx("post-category")}>
            <Link to="/category/news">
              <Button type="button" className={cx("btn-category")}>
                {postDetail?.category?.name}
              </Button>
            </Link>
          </div>
          <PostTitle className={cx("post-heading")}>
            {postDetail?.title}
          </PostTitle>

          <PostInfo
            date={formatDate + " " + formatTime}
            author={postDetail.user?.username}
            bgColorDot={cx("bg-dot")}
          ></PostInfo>
        </div>
      </div>
      <div className={cx("post-content")}>
        <div className={cx("entry-content")}>
          {parse(postDetail?.content || "")}
        </div>
        {/* <div className={cx("author")}>
          <div className={cx("author-img")}>
            <img className={cx("img")} src={postDetail.user?.image} alt="" />
          </div>
          <div className={cx("author-desc")}>
            <h3 className={cx("author-name")}>{postDetail.user?.fullname}</h3>
            <p className={cx("desc")}>{postDetail.user?.desc}</p>
          </div>
        </div> */}
      </div>

      <div className={cx("box-cmt-adver")}>
        <div className={cx("form-cmt")}>
          <form
            className={cx("cmt-parent")}
            onSubmit={handleSubmitComment1(handleSubmitComment)}
          >
            <div className={cx("comment")}>
              <Label className={cx("label-cmt")} htmlFor="comment">
                Ý kiến
              </Label>
              <TextArea
                name="comment"
                id="comment"
                type="text"
                control={control1}
                placeholder="Ý kiến của bạn"
                className={cx("height-input-cmt", activeClick && "active-cmt")}
                onClick={() => handleClickTextArea()}
              ></TextArea>
            </div>
            {activeClick && (
              <div className={cx("box-info-btn")}>
                <div className={cx("info-cmt")}>
                  <img src={images.imgUserEmpty} alt="" />
                  <span className={cx("info-cmt-email")}>{userEmail}</span>
                </div>
                <Button
                  type="submit"
                  className={cx("btn-send-cmt")}
                  onSubmit={() => handleSubmitComment()}
                >
                  Gửi
                </Button>
              </div>
            )}
          </form>
          {comment.map((item) => {
            const showFrom = showFromRepCmt[item.id];
            const dateCmt = new Date(item?.createAt?.seconds * 1000);
            const formatDateCmt = new Date(dateCmt).toLocaleDateString("vi-VI");
            const formatTimeCmt = new Date(dateCmt).toLocaleTimeString("vi-VI");
            return (
              <div>
                <div className={cx("box-parent-cmt")} key={item.id}>
                  <div className={cx("box-img-cmt")}>
                    <img src={images.imgUserEmpty} alt="" />
                  </div>
                  <div>
                    <div>
                      <span className={cx("username-cmt")}>
                        {item.userName}
                      </span>
                      <span style={{ color: "#4f4f4f" }}>{item.comment}</span>
                    </div>
                    <div className={cx("info-cmt-parent")} s>
                      <div className={cx("like-cmt")}>
                        <FontAwesomeIcon
                          className={cx("like-cmt-icon")}
                          icon={faThumbsUp}
                        ></FontAwesomeIcon>
                        <span>Thích</span>
                      </div>
                      <p
                        style={{ whiteSpace: "nowrap" }}
                        onClick={() => handleRepComment(item)}
                      >
                        Trả lời
                      </p>

                      <p>{formatTimeCmt + " " + formatDateCmt}</p>
                    </div>
                  </div>
                </div>
                <div className={cx("form-rep-cmt")}>
                  {showFrom && (
                    <form
                      onSubmit={(e, values) => {
                        handleSubmitComment2(handleRepCmt, values, item);
                        e.preventDefault();
                      }}
                    >
                      <TextArea
                        name="commentChildren"
                        id="commentChildren"
                        type="text"
                        control={control2}
                        placeholder="Ý kiến của bạn"
                        className={cx("height-input-cmt", "active-cmt")}
                      ></TextArea>

                      <div className={cx("box-info-btn")}>
                        <div className={cx("info-cmt")}>
                          <img src={images.imgUserEmpty} alt="" />
                          <span className={cx("info-cmt-email")}>
                            {userEmail}
                          </span>
                        </div>
                        <Button
                          type="submit"
                          className={cx("btn-send-cmt")}
                          onClick={() => handleRepCmt(item, getValues())}
                        >
                          Gửi
                        </Button>
                      </div>
                    </form>
                  )}
                  {item.commentChildren?.map((item1) => {
                    const dateCmt = new Date(item1?.createdAt?.seconds * 1000);
                    const formatDateCmt = new Date(dateCmt).toLocaleDateString(
                      "vi-VI"
                    );
                    const formatTimeCmt = new Date(dateCmt).toLocaleTimeString(
                      "vi-VI"
                    );
                    return (
                      <div className={cx("box-parent-cmt")} key={item1.id}>
                        <div className={cx("box-img-cmt")}>
                          <img src={images.imgUserEmpty} alt="" />
                        </div>
                        <div>
                          <div>
                            <span className={cx("username-cmt")}>
                              {item1.userName}
                            </span>
                            <span style={{ color: "#4f4f4f" }}>
                              {item1.commentChildren}
                            </span>
                          </div>
                          <div className={cx("info-cmt-parent")} s>
                            <div className={cx("like-cmt")}>
                              <FontAwesomeIcon
                                className={cx("like-cmt-icon")}
                                icon={faThumbsUp}
                              ></FontAwesomeIcon>
                              <span>Thích</span>
                            </div>

                            <p>{formatTimeCmt + " " + formatDateCmt}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className={cx("advertisement")}>
          <img src={images.banner2} alt="" />
        </div>
      </div>

      <PostSimilar data={postDetail}></PostSimilar>
    </div>
  );
};

export default DetailsPostPage;
