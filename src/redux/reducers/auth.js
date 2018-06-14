import { INITIAL_STATE } from '../../common/app-const';

import {
    AUTH_BLOCK,
    AUTH_CHANGE_SETTINGS,
    AUTH_LOGIN,
    AUTH_LOGOUT, AUTH_UNBLOCK
} from "../actions/types";

const auth = (state = INITIAL_STATE.auth, action) => {
    switch(action.type) {
        case AUTH_LOGOUT: {
            return INITIAL_STATE.auth;
        }
        case AUTH_LOGIN: {
            return {
                client: {
                    id: action.client.id,
                    username: action.client.username,
                    avatarUrl: action.client.avatarUrl,
                    blockedList: []
                },
                tokens: {
                    token: action.tokens.token,
                    refreshToken: action.tokens.refreshToken
                },
                expireAt: action.expireAt,
                isLogged: true
            };
        }
        case AUTH_CHANGE_SETTINGS: {
            return {
                client: {
                    username: action.client.username || state.client.username,
                    avatarUrl: action.client.avatarUrl || state.client.avatarUrl,
                    blockedList: action.client.blockedList || state.client.blockedList,
                    id: action.client.id || state.client.id
                },
                tokens: state.tokens,
                expireAt: state.expireAt,
                isLogged: state.isLogged
            };
        }
        case AUTH_BLOCK: {
            return {
                ...state,
                client: {
                    ...state.client,
                    blockedList: [...state.client.blockedList, action.id]
                }
            };
        }
        case AUTH_UNBLOCK: {
            return {
                ...state,
                client: {
                    ...state.client,
                    blockedList: state.client.blockedList.filter(id => id !== action.id)
                }
            };
        }
        default: {
            return state;
        }
    }
};

export default auth;
