import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import 'babel-polyfill';
import App from './containers/App';
import {Provider} from 'react-redux'
import store from './redux/store/configure-store';

function Root() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    );
}

export default Root