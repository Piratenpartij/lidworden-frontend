import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Col } from "react-bootstrap";

class OurInput extends Component {
  onChange(event) {
    if (this.props.modifier) {
      let modifiedValue = this.props.modifier(event.target.value);
      if (modifiedValue != event.target.value) {
        event.target.value = modifiedValue;
      }
    }

    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  }

  render() {
    return (
      <Col
        xs={this.props.xs}
        sm={this.props.sm}
        md={this.props.md}
        lg={this.props.lg}
      >
        <Form.Group style={{ marginBottom: 16 }}>
          <label className="control-label">
            {this.props.label + (this.props.required ? "*" : "")}
          </label>
          <Form.Control
            isValid={this.props.bsStyle === "success"}
            isInvalid={
              this.props.bsStyle === "warning" || this.props.bsStyle === "error"
            }
            type={this.props.type}
            as={this.props.as}
            onChange={this.onChange.bind(this)}
            value={this.props.value}
          >
            {this.props.children}
          </Form.Control>
        </Form.Group>
      </Col>
    );
  }
}

export default OurInput;

OurInput.propTypes = {
  type: PropTypes.string.isRequired,
  as: PropTypes.string,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  validator: PropTypes.func,
  modifier: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  name: PropTypes.string.isRequired,
  bsStyle: PropTypes.string,
  dirty: PropTypes.bool
};

OurInput.defaultProps = {
  type: "text",
  required: false,
  dirty: false
};
