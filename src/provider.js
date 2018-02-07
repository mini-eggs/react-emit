import React from "react";
import Context from "./context";
import { addEvent, removeEvent, callEvent } from "./constants/functions";

class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: {},
      element: props.element || window
    };
  }

  get contextFunctions() {
    const emit = (key, fn) => this.emit(key, fn);
    const on = (key, fn) => this.on(key, fn);
    const off = (key, fn) => this.off(key, fn);
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
    return <Context.Provider value={this.contextFunctions} {...this.props} />;
  }
}

export default Provider;
