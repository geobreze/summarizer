import React from 'react';
import ReactDOM from 'react-dom';
import {App} from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import {BrowserRouter as Router} from "react-router-dom";
import Route from "react-router-dom/Route";
import Switch from "react-router-dom/Switch";
import AllDocumentsPage from "./AllDocumentsPage";

ReactDOM.render((<Router>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route exact path="/documents" component={AllDocumentsPage}/>
        </Switch>
    </Router>), document.getElementById('root')
);
