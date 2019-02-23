import React, { Component } from "react";
import ReactDOM from "react-dom";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    Components: undefined
  };
  loadRemoteComponent = url => {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var remoteComponentSrc = request.responseText;
          // eslint-disable-next-line no-new-func
          const fn = Function(`return ${remoteComponentSrc}`);
          // return resolve(fn()(7).default);
          return resolve(fn());
        } else {
          return reject();
        }
      };

      request.open("GET", url);
      request.send();
    });
  };

  findComponent = name => {
    if (!this.state.Components) {
      return undefined;
    }
    let cnt = 1;
    try {
      while (true) {
        const cls = this.state.Components(cnt);
        if (cls.default && cls.default.name === name) {
          return cls.default;
        }
        cnt++;
      }
    } catch {
      return undefined;
    }
  };

  getComponent = async () => {
    const Components = await this.loadRemoteComponent(
      "http://localhost:3000/bundle.js"
    );
    this.setState({ Components });
  };

  componentWillMount() {
    this.getComponent();
  }

  render = () => {
    const Comp = this.findComponent("App");
    return (
      <div className="App" id="app">
        {!Comp && <div>Loading...</div>}
        {Comp && <Comp />}
      </div>
    );
  };
}

export default App;
