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
import { Link } from "react-router-dom";
import api from "../../services/api";
import { logout, isAuthenticated } from "../../services/auth";
import binIcon from '../../assets/img/icons/bin.svg';
import nCheck from '../../assets/img/icons/n-check.svg';
import pencilIcon from '../../assets/img/icons/pencil.svg';
import Moment from 'react-moment';
import ReactPaginate from 'react-paginate';

class OpinionIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opinions: [],
      visible: false,
      color: '',
      message: '',
      picture_id: null,
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
      this.loadOpinions();
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
        message: 'Error'
      });
    }
  }

  loadOpinions = async () => {
    try {
      const { picture_id } = this.props;
      
      let response;
      if (picture_id) {
        response = await api.get(
          `/pictures/${picture_id}/opinions?page=${this.state.page}&paginate=${this.state.perPage}`
        );
      } else {
        response = await api.get(
          `/opinions?page=${this.state.page}&paginate=${this.state.perPage}`
        )
      }
      
      const { pages, total, docs } = response.data;
      this.setState({ opinions: docs, pages, total });
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

  handleRemoveOpinion = async (e, id) => {
    e.preventDefault();
    try {
      await api.delete(`/opinions/${id}`);
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
    
    this.loadOpinions();
  }

  handleRestoreOpinion = async (e, id) => {
    e.preventDefault();
    try {
      await api.put(`/opinions/${id}/restore`);
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

    this.loadOpinions();
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  handlePageClick = async data => {
    const { selected } = data;
    let page = selected + 1;
    await this.setState({ page }, () => {
      this.loadOpinions();
    });
  };

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
              <p className="card-category">Listing feedback</p>
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

export default OpinionIndex;
