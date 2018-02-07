import React from "react";
import { create as render } from "react-test-renderer";

import { Provider, Consumer } from "../";

const EmitTestType = "EmitTestType";

/**
 * Emitter.
 */
class EmitComponent extends React.Component {
  handleClick() {
    this.props.emit(this.props.emitName || EmitTestType, {
      title: "=D Count: "
    });
  }

  render() {
    return <button onClick={() => this.handleClick()}>Emit</button>;
  }
}

const EmitComponentConnected = Consumer(EmitComponent);

/**
 * Catcher.
 */
class CatchComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { count: 0, title: "Count: " };

    this.increment = ({ title }) =>
      this.setState(({ count }) => ({ title, count: count + 1 }));
  }

  componentDidMount() {
    this.props.on(this.props.emitName || EmitTestType, this.increment);
  }

  stopListening() {
    this.props.off(this.props.emitName || EmitTestType, this.increment);
  }

  render() {
    return (
      <span>
        {this.state.title}: {this.state.count}
      </span>
    );
  }
}

const CatchComponentConnected = Consumer(CatchComponent);

/**
 * App.
 */
const App = () => (
  <Provider>
    <EmitComponentConnected />
    <CatchComponentConnected />
  </Provider>
);

/**
 * Tests.
 */
describe("Ensure events are passed correctly.", () => {
  it("Test app mounts fine.", () => {
    expect(render(<App />).toJSON()).toMatchSnapshot();
  });

  it("Emits and catches an event correctly.", () => {
    const app = render(<App />);

    const emitter = app.root.findByType(EmitComponent);
    const catcher = app.root.findByType(CatchComponent);

    expect(catcher.instance.state.title).toBe("Count: ");
    expect(catcher.instance.state.count).toBe(0);

    emitter.instance.handleClick();

    expect(catcher.instance.state.title).toBe("=D Count: ");
    expect(catcher.instance.state.count).toBe(1);

    emitter.instance.handleClick();
    emitter.instance.handleClick();

    expect(catcher.instance.state.count).toBe(3);
  });

  it("Removes an event correctly.", () => {
    const app = render(<App />);

    const emitter = app.root.findByType(EmitComponent);
    const catcher = app.root.findByType(CatchComponent);

    expect(catcher.instance.state.count).toBe(0);

    emitter.instance.handleClick();

    expect(catcher.instance.state.count).toBe(1);

    catcher.instance.stopListening();

    emitter.instance.handleClick();
    emitter.instance.handleClick();

    expect(catcher.instance.state.count).toBe(1);
  });

  it("Adds events and removes events correctly with multiple emitters.", () => {
    const app = render(
      <Provider>
        <EmitComponentConnected />
        <EmitComponentConnected />
        <CatchComponentConnected />
      </Provider>
    );

    const emitterOne = app.root.findAllByType(EmitComponent).shift();
    const emitterTwo = app.root.findAllByType(EmitComponent).pop();
    const catcher = app.root.findByType(CatchComponent);

    emitterOne.instance.handleClick();
    emitterTwo.instance.handleClick();

    expect(catcher.instance.state.count).toBe(2);

    catcher.instance.stopListening();

    emitterOne.instance.handleClick();
    emitterTwo.instance.handleClick();

    expect(catcher.instance.state.count).toBe(2);
  });

  it("Adds events and removes events correctly with multiple listeners.", () => {
    const app = render(
      <Provider>
        <EmitComponentConnected />
        <CatchComponentConnected />
        <CatchComponentConnected />
      </Provider>
    );

    const emitter = app.root.findByType(EmitComponent);
    const catcherOne = app.root.findAllByType(CatchComponent).shift();
    const catcherTwo = app.root.findAllByType(CatchComponent).pop();

    emitter.instance.handleClick();

    expect(catcherOne.instance.state.count).toBe(1);
    expect(catcherTwo.instance.state.count).toBe(1);

    catcherOne.instance.stopListening();
    emitter.instance.handleClick();

    expect(catcherOne.instance.state.count).toBe(1);
    expect(catcherTwo.instance.state.count).toBe(2);
  });

  it("Unrelated emits do not interfere with eachother", () => {
    const app = render(
      <Provider>
        <EmitComponentConnected />
        <EmitComponentConnected emitName="bogusEvent" />
        <CatchComponentConnected />
      </Provider>
    );

    const emitterOne = app.root.findAllByType(EmitComponent).shift();
    const emitterTwo = app.root.findAllByType(EmitComponent).pop();
    const catcher = app.root.findByType(CatchComponent);

    emitterTwo.instance.handleClick();
    expect(catcher.instance.state.count).toBe(0);

    emitterOne.instance.handleClick();
    expect(catcher.instance.state.count).toBe(1);
  });

  it("Unrelated handlers do not interfere with eachother", () => {
    const app = render(
      <Provider>
        <EmitComponentConnected />
        <CatchComponentConnected />
        <CatchComponentConnected emitName="bogusEvent" />
      </Provider>
    );

    const emitter = app.root.findByType(EmitComponent);
    const catcherOne = app.root.findAllByType(CatchComponent).shift();
    const catcherTwo = app.root.findAllByType(CatchComponent).pop();

    emitter.instance.handleClick();

    expect(catcherOne.instance.state.count).toBe(1);
    expect(catcherTwo.instance.state.count).toBe(0);
  });
});
