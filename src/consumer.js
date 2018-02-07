import React from "react";
import Context from "./context";

const consumer = Component => props => (
  <Context.Consumer>
    {state => <Component {...state} {...props} />}
  </Context.Consumer>
);

export default consumer;
