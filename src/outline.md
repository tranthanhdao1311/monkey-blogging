Những thứ cần hoàn thiện

<!-- 1. Phân quyền -->
<!-- 5. Thêm desc author -->
<!-- 4. Phân quyền chỉnh sửa bài viết của chính tác giả bài viết -->
<!-- 1. Delete User -->

2. Update profile
3. Validate form

{x.length > 0 &&
x.map((item) => (
<div className={cx("box-nav")} key={item.id}>
<h2 className={cx("list-nav-title")}>{item.name}</h2>

                {/* {firstPostsChildren.category.id === item?.id && (
                  <div className={cx("nav-first-item")}>
                    <img
                      className={cx("post-nav-img")}
                      src={firstPostsChildren.image}
                      alt=""
                    />
                    <Link
                      className={cx("post-nav-title")}
                      to={`/${firstPostsChildren.slug}`}
                    >
                      {firstPostsChildren.title}
                    </Link>
                  </div>
                )} */}
                {/* {postsChildren.length > 0 &&
                  postsChildren.map(
                    (itemChild) =>
                      itemChild.category.id === item?.id && (
                        <p
                          className={cx("post-order-title")}
                          key={itemChild.id}
                        >
                          <Link to={`/${itemChild.slug}`}>
                            {itemChild.title}
                          </Link>
                        </p>
                      )
                  )} */}
              </div>
            ))}
