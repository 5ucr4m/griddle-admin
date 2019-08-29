import React from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardImg,
  Alert,
} from "reactstrap";
import { logout, isAuthenticated } from "../../services/auth";
import api from "../../services/api";
import road from '../../assets/img/road.jpg'
import { Link } from "react-router-dom";
import CommentIndex from '../Comments';
import VoteIndex from '../Votes';

class PictureShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      picture: {},
      comments: [],
      color: '',
      visible: false,
      message: ""
    }
  }
  componentDidMount() {
    try {
      if (!isAuthenticated()) {
        return this.props.history.push('/signin');
      }
      this.getPicture();
    } catch (error) {

      const { response } = error
      if (response) {
        const { error } = response.data
        if (error === 'Token invalid') {
          logout()
        }
      }

      this.setState({
        color: 'danger',
        visible: true,
        message: "Error"
      });
    }
  }
  getPicture = async () => {
    try {
      const { id } = this.props.match.params;
      const response = await api.get(`/pictures/${id}`);
      this.setState({ picture: response.data, id });
      this.loadComments();
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
  loadComments = async () => {
    try {
      const response = await api.get(`/pictures/${this.state.id}/comments`);
      this.setState({ comments: response.data });
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
  handleRemoveComment = async (e, id) => {
    e.preventDefault();
    try {
      await api.delete(`/comments/${id}`);
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
      message: "Comment deleted!"
    });
    this.loadComments()
  }
  handleRestoreComment = async (e, id) => {
    e.preventDefault();
    try {
      await api.put(`/comments/${id}/restore`);
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
      message: "Comment restored!"
    });
    this.loadComments();
  }
  render() {
    const { picture, id } = this.state;
    const { user } = picture;
    let profile;
    if (user) {
      profile = user.profile;
    }
    
    return (
      <div className="content">
        <Row>
          <Col md="4">
            <Card>
              {this.state.message && (
                <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                  {this.state.message}
                </Alert>
              )}
              <CardHeader>
                <CardTitle tag="h5">{picture.name}</CardTitle>
                <p className="card-category">Showing picture from <strong>{profile && profile.first_name}</strong></p>
                <CardImg top style={{width: 'auto'}} src={road} alt="..." />
              </CardHeader>
              <CardBody>
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            {id && <VoteIndex picture_id={id} />}
          </Col>
        </Row>
        <h2>Comments</h2>
        <Row>
          <Col md="12">
            {id && <CommentIndex picture_id={id} />}
            <Link to='/admin/dashboard'>Go back</Link>
          </Col>
        </Row>
      </div>
    )
  }
};

export default PictureShow;