import React from "react";

import UserList from './Users';
import PictureList from './Pictures';

class Dashboard extends React.Component {
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
