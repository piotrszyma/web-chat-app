import {INITIAL_STATE} from "../../common/app-const";
import {USER_ADD, USER_CHANGE_AVAILABILITY, USER_CHANGE_DETAILS, USER_DELETE, USER_DELETE_ALL} from "../actions/types";

const users = (state = INITIAL_STATE.users, action) => {
    switch (action.type) {
        case USER_ADD:
            return {
                ...state,
                [action.user.id]: {
                    username: action.user.username,
                    avatarUrl: action.user.avatarUrl,
                    online: action.user.online
                }
            };
        case USER_DELETE:
            return Object.keys(state)
                .reduce((acc, userId) => userId === String(action.id) ? acc : ({...acc, [userId]: state[userId]}), {});
        case USER_CHANGE_AVAILABILITY:
            return Object.keys(state)
                .reduce((acc, userId) => userId === String(action.userId) ? {
                    ...acc,
                    [userId]: {
                        ...state[userId],
                        online: action.status
                    }
                } : ({...acc, [userId]: state[userId]}), {});
        case USER_CHANGE_DETAILS:
            return Object.keys(state)
                .reduce((acc, userId) => userId === String(action.user.id) ? {
                    ...acc,
                    [action.user.id]: {
                        username: action.user.username || state[userId].username,
                        avatarUrl: action.user.avatarUrl || state[userId].avatarUrl,
                        online: action.user.online ? action.user.online : state[userId].online
                    }
                } : ({...acc, [userId]: state[userId]}), {});
        case USER_DELETE_ALL:
            return {};
        default:
            return state;
    }
};

export default users;