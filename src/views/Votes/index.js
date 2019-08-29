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
import Moment from 'react-moment';
import ReactPaginate from 'react-paginate';

class VoteIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      votes: [],
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
      const { picture_id } = this.props;
      this.loadVotes(picture_id);
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

  loadVotes = async () => {
    try {
      const { picture_id } = this.props;
      let response;
      if (picture_id) {
        response = await api.get(
          `/pictures/${picture_id}/votes?page=${this.state.page}&paginate=${this.state.perPage}`
        );
      } else {
        response = await api.get(
          `/votes?page=${this.state.page}&paginate=${this.state.perPage}`
        )
      }
      
      const { pages, total, docs } = response.data;
      this.setState({ votes: docs, pages, total });
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

  handleRemoveVote = async (e, id) => {
    e.preventDefault();
    try {
      await api.delete(`/votes/${id}`);
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
      message: "Vote deleted!"
    });
    
    this.loadVotes()
  }

  handleRestoreVote = async (e, id) => {
    e.preventDefault();

    try {
      await api.put(`/votes/${id}/restore`);
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
      message: "Vote restored!"
    });

    this.loadVotes()
  }

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleAdmin = async (id) => {
    try {
      await api.put(`/votes/${id}/toggle-admin`);
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

  handlePageClick = async data => {
    const { selected } = data;
    let page = selected + 1;
    await this.setState({ page }, () => {
      this.loadVotes();
    });
  };

  render() {
    const { votes } = this.state;
    const voteActions = vote => {
      if (vote.deleted_at) {
        return (
          <>
            <td className="text-center">
              <Link to="#" onClick={e => this.handleRestoreVote(e, vote.id)}>
                <img id={vote.id} src={nCheck} alt="" className="nc-icon" />
              </Link>
            </td>
          </>
        )
      } else {
        return (
          <>
            <td className="text-center">
              <Link to="#" onClick={e => this.handleRemoveVote(e, vote.id)}>
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
              <CardTitle tag="h5">Votes</CardTitle>
              <p className="card-category">Listing votes</p>
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
                    <th>User</th>
                    <th></th>
                    <th colSpan="3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {votes.map(vote => (
                    <tr key={vote.id} style={{ background: (vote.deleted_at ? '#ffeaea' : '') }}>
                      <td>{vote.user && vote.user.profile && vote.user.profile.first_name}</td>
                      <td>
                        {vote.kind} - <Moment format="MM/DD/YYYY HH:MM A" className="description">{vote.createdAt}</Moment>
                      </td>
                      {voteActions(vote)}
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
    )
  }
}

export default VoteIndex;
