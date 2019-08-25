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

class OpinionIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opinions: [],
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
      this.loadOpinions();
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

  loadOpinions = async () => {
    try {
      const { picture_id } = this.props;
      let response;
      if (picture_id) {
        response = await api.get(`/pictures/${picture_id}/opinions`);
      } else {
        response = await api.get("/opinions")
      }
      this.setState({ opinions: response.data });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  handleRemoveOpinion = async (e, id) => {
    e.preventDefault();
    await api.delete(`/opinions/${id}`);
    this.setState({
      color: 'success',
      visible: true,
      message: "Comment deleted!"
    });
    
    this.loadOpinions();
  }

  handleRestoreOpinion = async (e, id) => {
    e.preventDefault();
    await api.put(`/opinions/${id}/restore`);
    this.setState({
      color: 'success',
      visible: true,
      message: "Comment restored!"
    });

    this.loadOpinions();
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleAdmin = async (id) => {
    await api.put(`/opinions/${id}/toggle-admin`);
  }

  render() {
    const { opinions } = this.state;
    const opinionActions = opinion => {
      if (opinion.deleted_at) {
        return (
          <>
            <td>
              <Link to="#" className="text-danger" onClick={e => this.handleRestoreOpinion(e, opinion.id)}>
                <img id={opinion.id} src={nCheck} alt="" className="nc-icon" />
              </Link>
            </td>
          </>
        )
      } else {
        return (
          <>
            <td>
              <Link to="#" className="text-danger" onClick={e => this.handleRemoveOpinion(e, opinion.id)}>
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
              <CardTitle tag="h5">Feedback</CardTitle>
              <p className="card-category">Listing opinions</p>
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
                  {opinions.map(opinion => (
                    <tr key={opinion.id} style={{ background: (opinion.deleted_at ? '#ffeaea' : '') }}>
                      <td>
                        {opinion.description} - <Moment format="MM/DD/YYYY HH:MM A" className="description">{opinion.createdAt}</Moment>
                      </td>
                      <td>
                        <Link to={`/admin/opinions/${opinion.id}/edit`} className="text-warning">
                          <img id={opinion.id} src={pencilIcon} alt="" className="nc-icon" />
                        </Link>
                      </td>
                      {opinionActions(opinion)}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      </div>
    )
  }
}

export default OpinionIndex;
