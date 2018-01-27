import React from "react";
import PropTypes from "prop-types";
import CustomEvent from "custom-event";

const addEvent = (key, handle) => ({ events }) => ({
  events: {
    ...events,
    [key]: [...(events[key] || []), handle]
  }
});

const removeEvent = (key, handle) => ({ events }) => ({
  events: Object.keys(events).reduce(
    (total, currentKey) =>
      currentKey === key && handle === events[key]
        ? { ...total }
        : { ...total, [key]: events[key] },
    {}
  )
});

const callEvent = (handlers = []) => ({ detail }) =>
  handlers.forEach(handle => handle(detail));

class EmitProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: {},
      element: props.element || window
    };
  }

  getChildContext() {
    const emit = (name, props) => this.emit(name, props);
    const on = (name, handle) => this.on(name, handle);
    const off = (name, handle) => this.off(name, handle);
    return { emit, on, off };
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

  off(name, handle) {
    this.setState(removeEvent(name, handle));
  }

  render() {
    return React.createElement(React.Fragment, null, this.props.children);
  }
}

EmitProvider.childContextTypes = {
  emit: PropTypes.func.isRequired,
  on: PropTypes.func.isRequired,
  off: PropTypes.func.isRequired
};

export default EmitProvider;
