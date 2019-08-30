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
} from "reactstrap";
import api from "../../services/api";
import { logout, isAuthenticated } from "../../services/auth";
import { Link } from "react-router-dom";

class UserEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile_id: '',
      user: {},
      profile: {},
      message: '',
      visible: false,
      color: ''
    }
  }

  async componentDidMount() {
    try {
      if (!isAuthenticated()) {
        return this.props.history.push('/signin');
      }
      const { id } = this.props.match.params;
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      const { profile } = user;
      
      this.setState({ user, profile });
    } catch (error) {
      const { response } = error
      if (response) {
        const { error } = response.data
        if (error === 'Token invalid') {
          logout()
        }
      }
    }

  }
  
  handleUpdateProfile = async e => {
    e.preventDefault();
    const { profile } = this.state;
    try {
      await api.put(`/profiles/${profile.id}`, { ...profile });
    } catch (error) {
      const { response } = error
      if (response) {
        const { error } = response.data
        if (error === 'Token invalid') {
          logout()
        }
      }
    }
    
    this.setState({
      color: 'success',
      visible: true,
      message: "Profile save!"
    });
  }
  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const { user } = this.state;
    const { profile } = user;

    return (
      <>
        <div className="content">
          <Row>
            <Col md="4">
              <Card className="card-user">
                <div className="image">
                  <img
                    alt="..."
                    src={require("assets/img/damir-bosnjak.jpg")}
                  />
                </div>
                <CardBody>
                  <div className="author">
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar border-gray"
                        src={profile && profile.profile_picture ? profile.profile_picture : require("assets/img/default-avatar.png")}
                      />
                      <h5 className="title">{profile && profile.first_name}</h5>
                    </a>
                    <p className="description">{user.email}</p>
                  </div>
                  {/* <p className="description text-center">
                    "I like the way you work it <br />
                    No diggity <br />I wanna bag it up"
                  </p> */}
                </CardBody>
              </Card>
            </Col>
            <Col md="8">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Editing Profile</CardTitle>
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
                            defaultValue={profile && profile.first_name}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.last_name}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.street}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.number}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.city}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.county}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.state}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.phone}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.twitter}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.instagram}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.pinterest}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.linkedin}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                            defaultValue={profile && profile.facebook}
                            onChange={e => {
                              let newProfile = Object.assign({}, profile);
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
                        <Link to="/admin/dashboard">Go back</Link>
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

export default UserEdit;
