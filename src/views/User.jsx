/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
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
  Alert
} from "reactstrap";
import api from "../services/api";

class User extends React.Component {
  state = {
    profile_id: '',
    user: {},
    profile: {},
    message: '',
    visible: false,
    color: ''
  }

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;
      const response = await api.get(`/users/${id}`);
      const profile = response.data.Profile
      
      this.setState({ profile_id: id, profile });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      this.props.history.push('/admin/dashboard');
    }

  }
  
  handleUpdateProfile = async e => {
    e.preventDefault();
    const { profile } = this.state;
    await api.put(`/profiles/${this.state.profile_id}`, { ...profile });
    
    this.setState({
      color: 'success',
      visible: true,
      message:
        "Profile save!"
    });
  }
  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Edit Profile</CardTitle>
                </CardHeader>
                <CardBody>
                  {this.state.message && (
                    <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                      {this.state.message}
                    </Alert>
                  )}
                  <Form onSubmit={this.handleUpdateProfile}>
                    <Row>
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>First Name</label>
                          <Input
                            placeholder="First Name"
                            type="text"
                            defaultValue={this.state.profile.first_name}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.first_name = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="6">
                        <FormGroup>
                          <label>Last Name</label>
                          <Input
                            placeholder="Last Name"
                            type="text"
                            defaultValue={this.state.profile.last_name}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.last_name = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="10">
                        <FormGroup>
                          <label>Address</label>
                          <Input
                            placeholder="Street"
                            type="text"
                            defaultValue={this.state.profile.street}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.street = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <label>Number</label>
                          <Input
                            placeholder="Number"
                            type="text"
                            defaultValue={this.state.profile.number}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.number = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="4">
                        <FormGroup>
                          <label>City</label>
                          <Input
                            placeholder="City"
                            type="text"
                            defaultValue={this.state.profile.city}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.city = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-1" md="4">
                        <FormGroup>
                          <label>Country</label>
                          <Input
                            placeholder="Country"
                            type="text"
                            defaultValue={this.state.profile.county}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.county = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-1" md="4">
                        <FormGroup>
                          <label>State</label>
                          <Input
                            placeholder="State"
                            type="text"
                            defaultValue={this.state.profile.state}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.state = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <label>Phone</label>
                          <Input placeholder="Phone" type="text"
                            defaultValue={this.state.profile.phone}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.phone = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label>Twitter</label>
                          <Input placeholder="Twitter" type="text"
                            defaultValue={this.state.profile.twitter}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.twitter = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label>Instagram</label>
                          <Input placeholder="Instagram" type="text"
                            defaultValue={this.state.profile.instagram}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.instagram = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <label>Pinterest</label>
                          <Input placeholder="Pinterest" type="text"
                            defaultValue={this.state.profile.pinterest}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.pinterest = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label>Linkedin</label>
                          <Input placeholder="Linkedin" type="text"
                            defaultValue={this.state.profile.linkedin}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.linkedin = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label>Facebook</label>
                          <Input placeholder="Facebook" type="text"
                            defaultValue={this.state.facebook}
                            onChange={e => {
                              let newProfile = Object.assign({}, this.state.profile);
                              newProfile.facebook = e.target.value;
                              this.setState({ profile: newProfile });
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn-round"
                          color="primary"
                          type="submit"
                        >
                          Update Profile
                        </Button>
                      </div>
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

export default User;
