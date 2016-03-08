import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';

class OurForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fieldsDirty: {},
      formDirty: false
    };
  }

  recursiveValidateChildren(children) {

    let result = 0;
    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        if (child.props && child.props.label) {
          let value = this.props.valueObject[child.props.name];
          if (child.props.required && (!value || value == '')) {
            result++
          }
          else if (value && !value == '' && child.props.validator && !child.props.validator(value)) {
            result++
          }
        }
        if (child.props && child.props.children) {
          result += this.recursiveValidateChildren(child.props.children);
        }
      }
    });

    return result;

  }

  recursiveCloneChildren(children) {
    return React.Children.map(children, child => {
      if (!React.isValidElement(child))
        return child;
      var childProps = {};

      if (child.props.label) {
        childProps['onChange'] = this.onChange.bind(this, child.props.name);
        childProps['value'] = this.props.valueObject[child.props.name];
        childProps['bsStyle'] = this.getBsStyle(child, this.props.valueObject[child.props.name]);
      }

      childProps.children = this.recursiveCloneChildren(child.props.children);

      return React.cloneElement(child, childProps);
    })
  }

  getBsStyle(element, value) {
    if (!this.state.fieldsDirty[element.props.name] && !element.props.dirty && !this.state.formDirty) {
      return null;
    }
    if ((!value || value == '') && !element.props.required) {
      return null;
    }

    let status;
    if (element.props.required && (!value || value == '')) {
      status = "warning";
    } else if (value && value != '' && element.props.validator && !element.props.validator(value)) {
      status = "error";
    } else {
      status = "success"
    }
    return status;
  }

  onChange(name, val) {

    this.setState(update(this.state, {
      fieldsDirty: {
        [name]: {
          $set: true
        }
      }
    }));

    this.props.onChange(name, val);
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({formDirty: true});
    if(this.recursiveValidateChildren(this.props.children) == 0) {
      this.props.onSubmit(event);
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>{this.recursiveCloneChildren(this.props.children)}</form>
    )
  }

}

export default OurForm;

OurForm.propTypes = {
  onChange: PropTypes.func,
  valueObject: PropTypes.object
}
