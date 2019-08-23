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
  Col
} from "reactstrap";
import api from "../services/api";
import { login, isAuthenticated } from "../services/auth";
import { Redirect } from "react-router-dom";

class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
  }

  handleSignIn = async e => {
    e.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({ error: "Preencha e-mail e senha para continuar!" });
    } else {
      try {
        const response = await api.post("/users/signin", { email, password });
        login(response.data.token);
        this.setState({ toProfile: true });
      } catch (err) {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
        this.setState({
          error:
            "Houve um problema com o login, verifique suas credenciais. T.T"
        });
      }
    }
  };
  render() {
    if (isAuthenticated() === true) {
      return <Redirect to="/admin/dashboard" />;
    }

    return (
      <>
        <div className="content">
          <Row style={{ justifyContent: "center" }}>
            <Col md="4">
              <Card style={{ width: '20rem' }}>
                <CardHeader>
                  <CardTitle tag="h5">SignIn</CardTitle>
                </CardHeader>
                <CardBody>
                  {this.state.error && <p>{this.state.error}</p>}
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
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default SignIn;
