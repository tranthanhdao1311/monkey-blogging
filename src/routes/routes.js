import DashboardLayout from "../components/Layout/DashboardLayout/DashboardLayout";
import LayoutAuth from "../components/Layout/LayoutAuth";
import ChildrenCategory from "../pages/ChildrenCategory/ChildrenCategory";
import TrashPost from "../pages/TrashPost/TrashPost";
import Tintucpage from "../pages/tintucpage/Tintucpage";
import React from "react";

const HomePage = React.lazy(() => import("../pages/Homepage/HomePage"));
const AddBanner = React.lazy(() => import("../pages/AddBanner/AddBanner"));
const Banner = React.lazy(() => import("../pages/Banner/Banner"));
const SearchAll = React.lazy(() => import("../pages/SearchAll/SearchAll"));
const DetailsPostPage = React.lazy(() =>
  import("../pages/DetailsPostPage/DetailsPostPage")
);
const CategoryUser = React.lazy(() =>
  import("../pages/CategoryUser/CategoryUser")
);
const SignInPage = React.lazy(() => import("../pages/SignInPage/SignInPage"));
const SignUpPage = React.lazy(() => import("../pages/SignUpPage/SignUpPage"));
const NotFoundPage = React.lazy(() =>
  import("../pages/NotFoundPage/NotFoundPage")
);
const ForgotPassword = React.lazy(() =>
  import("../pages/ForgotPassword/ForgotPassword")
);
const DashboardPage = React.lazy(() =>
  import("../pages/DashboardPage/DashboardPage")
);
const User = React.lazy(() => import("../pages/UserPage/User"));
const UpdateUser = React.lazy(() => import("../pages/UpdateUser/UpdateUser"));
const Post = React.lazy(() => import("../pages/PostPage/Post"));
const UpdatePost = React.lazy(() => import("../pages/UpdatePost/UpdatePost"));
const Category = React.lazy(() => import("../pages/CategoryPage/Category"));
const UpdateCategory = React.lazy(() =>
  import("../pages/UpdateCategory/UpdateCategory")
);
const Addpost = React.lazy(() => import("../pages/Addpost/Addpost"));
const AddUser = React.lazy(() => import("../pages/AddUser/AddUser"));
const AddCategory = React.lazy(() =>
  import("../pages/AddCategory/AddCategory")
);
const UpdateProfile = React.lazy(() =>
  import("../pages/UpdateProfile/UpdateProfile")
);
const publicRoutes = [
  { path: "/", component: HomePage },
  { path: "/:slug", component: DetailsPostPage },
  { path: "/category/:slug", component: CategoryUser },
  { path: "/category/:slug/:slug", component: ChildrenCategory },
  { path: "/sign-up", component: SignUpPage, layout: LayoutAuth },
  { path: "/sign-in", component: SignInPage, layout: LayoutAuth },
  { path: "/search/:value", component: SearchAll },
  { path: "/manage/add-banner", component: AddBanner, layout: DashboardLayout },
  { path: "/manage/banner", component: Banner, layout: DashboardLayout },
  { path: "/manage/add-banner", component: AddBanner },
  { path: "/forgot-password", component: ForgotPassword, layout: LayoutAuth },
  { path: "/tin-tuc", component: Tintucpage, layout: null },
  { path: "/dashboard", component: DashboardPage, layout: DashboardLayout },
  { path: "/manage/post", component: Post, layout: DashboardLayout },
  { path: "/manage/trash-post", component: TrashPost, layout: DashboardLayout },

  {
    path: "/manage/category",
    component: Category,
    layout: DashboardLayout,
  },
  { path: "/manage/user", component: User, layout: DashboardLayout },
  { path: "/add-post", component: Addpost, layout: DashboardLayout },
  {
    path: "/manage/add-category",
    component: AddCategory,
    layout: DashboardLayout,
  },
  {
    path: "/manage/update-category",
    component: UpdateCategory,
    layout: DashboardLayout,
  },
  {
    path: "/manage/update-post",
    component: UpdatePost,
    layout: DashboardLayout,
  },
  {
    path: "/manage/add-user",
    component: AddUser,
    layout: DashboardLayout,
  },
  {
    path: "/manage/update-user",
    component: UpdateUser,
    layout: DashboardLayout,
  },
  {
    path: "/manage/update-profile",
    component: UpdateProfile,
    layout: DashboardLayout,
  },
  { path: "*", component: NotFoundPage, layout: null },
];
export { publicRoutes };
