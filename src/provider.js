import { Component } from "react";
import PropTypes from "prop-types";
import CustomEvent from "custom-event";

function addEvent(name, handle) {
  return ({ events }) => {
    if (Array.isArray(events[name])) {
      events[name].push(handle);
    } else {
      events[name] = [handle];
    }
    return { events };
  };
}

function callEvent(handlers) {
  return ({ detail }) => {
    if (Array.isArray(handlers)) {
      handlers.forEach(handle => handle(detail));
    }
  };
}

class EmitProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: {},
      element: props.element || window
    };
  }

  getChildContext() {
    return {
      emit: (name, props) => this.emit(name, props),
      on: (name, handle) => this.on(name, handle)
    };
  }

  emit(name, props) {
    const element = this.state.element;
    const handle = callEvent(this.state.events[name]);
    const event = new CustomEvent(name, { detail: props });
    element.addEventListener(name, handle);
    element.dispatchEvent(event);
    element.removeEventListener(name, handle);
  }

  on(name, handle) {
    this.setState(addEvent(name, handle));
  }

  render() {
    return this.props.children;
  }
}

EmitProvider.childContextTypes = {
  emit: PropTypes.func.isRequired,
  on: PropTypes.func.isRequired
};

export default EmitProvider;
