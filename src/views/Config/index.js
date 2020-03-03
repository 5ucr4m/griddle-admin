import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Table,
  Alert,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";

import api from "../../services/api";
import editIcon from "../../assets/img/icons/pencil.svg";
import { logout, isAuthenticated } from "../../services/auth";

function Configurations(props) {
  const [state, setState] = useState({
    data: [],
    visible: false,
    modalVisible: false,
    selectedConfig: null,
    newValue: null,
    color: "",
    message: "",
    perPage: 10,
    page: 1,
    total: 0
  });

  useEffect(() => {
    try {
      if (!isAuthenticated()) {
        return props.history.push("/signin");
      }
      loadConfigs();
    } catch (error) {
      setState({
        ...state,
        color: "danger",
        visible: true,
        message: "Error"
      });
    }
  }, []);

  async function loadConfigs() {
    try {
      const response = await api.get(`/config`);
      const { data } = response;
      setState({ ...state, data, modalVisible: false });
    } catch (error) {
      const { response } = error;
      if (response) {
        const { error } = response.data;
        if (error === "Token invalid") {
          logout();
        }
      }
    }
  }

  function toggle() {
    setState({ ...state, visible: !state.visible });
  }

  function toggleModal(data) {
    setState({
      ...state,
      selectedConfig: data,
      newValue: null,
      modalVisible: !state.modalVisible
    });
  }

  async function save() {
    const { id } = state.selectedConfig;
    const value = state.newValue;
    try {
      await api.put(`/config/${id}`, { value });
      loadConfigs();
    } catch (e) {}
  }

  const { data } = state;
  const configActions = data => {
    return (
      <>
        <td>
          <Link className="text-danger" to="#" onClick={e => toggleModal(data)}>
            <img src={editIcon} alt="" className="nc-icon" />
          </Link>
        </td>
      </>
    );
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Configurations</CardTitle>
            </CardHeader>
            <CardBody>
              {state.message && (
                <Alert
                  color={state.color}
                  isOpen={state.visible}
                  toggle={toggle}
                >
                  {state.message}
                </Alert>
              )}
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th colSpan="2">Description</th>
                    <th>Value</th>
                    <th colSpan="2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(config => (
                    <tr
                      key={config.id}
                      style={{
                        background: config.deleted_at ? "#ffeaea" : ""
                      }}
                    >
                      <td colSpan="2">{config.description}</td>
                      <td>{config.value}</td>
                      {configActions(config)}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={state.modalVisible && !!state.selectedConfig}
        toggle={() => toggle()}
      >
        <ModalHeader toggle={() => toggle()}>Create new category</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="value">
              {!!state.selectedConfig && state.selectedConfig.description}
            </Label>
            <Input
              type="text"
              name="value"
              id="value"
              placeholder="Value"
              value={state.value}
              onChange={evt =>
                setState({ ...state, newValue: evt.target.value })
              }
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            // disabled={state.disabled}
            onClick={() => save()}
          >
            Save
          </Button>{" "}
          <Button color="secondary" onClick={() => toggleModal()}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Configurations;
