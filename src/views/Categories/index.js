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
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { logout, isAuthenticated } from "../../services/auth";
import binIcon from "../../assets/img/icons/bin.svg";
import nCheck from "../../assets/img/icons/n-check.svg";
import Moment from "react-moment";

class CategoryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      visible: false,
      description: "",
      disabled: false,
      modalVisible: false
    };
  }
  componentDidMount() {
    try {
      if (!isAuthenticated()) {
        return this.props.history.push("/signin");
      }
      this.loadCategories();
    } catch (error) {
      this.setState({
        color: "danger",
        visible: true,
        message: "Error"
      });
    }
  }

  loadCategories = async () => {
    try {
      const response = await api.get(`/categories?all=true`);
      const { data } = response;
      this.setState({ categories: data });
    } catch (error) {
      const { response } = error;
      if (response) {
        const { error } = response.data;
        if (error === "Token invalid") {
          logout();
        }
      }
    }
  };

  toggle = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  createCategory = async () => {
    this.setState({ disabled: true });
    try {
      const { description } = this.state;
      await api.post(`/categories`, { description });
      this.toggle();
      this.loadCategories();
      this.setState({ disabled: false });
    } catch (error) {
      const { response } = error;
      if (response) {
        const { error } = response.data;
        if (error === "Token invalid") {
          logout();
        }
      }
    }
  };

  handleRemoveCategory = async (e, id) => {
    e.preventDefault();
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      const { response } = error;
      if (response) {
        const { error } = response.data;
        if (error === "Token invalid") {
          logout();
        }
      }
    }
    this.setState({
      color: "success",
      visible: true,
      message: "category deleted!"
    });
    this.loadCategories();
  };

  handleRestoreCategory = async (e, id) => {
    e.preventDefault();
    try {
      await api.put(`/categories/${id}/restore`);
    } catch (error) {
      const { response } = error;
      if (response) {
        const { error } = response.data;
        if (error === "Token invalid") {
          logout();
        }
      }
    }

    this.setState({
      color: "success",
      visible: true,
      message: "Category restored!"
    });
    this.loadCategories();
  };

  onDismiss = () => {
    this.setState({ visible: !this.state.visible });
  };

  handlePageClick = async data => {
    const { selected } = data;
    let page = selected + 1;
    await this.setState({ page }, () => {
      this.loadCategories();
    });
  };

  render() {
    const { categories } = this.state;
    const categoriesActions = categories => {
      if (categories.deleted_at) {
        return (
          <>
            <td>
              <Link
                className="text-danger"
                to="#"
                onClick={e => this.handleRestoreCategory(e, categories.id)}
              >
                <img src={nCheck} alt="" className="nc-icon" />
              </Link>
            </td>
          </>
        );
      } else {
        return (
          <>
            <td>
              <Link
                className="text-danger"
                to="#"
                onClick={e => this.handleRemoveCategory(e, categories.id)}
              >
                <img src={binIcon} alt="" className="nc-icon" />
              </Link>
            </td>
          </>
        );
      }
    };

    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Categories</CardTitle>
                <p className="card-category">List categories</p>
                <Button onClick={() => this.toggle()} color="primary">
                  New Category
                </Button>
              </CardHeader>
              <CardBody>
                {this.state.message && (
                  <Alert
                    color={this.state.color}
                    isOpen={this.state.visible}
                    toggle={this.onDismiss}
                  >
                    {this.state.message}
                  </Alert>
                )}
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Description</th>
                      <th>Created at</th>
                      <th colSpan="2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(categories => (
                      <tr
                        key={categories.id}
                        style={{
                          background: categories.deleted_at ? "#ffeaea" : ""
                        }}
                      >
                        <td>{categories.description}</td>
                        <td>
                          <Moment format="MM/DD/YYYY HH:mm A">
                            {categories.createdAt}
                          </Moment>
                        </td>
                        {categoriesActions(categories)}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.modalVisible} toggle={() => this.toggle()}>
          <ModalHeader toggle={() => this.toggle()}>
            Create new category
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                placeholder="Description"
                value={this.state.description}
                onChange={evt =>
                  this.setState({ description: evt.target.value })
                }
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={
                this.state.disabled || this.state.description.length < 3
              }
              onClick={() => this.createCategory()}
            >
              Save
            </Button>{" "}
            <Button color="secondary" onClick={() => this.toggle()}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CategoryList;
