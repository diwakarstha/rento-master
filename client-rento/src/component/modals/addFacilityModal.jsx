import { Button, Modal } from "react-bootstrap";
import Form from "../common/form";
import Joi from "joi-browser";
import facility from "../../services/facilityService";
import React from "react";

class AddFacilityModal extends Form {
  state = {
    show: false,
    data: {
      name: "",
      icon: "",
    },
    errors: {},
  };
  schema = {
    name: Joi.string().required().label("Name"),
    icon: Joi.string().label("Icon"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const message = await facility.addFacility(data.name, data.icon);
      this.props.message(message.data);
      this.props.status(200);
      this.setState({ show: false });

      this.setState((prevState) => {
        let data = Object.assign({}, prevState.data);
        data.name = "";
        data.icon = "";
        return { data };
      });
    } catch (ex) {}
  };

  handleClose = () => this.setState({ show: false });

  handleShow = () => this.setState({ show: true });

  render() {
    const { show } = this.state;

    return (
      <React.Fragment>
        <Button
          type="button"
          className="btn-sm btn-primary float-right mx-2 mb-1 mt-2"
          onClick={this.handleShow}
        >
          Add Facility
        </Button>

        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Facility</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit} className="mt-3">
              {this.renderInput("name", "Facility Name", "text", "autoFocus")}
              {this.renderInput("icon", "Icon")}
              {this.renderModalButton("Add", "", this.handleSubmits)}
              {this.renderModalButton("Cancel", "", this.handleClose)}
            </form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default AddFacilityModal;
