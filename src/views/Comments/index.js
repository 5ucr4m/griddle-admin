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
} from "reactstrap";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { isAuthenticated } from "../../services/auth";
import binIcon from '../../assets/img/icons/bin.svg';
import nCheck from '../../assets/img/icons/n-check.svg';
import pencilIcon from '../../assets/img/icons/pencil.svg';
import Moment from 'react-moment';

class CommentIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      visible: false,
      color: '',
      message: '',
      picture_id: null
    }
  }

  componentDidMount() {
    try {
      if (!isAuthenticated()) {
        return this.props.history.push('/signin');
      }
      this.loadComments();
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      this.setState({
        color: 'danger',
        visible: true,
        message: 'Error'
      });
    }
  }

  loadComments = async () => {
    try {
      const { picture_id } = this.props;
      let response;
      if (picture_id) {
        response = await api.get(`/pictures/${picture_id}/comments`);
      } else {
        response = await api.get("/comments")
      }
      this.setState({ comments: response.data });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
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

    this.loadComments()
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleAdmin = async (id) => {
    await api.put(`/comments/${id}/toggle-admin`);
  }

  render() {
    const { comments } = this.state;
    const commentActions = comment => {
      if (comment.deleted_at) {
        return (
          <>
            <td>
              <Link to="#" className="text-danger" onClick={e => this.handleRestoreComment(e, comment.id)}>
                <img id={comment.id} src={nCheck} alt="" className="nc-icon" />
              </Link>
            </td>
          </>
        )
      } else {
        return (
          <>
            <td>
              <Link to="#" className="text-danger" onClick={e => this.handleRemoveComment(e, comment.id)}>
                <img src={binIcon} alt="" className="nc-icon" />
              </Link>
            </td>
          </>
        )
      }
    }

    return (
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Comments</CardTitle>
              <p className="card-category">Listing comments</p>
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
                    <th>Description</th>
                    <th colSpan="3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map(comment => (
                    <tr key={comment.id} style={{ background: (comment.deleted_at ? '#ffeaea' : '') }}>
                      <td>
                        {comment.description} - <Moment format="MM/DD/YYYY HH:MM A" className="description">{comment.createdAt}</Moment>
                      </td>
                      <td>
                        <Link to={`/admin/comments/${comment.id}/edit`} className="text-warning">
                          <img id={comment.id} src={pencilIcon} alt="" className="nc-icon" />
                        </Link>
                      </td>
                      {commentActions(comment)}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}

export default CommentIndex;
