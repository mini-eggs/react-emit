import { Component } from "react";
import PropTypes from "prop-types";

function addEvent(name, handle) {
  return ({ events }) => {
    const nextEvents = events;
    nextEvents[name] = handle;
    return { events: nextEvents };
  };
}

class EmitProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { events: {} };
  }

  getChildContext() {
    return {
      emit: (name, props) => this.emit(name, props),
      on: (name, handle) => this.on(name, handle)
    };
  }

  emit(name, props) {
    const handle = this.state.events[name];
    if (typeof handle === "function") {
      handle(props);
    }
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
