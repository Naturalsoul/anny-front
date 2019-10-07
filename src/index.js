/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBuilding,
  faUsers,
  faEdit,
  faTrashAlt,
  faSearch,
  faFileInvoiceDollar,
  faPlus,
  faSave,
  faEnvelope,
  faCog,
  faSignOutAlt,
  faMinusCircle,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.1.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.jsx";
import Login from "views/Login";

library.add(
  faBuilding,
  faUsers,
  faEdit,
  faTrashAlt,
  faSearch,
  faFileInvoiceDollar,
  faPlus,
  faSave,
  faEnvelope,
  faCog,
  faSignOutAlt,
  faMinusCircle,
  faPlusCircle,
);
const hist = createBrowserHistory();

const httpLink = {
  uri: 'http://localhost:4000/graphql',
};

const client = new ApolloClient({
  link: new HttpLink(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router history={hist}>
      <Switch>
        <Route path='/login' component={Login} exact />
        <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect to="/login" />
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
