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
import widgetIcon from '../../assets/img/icons/widget.svg';

class CommentIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      visible: false,
      color: '',
      message: '',
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
      const response = await api.get("/comments");
      this.setState({ comments: response.data });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  handleRemoveComment = async (e, id) => {
    await api.delete(`/comments/${id}`);
    this.setState({
      color: 'success',
      visible: true,
      message: "User deleted!"
    });
    this.loadComments()
  }

  handleRestoreComment = async (e, id) => {
    await api.put(`/comments/${id}/restore`);
    this.setState({
      color: 'success',
      visible: true,
      message: "User restored!"
    });
    this.loadComments();
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleAdmin = async (id) => {
    await api.put(`/comments/${id}/toggle-admin`);
  }

  render() {
    const { comments } = this.state;
    const pictureActions = (picture) => {
      if (picture.deleted_at) {
        return (
          <>
            <td>
              <Link className="text-danger" onClick={(e) => this.handleRestoreComment(e, picture.id)}>
                Restore
              </Link>
            </td>
          </>
        )
      } else {
        return (
          <>
            <td>
              <Link className="text-danger" onClick={() => this.handleRemoveComment(picture.id)}>
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
              <p className="card-category">List comments</p>
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
                    <th colSpan="3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map(picture => (
                    <tr key={picture.id}>
                      <td>{picture.name}</td>
                      <td>
                        <Link
                          className="text-danger"
                          to={`/admin/comments/${picture.id}`}
                          onClick={(e) => this.handleRemoveComment(e, picture.id)}>
                          <img src={widgetIcon} alt="" />
                        </Link>
                      </td>
                      {pictureActions(picture)}
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
