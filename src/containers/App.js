import React, {Component} from 'react';

import classnames from 'classnames';

import Login from './login/Login';
import Chat from './chat/Chat';
import Switch from "react-router-dom/es/Switch";
import Redirect from "react-router-dom/es/Redirect";
import {Route} from "react-router-dom";
import ChatAlert from "./chat/alert/ChatAlert";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = classnames('app-container');

        return (
            <div
                className={style}
            >
                <ChatAlert/>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/" component={Chat} />
                    <Redirect from='/' to='/login' />
                </Switch>
            </div>
        );
    }

}

export default App
