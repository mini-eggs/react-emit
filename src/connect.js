import { Component, createElement } from "react";
import PropTypes from "prop-types";

function withEmit(component) {
  const wrappedComponent = class extends Component {
    render() {
      return createElement(component, {
        ...this.props,
        emit: this.context.emit,
        on: this.context.on
      });
    }
  };
  wrappedComponent.contextTypes = {
    emit: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired
  };
  return wrappedComponent;
}

export default withEmit;
