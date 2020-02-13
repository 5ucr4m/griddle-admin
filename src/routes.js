import Dashboard from "views/Dashboard.jsx";
import OpinionIndex from "views/Opinions";
import OpinionEdit from "views/Opinions/edit.jsx";
import UserIndex from "views/Users";
import UserPicturesIndex from "views/Users/Pictures";
import UserEdit from "views/Users/edit.jsx";
import PictureShow from "views/Pictures/show.jsx";
import PictureIndex from "views/Pictures";
import CategoriesIndex from "views/Categories";
import CommentEdit from "views/Comments/edit.jsx";
import SignOut from "views/SignOut.jsx";
// import Notifications from "views/Notifications.jsx";
// import Icons from "views/Icons.jsx";
// import Typography from "views/Typography.jsx";
// import TableList from "views/Tables.jsx";
// import Maps from "views/Map.jsx";
// import UpgradeToPro from "views/Upgrade.jsx";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/pictures",
    name: "List Pictures",
    icon: "nc-icon nc-album-2",
    component: PictureIndex,
    layout: "/admin"
  },
  {
    path: "/users/:id/pictures",
    name: "List Pictures",
    icon: "nc-icon nc-single-02",
    component: UserPicturesIndex,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/users/:id/edit",
    name: "Edit User",
    icon: "nc-icon nc-single-02",
    component: UserEdit,
    layout: "/admin",
    hidden: true
  },
  // {
  //   path: "/users/:id",
  //   name: "Show Profile",
  //   icon: "nc-icon nc-single-02",
  //   component: UserEdit,
  //   layout: "/admin",
  //   hidden: true
  // },
  {
    path: "/users",
    name: "List Users",
    icon: "nc-icon nc-circle-10",
    component: UserIndex,
    layout: "/admin"
  },
  {
    path: "/pictures/:id",
    name: "Show Picture",
    icon: "nc-icon nc-single-02",
    component: PictureShow,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/categories",
    name: "List Categories",
    icon: "nc-icon nc-bullet-list-67",
    component: CategoriesIndex,
    layout: "/admin"
  },
  {
    path: "/comments/:id/edit",
    name: "Edit Comment",
    icon: "nc-icon nc-single-02",
    component: CommentEdit,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/opinions/:id/edit",
    name: "Edit Feedback",
    icon: "nc-icon nc-bulb-63",
    component: OpinionEdit,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/opinions",
    name: "Feedback",
    icon: "nc-icon nc-bulb-63",
    component: OpinionIndex,
    layout: "/admin"
  },
  {
    path: "/signout",
    name: "Logout",
    component: SignOut,
    layout: "/admin"
  }
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-diamond",
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "nc-icon nc-pin-3",
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: Notifications,
  //   layout: "/admin"
  // },
  // {
  //   path: "/tables",
  //   name: "Table List",
  //   icon: "nc-icon nc-tile-56",
  //   component: TableList,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-caps-small",
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   pro: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "nc-icon nc-spaceship",
  //   component: UpgradeToPro,
  //   layout: "/admin"
  // }
];
export default routes;
