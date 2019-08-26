import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Alert,
  Image
} from "reactstrap";
import api from "../services/api";
import { login, isAuthenticated } from "../services/auth";
import { Redirect } from 'react-router-dom';
import iconApp from '../assets/img/icon_120x120.png';


class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    message: "",
    visible: true,
    color: '',
    logged: false
  }
  handleSignIn = async e => {
    e.preventDefault();
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({
        visible: true,
        color: 'danger',
        message: "Email or password blank!"
      });
    } else {
      try {
        const response = await api.post("/users/signin/admin", { email, password });
        login(response.data.token);
        this.setState({ logged: true });
        this.renderRedirect();
      } catch (err) {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
        this.setState({
          visible: true,
          color: 'danger',
          message:
            "E-mail or passwod invalid!"
        });
      }
    }
  }
  
  renderRedirect = () => {
    if (isAuthenticated() || this.state.logged) {
      return <Redirect to='/admin/dashboard' />
    }
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    return (
      <>
        {this.renderRedirect()}
          <div className="content-signin">
                <Card className="card-signin">
                  <CardHeader className="header-signin">
              {/* <CardTitle tag="h5">SignIn</CardTitle> */}
                    <img src={iconApp} alt="" className="imsg-signin" />
                  </CardHeader>
                  <CardBody>
                    {this.state.message && (
                      <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                        {this.state.message}
                      </Alert>
                    )}
                    <Form onSubmit={this.handleSignIn}>
                      <Row>
                        <Col className="px-1" md="12">
                          <FormGroup>
                            <label htmlFor="exampleInputEmail1">
                              Email address
                            </label>
                            <Input
                              placeholder="Email"
                              type="email"
                              onChange={e =>
                                this.setState({
                                  email: e.target.value
                                })
                              }
                            />
                          </FormGroup>
                          <FormGroup>
                            <label>Password</label>
                            <Input
                              placeholder="Password"
                              type="password"
                              onChange={e =>
                                this.setState({
                                  password: e.target.value
                                })
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row style={{ justifyContent: "center" }}>
                          <Button
                            className="btn-round"
                            color="primary"
                            type="submit"
                          >
                            Enter
                          </Button>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
        </div>
      </>
    );
  }
}

export default SignIn;
