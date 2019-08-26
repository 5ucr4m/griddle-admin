import React from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Table,
  Alert,
  CustomInput,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Form
} from "reactstrap";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { isAuthenticated } from "../../services/auth";
import pencilIcon from '../../assets/img/icons/pencil.svg';
import binIcon from '../../assets/img/icons/bin.svg';
import nCheck from '../../assets/img/icons/n-check.svg';
import nImage from '../../assets/img/icons/image.svg';
import Moment from 'react-moment';
import ReactPaginate from 'react-paginate';

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false,
      users: [],
      error: "",
      visible: false,
      color: '',
      message: '',
      perPage: 10,
      page: 1,
      total: 0,
      by_first_name: ''
    };
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

  loadUsers = async (by_first_name) => {
    try {
      let path = `/users?page=${this.state.page}&paginate=${this.state.perPage}`;
      
      if (by_first_name) {
        path = path + `&by_first_name=${by_first_name}`;
      }
      
      const response = await api.get(path);
      const { pages, total, docs } = response.data;
      
      this.setState({ users: docs, pages, total });
      
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  handleRemoveUser = async (e, id) => {
    e.preventDefault();
    await api.delete(`/users/${id}`);
    this.setState({
      color: 'success',
      visible: true,
      message: "User deleted!"
    });
    this.loadUsers()
  }

  handleRestoreUser = async (e, id) => {
    e.preventDefault();
    await api.put(`/users/${id}/restore`);
    this.setState({
      color: 'success',
      visible: true,
      message: "User restored!"
    });
    this.loadUsers();
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleAdmin = async id => {
    await api.put(`/users/${id}/toggle-admin`);
  }

  handlePageClick = async data => {
    const { selected } = data;
    let page = selected + 1;
    await this.setState({ page }, () => {
      this.loadUsers();
    });
  };

  handleSearch = async e => {
    e.preventDefault();
    const { by_first_name } = this.state;
    // await api.put(`/profiles/${profile.id}`, { ...profile });

    // this.setState({
    //   color: 'success',
    //   visible: true,
    //   message: "Profile save!"
    // });
    this.loadUsers(by_first_name);
  }

  render() {
    const { users } = this.state;
    const userActions = (user) => {
      if (user.deleted_at) {
        return (
          <>
            <td>
              <Link className="text-danger" to="#" onClick={(e) => this.handleRestoreUser(e, user.id)}>
                <img src={nCheck} alt="" className="nc-icon" />
              </Link>
            </td>
          </>
        )
      } else {
        return (
          <>
            <td>
              <Link className="text-danger" to="#" onClick={(e) => this.handleRemoveUser(e, user.id)}>
                <img src={binIcon} alt="" className="nc-icon" />
              </Link>
            </td>
          </>
        )
      }
    }
    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="8">
                    <CardTitle tag="h5">Users</CardTitle>
                    <p className="card-category">List users</p>
                  </Col>
                  <Col md="4">
                    <Form onSubmit={this.handleSearch}>
                      <InputGroup className="no-border">
                        <Input
                          placeholder="Search by first name..."
                          type="text"
                          onChange={e => this.setState({ by_first_name: e.target.value })}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>
                            <i className="nc-icon nc-zoom-split" />
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </Form>
                  </Col>
                </Row>
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
                      <th>Created at</th>
                      <th>Admin</th>
                      <th colSpan="4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ background: (user.deleted_at ? '#ffeaea' : '') }}>
                        <td>{user.profile && user.profile.first_name}</td>
                        <td>{user.profile && user.profile.last_name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Moment format="MM/DD/YYYY HH:mm A">
                            {user.createdAt}
                          </Moment>
                        </td>
                        <td>
                          <CustomInput
                            defaultChecked={user.admin}
                            type="switch"
                            id={`exampleCustomSwitch${user.id}`}
                            onChange={() => this.handleAdmin(user.id)}
                          />
                        </td>
                        <td>
                          <Link to={`/admin/users/${user.id}/edit`} className="text-warning">
                            <img src={pencilIcon} alt="" className="nc-icon" />
                          </Link>
                        </td>
                        {userActions(user)}
                        <td>
                          <Link to={`/admin/users/${user.id}/pictures`} className="text-success">
                            <img src={nImage} alt="" className="nc-icon" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <ReactPaginate
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  pageCount={this.state.pages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={this.state.total}
                  onPageChange={this.handlePageClick}
                  breakClassName={'break-me'}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'page-item active'}
                  previousClassName="page-item"
                  nextClassName="page-item"
                  previousLinkClassName="page-link"
                  nextLinkClassName="page-link"
                  pageLinkClassName="page-link"
                />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default UserList;
