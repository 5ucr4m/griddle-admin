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
import { logout, isAuthenticated } from "../../services/auth";
import { Link } from "react-router-dom";

class OpinionEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      const response = await api.get(`/opinions/${id}`);
      const opinion = response.data
      
      this.setState({ opinion, id });
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
  
  handleUpdateOpinion = async e => {
    e.preventDefault();
    try {
      const { opinion } = this.state;
      await api.put(`/opinions/${this.state.id}`, { ...opinion });
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
      message: "Opinion save!"
    });
  }
  
  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const { opinion } = this.state;
    
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Editing opinion</CardTitle>
                </CardHeader>
                <CardBody>
                  {this.state.message && (
                    <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                      {this.state.message}
                    </Alert>
                  )}
                  <Form onSubmit={this.handleUpdateOpinion}>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>Description</Label>
                          <Input
                            placeholder="Description"
                            type="textarea"
                            value={opinion && opinion.description}
                            onChange={e => {
                              let newOpinion = Object.assign({}, opinion);
                              newOpinion.description = e.target.value;
                              this.setState({ opinion: newOpinion });
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
                          Update opinion
                        </Button>
                        <Link to={'/admin/opinions'}>Go back</Link>
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

export default OpinionEdit;
