import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './Root';

// Require globals
import 'babel-polyfill';
import 'lodash';

// Styles hook
import './scss/index.scss';

// console.log = () => {};

ReactDOM.render(
    <AppContainer>
        <Root/>
    </AppContainer>,
    document.getElementById('app')
);

// Hot Module Replacement API
// if (module.hot) {
//     module.hot.accept('./Root', () => {
//         const NextApp = require('./Root').default;
//         ReactDOM.render(
//             <AppContainer>
//                 <NextApp/>
//             </AppContainer>,
//             document.getElementById('app')
//         );
//     });
// }
