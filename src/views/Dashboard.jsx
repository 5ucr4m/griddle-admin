import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Table,
  Alert,
  CustomInput
} from "reactstrap";
import api from "../services/api";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

class Dashboard extends React.Component {
  state = {
    users: [],
    error: "",
    visible: false,
    color: '',
    message: '',
  }
  componentDidMount() {
    try {
      if (!isAuthenticated()) {
        return this.props.history.push('/signin');
      }
      this.loadUsers();
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      this.setState({
        color: 'danger',
        visible: true,
        message:
          "Error"
      });
    }
  }

  loadUsers = async () => {
    try {
      const response = await api.get("/users");
      this.setState({ users: response.data });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  handleRemoveUser = async (id) => {
    await api.delete(`/users/${id}`);
    this.setState({
      color: 'success',
      visible: true,
      message: "User deleted!"
    });
    this.loadUsers()
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleAdmin = async (id) => {
    await api.put(`/users/${id}/toggle-admin`);
  }

  render() {
    const {users} = this.state;

    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Users</CardTitle>
                  <p className="card-category">List users</p>
                </CardHeader>
                <CardBody>
                  {this.state.message && (
                    <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                      {this.state.message}
                    </Alert>
                  )}
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th colSpan="3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.Profile.first_name}</td>
                          <td>{user.Profile.last_name}</td>
                          <td>{user.email}</td>
                          <td>
                            <CustomInput
                              defaultChecked={user.admin}
                              type="switch"
                              id={`exampleCustomSwitch${user.id}`}
                              onChange={() => this.handleAdmin(user.id) }
                            />
                          </td>
                          <td>
                            <Link to={`/admin/user-page/${user.id}/edit`} className="text-warning">
                              <i className="nc-icon nc-settings-gear-65" />
                            </Link>
                          </td>
                          <td>
                            <Link className="text-danger" to="#" onClick={() => this.handleRemoveUser(user.id)}>
                              <i className="nc-icon nc-simple-remove" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
