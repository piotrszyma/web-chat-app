import { combineReducers } from 'redux';
import auth from './auth';
import conversations from "./conversations";
import users from "./users";
import alert from "./alert";

export default combineReducers({
    conversations,
    users,
    auth,
    alert
});
