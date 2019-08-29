import React from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Table,
  Alert,
  CardFooter
} from "reactstrap";
import { logout, isAuthenticated } from "../../../services/auth";
import api from "../../../services/api";
import { Link } from "react-router-dom";
import binIcon from '../../../assets/img/icons/bin.svg';
import nCheck from '../../../assets/img/icons/n-check.svg';
import bChat from '../../../assets/img/icons/b-chat.svg';
import Moment from 'react-moment';
import ReactPaginate from 'react-paginate';

class PictureIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pictures: [],
      visible: false,
      color: '',
      message: '',
      perPage: 10,
      page: 1,
      total: 0
    }
  }
  
  componentDidMount() {
    try {
      if (!isAuthenticated()) {
        return this.props.history.push('/signin');
      }
      this.loadPictures();
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      this.setState({
        color: 'danger',
        visible: true,
        message: "Error"
      });
    }
  }

  loadPictures = async () => {
    const { id } = this.props.match.params;

    try {
      const responsePictures = await api.get(
        `/users/${id}/pictures?page=${this.state.page}&paginate=${this.state.perPage}`
      );
      const { pages, total, docs } = responsePictures.data;
      
      const responseUser = await api.get(
        `/users/${id}`
      );
      this.setState({ pictures: docs, pages, total, user_id: id, user: responseUser.data });
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

  handleRemovePicture = async (e, id) => {
    e.preventDefault();
    
    const { user_id } = this.state;
    
    try {
      await api.delete(`/users/${user_id}/pictures/${id}`);
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
      message: "Picture deleted!"
    });
    
    this.loadPictures()
  }

  handleRestorePicture = async (e, id) => {
    e.preventDefault();
    
    const { user_id } = this.state;
    
    try {
      await api.put(`/users/${user_id}/pictures/${id}/restore`);
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
      message: "Picture restored!"
    });
    
    this.loadPictures();
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  handlePageClick = async data => {
    const { selected } = data;
    let page = selected + 1;
    await this.setState({ page }, () => {
      this.loadPictures();
    });
  };

  render() {
    const { pictures, user } = this.state;
    let profile;
    if (user) {
      profile = user.profile;
    }
    
    const pictureActions = (picture) => {
      if (picture.deleted_at) {
        return (
          <>
            <td>
              <Link className="text-danger" to="#" onClick={(e) => this.handleRestorePicture(e, picture.id)}>
                <img src={nCheck} alt="" className="nc-icon" />
              </Link>
            </td>
          </>
        )
      } else {
        return (
          <>
            <td>
              <Link className="text-danger" to="#" onClick={(e) => this.handleRemovePicture(e, picture.id)}>
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
                <CardTitle tag="h5">Pictures</CardTitle>
                <p className="card-category">Listing pictures from <strong>{profile && profile.first_name}</strong></p>
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
                      <th>Name</th>
                      <th>Created at</th>
                      <th colSpan="2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pictures.map(picture => (
                      <tr key={picture.id} style={{ background: (picture.deleted_at ? '#ffeaea' : '') }}>
                        <td>{picture.name}</td>
                        <td>
                          <Moment format="MM/DD/YYYY HH:mm A">
                            {picture.createdAt}
                          </Moment>
                        </td>
                        <td>
                          <Link className="text-info" to={`/admin/pictures/${picture.id}`} >
                            <img src={bChat} alt="" className="nc-icon" />
                          </Link>
                        </td>
                        {pictureActions(picture)}
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
            <Link to='/admin/users'>Go back</Link>
          </Col>
        </Row>
      </div>
    )
  }
}

export default PictureIndex;
