# React Emit

#### Why

I love using Vue's event bus. $emit, $on, and $off are very powerful.

I want this for React.

Now you can use Vue's same idea in React with this package's `withEmit` higher-order function. It's as simple as:

```javascript
class MyCoolComponent extends React.Component {
  componentDidMount() {
    this.on("SomeButton:clicked", data => {
      // Our message is available here!
      // Normally you will create this `on` in a different component.
      alert(data.message);
    });
  }

  handleClick() {
    const data = { message: "Some data you wish to pass." };
    this.emit("SomeButton:clicked", data);
  }

  render() {
    return <button onClick={() => this.handleClick()}>Click to Emit</button>;
  }
}

export default withEmit(MyCoolComponent);
```

#### Installation

`npm install --save react-emit`

#### Example

Setup

```javascript
import React from "react";
import { AppRegistry } from "react-native";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { EmitProvider } from "react-emit";

import { component as Explore } from "./scenes/Explore";
import { component as Favorites } from "./scenes/Favorites";
import { component as Hot } from "./scenes/Hot";
import { component as Public } from "./scenes/Public";

const App = () => (
  <EmitProvider>
    <BrowserRouter>
      <Switch>
        <Route path="/explore" component={Explore} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/hot" component={Hot} />
        <Route path="/public" component={Public} />
        <Redirect path="*" to="/explore" />
      </Switch>
    </BrowserRouter>
  </EmitProvider>
);

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", { rootTag: document.getElementById("root") });
```

Usage: emitting an event

```javascript
import React from "react";
import { View, Text, Image } from "react-native";

import { withEmit } from "react-emit";

import Menu from "../static/ic_menu_black_24px.svg";
import Search from "../static/ic_search_black_24px.svg";

const styles = {
  container: {
    height: 42,
    flexDirection: "row"
  },
  title: {
    lineHeight: 42,
    flex: 1,
    textAlign: "center",
    fontSize: 24
  },
  icon: {
    width: 32,
    height: 32,
    margin: 5
  }
};

export const component = withEmit(({ emit, children }) => (
  <View style={styles.container}>
    <Image
      onClick={() => emit("drawer:open")}
      resizeMode="contain"
      style={styles.icon}
      source={Menu}
    />
    <Text style={styles.title}>Header</Text>
    <Image
      onClick={() => emit("search:open")}
      resizeMode="contain"
      style={styles.icon}
      source={Search}
    />
  </View>
));
```

Usage: catching an event

```javascript
import React from "react";
import { Text, Animated, Dimensions, View } from "react-native";

import { withEmit } from "react-emit";

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    width: "100%",
    height: "100%"
  },
  inner: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "blue",
    width: "80%",
    height: "100%"
  }
};

export const component = withEmit(
  class Drawer extends React.unstable_AsyncComponent {
    static openState = { toValue: 0, duration: 250 };
    static closedState = { toValue: -1, duration: 250 };

    constructor(props) {
      super(props);

      this.state = {
        animation: new Animated.Value(-1)
      };

      this.open = () => this.animate(Drawer.openState);
      this.close = () => this.animate(Drawer.closedState);
    }

    componentDidMount() {
      this.props.on("drawer:open", this.open);
      this.props.on("drawer:close", this.close);
    }

    componentWillUnmount() {
      this.props.off("drawer:open", this.open);
      this.props.off("drawer:close", this.close);
    }

    animate(opts) {
      Animated.timing(this.state.animation, opts).start();
    }

    get animatedStyle() {
      const deviceWidth = Dimensions.get("window").width;

      return {
        ...styles.container,
        transform: [
          {
            translateX: this.state.animation.interpolate({
              inputRange: [-1, 0],
              outputRange: [deviceWidth * -1, 0]
            })
          }
        ]
      };
    }

    render() {
      return (
        <Animated.View
          style={this.animatedStyle}
          onClick={() => this.animate(Drawer.closedState)}
        >
          <View style={styles.inner} onClick={e => e.stopPropagation()}>
            <Text>Here we go</Text>
          </View>
        </Animated.View>
      );
    }
  }
);
```
