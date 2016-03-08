import React, {Component, PropTypes} from 'react';
import {Input, Col} from 'react-bootstrap';

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
      <Col xs={this.props.xs} sm={this.props.sm} md={this.props.md} lg={this.props.lg}>
        <Input type={this.props.type} label={this.props.label + (this.props.required
          ? "*"
          : "")} hasFeedback bsStyle={this.props.bsStyle} onChange={this.onChange.bind(this)} value={this.props.value}>{this.props.children}</Input>
      </Col>
    )
  }
}

export default OurInput;

OurInput.propTypes = {
  type: PropTypes.string.isRequired,
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
}

OurInput.defaultProps = {
  type: "text",
  required: false,
  dirty: false
}
