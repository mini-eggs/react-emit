import React from "react";
import { render } from "react-dom";
import { EmitProvider, withEmit } from "react-emit";

class TestOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: undefined };
  }
  componentWillMount() {
    this.props.on("test", h => this.handleEvent(h));
  }
  handleEvent({ message }) {
    this.setState(() => ({ message }));
  }
  render() {
    const { message } = this.state;
    const displayMessage = message ? message : "No message.";
    return (
      <div>
        <div>Component one</div>
        <div>
          {displayMessage}
        </div>
      </div>
    );
  }
}
const TestOneEmit = withEmit(TestOne);

class TestTwo extends React.Component {
  handleClick() {
    this.props.emit("test", { message: "Success." });
  }
  render() {
    return (
      <div>
        <div>Component two</div>
        <button onClick={() => this.handleClick()}>trigger emit event</button>
      </div>
    );
  }
}
const TestTwoEmit = withEmit(TestTwo);

function Example() {
  return (
    <EmitProvider>
      <div>
        <TestOneEmit />
        <TestTwoEmit />
      </div>
    </EmitProvider>
  );
}

render(<Example />, document.getElementById("root"));
