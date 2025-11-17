import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import App from "./App";
import HomePage from "./components/Home";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/usuario" component={App} />
        <Route path="/administrador" component={App} />
      </Switch>
    </Router>
  );
};

export default Routes;
