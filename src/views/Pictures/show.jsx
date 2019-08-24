import React from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardImg,
  CardText,
  CardFooter,
  Alert,
} from "reactstrap";
import Moment from 'react-moment';
import { isAuthenticated } from "../../services/auth";
import api from "../../services/api";
import road from '../../assets/img/road.jpg'
import { Link } from "react-router-dom";
import binIcon from '../../assets/img/icons/bin.svg';
import pencilIcon from '../../assets/img/icons/pencil.svg';

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
  getPicture = async () => {
    try {
      const { id } = this.props.match.params;
      const response = await api.get(`/pictures/${id}`);
      this.setState({ picture: response.data, id });
      this.loadComments();
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }
  loadComments = async () => {
    const response = await api.get(`/pictures/${this.state.id}/comments`);
    this.setState({ comments: response.data });
  }
  handleRemoveComment = async (e, id) => {
    e.preventDefault();
    await api.delete(`/comments/${id}`);
    this.setState({
      color: 'success',
      visible: true,
      message: "Comment deleted!"
    });
    this.loadComments()
  }
  handleRestoreComment = async (e, id) => {
    e.preventDefault();
    await api.put(`/comments/${id}/restore`);
    this.setState({
      color: 'success',
      visible: true,
      message: "Comment restored!"
    });
    this.loadComments();
  }
  render() {
    const { comments, picture } = this.state;
    const commentActions = (comment) => {
      if (comment.deleted_at) {
        return (
          <Link to="#" onClick={(e) => this.handleRestoreComment(e, comment.id)}>
            Restore
          </Link>
        )
      } else {
        return (
          <Link to="#" onClick={(e) => this.handleRemoveComment(e, comment.id)}>
            <img src={binIcon} alt="" className="nc-icon" />
          </Link>
        )
      }
    }
    
    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              {this.state.message && (
                <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                  {this.state.message}
                </Alert>
              )}
              <CardHeader>
                <p className="card-category">{picture.name}</p>
                <CardImg top style={{width: 'auto'}} src={road} alt="..." />
              </CardHeader>
              <CardBody>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <h2>Comments</h2>
        <Row>
          <Col md="12">
            {comments.map(comment => (
              <Card key={comment.id}>
                <CardBody>
                  <CardTitle className="user-info">
                    <h3 className="text-success">{comment.user && comment.user.email}</h3>
                  </CardTitle>
                  <CardText>
                    {comment.description} - <span className="description"><Moment toNow>{comment.createdAt}</Moment></span>
                  </CardText>
                </CardBody>
                <CardFooter>
                  <Link to={`/admin/comments/${comment.id}/edit`} className="text-warning">
                    <img id={comment.id} src={pencilIcon} alt="" className="nc-icon" />
                  </Link>
                  {commentActions(comment)}
                </CardFooter>
              </Card>
            ))}
            <Link to='/admin/dashboard'>Go back</Link>
          </Col>
        </Row>
      </div>
    )
  }
};

export default PictureShow;