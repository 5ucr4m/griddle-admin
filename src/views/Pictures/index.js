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

class PictureList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      pictures: [],
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
      this.loadPictures();
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

  loadPictures = async () => {
    try {
      const response = await api.get("/pictures");
      this.setState({ pictures: response.data });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  handleRemovePicture = async (id) => {
    await api.delete(`/pictures/${id}`);
    this.setState({
      color: 'success',
      visible: true,
      message: "User deleted!"
    });
    this.loadPictures()
  }

  handleRestorePicture = async (id) => {
    await api.put(`/pictures/${id}/restore`);
    this.setState({
      color: 'success',
      visible: true,
      message: "User restored!"
    });
    this.loadPictures();
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleAdmin = async (id) => {
    await api.put(`/pictures/${id}/toggle-admin`);
  }
  
  render() {
    const { pictures } = this.state;
    const pictureActions = (picture) => {
      if (picture.deleted_at) {
        return (
          <>
            <td>
              <Link className="text-danger" to="#" onClick={() => this.handleRestorePicture(picture.id)}>
                Restore
              </Link>
            </td>
          </>
        )
      } else {
        return (
          <>
            <td>
              <Link className="text-danger" to="#" onClick={() => this.handleRemovePicture(picture.id)}>
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
              <CardTitle tag="h5">Pictures</CardTitle>
              <p className="card-category">List pictures</p>
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
                  {pictures.map(picture => (
                    <tr key={picture.id}>
                      <td>
                        <Link className="text-info" to={`/admin/pictures/${picture.id}`} onClick={() => this.handleRemovePicture(picture.id)}>
                          {picture.name}
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

export default PictureList;
