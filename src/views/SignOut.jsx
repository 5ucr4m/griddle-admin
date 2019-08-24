import React from "react";
import { logout } from "../services/auth";
import { Redirect } from "react-router-dom";

class SignOut extends React.Component {

  renderRedirect = () => {
    logout();
    return <Redirect to='/signin' />
  }

  render() {
    return (
      <>
        {this.renderRedirect()}
      </>
    );
  }
}

export default SignOut;
