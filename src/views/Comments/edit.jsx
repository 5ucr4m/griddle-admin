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
  Label
} from "reactstrap";
import api from "../../services/api";
import { isAuthenticated } from "../../services/auth";
import { Link } from "react-router-dom";

class CommentEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile_id: '',
      description: {},
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
      const response = await api.get(`/comments/${id}`);
      const comment = response.data
      
      this.setState({ comment, id });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      this.props.history.push('/admin/dashboard');
    }

  }
  
  handleUpdateComment = async e => {
    e.preventDefault();
    const { comment } = this.state;
    await api.put(`/comments/${this.state.id}`, { ...comment });
    
    this.setState({
      color: 'success',
      visible: true,
      message: "Comment save!"
    });
  }
  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const { comment } = this.state;
    console.log('====================================');
    console.log(comment);
    console.log('====================================');
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Edit comment</CardTitle>
                </CardHeader>
                <CardBody>
                  {this.state.message && (
                    <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                      {this.state.message}
                    </Alert>
                  )}
                  <Form onSubmit={this.handleUpdateComment}>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>Description</Label>
                          <Input
                            placeholder="Description"
                            type="textarea"
                            value={comment && comment.description}
                            onChange={e => {
                              let newComment = Object.assign({}, comment);
                              newComment.description = e.target.value;
                              this.setState({ comment: newComment });
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
                          Update comment
                        </Button>
                        <Link to={`/admin/pictures/${comment && comment.picture_id}`}>Go back</Link>
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

export default CommentEdit;
