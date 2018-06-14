import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/root-reducer';
import thunk from "redux-thunk";
import LocalStorageService from "../../services/data/local-storage-service";


/**
 * Determine which Redux store to provide based on the
 * Environment Type of Node.js
 * @return {object}    Redux store
 */

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        }) : compose;

let initialState = LocalStorageService.loadState();

const configureStore = () => {

    const store = createStore(
        rootReducer,
        initialState || {},
        composeEnhancers(
            applyMiddleware(thunk)
        )
    );

    store.subscribe(() => {
        LocalStorageService.saveState({
            auth: store.getState().auth
        })
    });

    return store;
};


const store = configureStore();


export default store;