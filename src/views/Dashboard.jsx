import React from "react";

import UserList from './Users';
import PictureList from './Pictures';
import { isAuthenticated } from "../services/auth";


class Dashboard extends React.Component {
  componentDidMount() {
    if (!isAuthenticated()) {
      return this.props.history.push('/signin');
    }
  }
  render() {
    return (
      <div className="content">
        <UserList />
        <PictureList />
      </div>
    );
  }
}

export default Dashboard;
