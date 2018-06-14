import {
    AUTH_BLOCK,
    AUTH_CHANGE_SETTINGS,
    AUTH_LOGIN,
    AUTH_LOGOUT, AUTH_UNBLOCK,
} from './types';

import {makeActionCreator} from "./action-creators";
import SocketService from "../../services/socket/socket-service";
import {deleteAllConversations, deleteConversation} from "./conversations";
import {deleteAllUsers} from "./users";



//Login action
export const login = makeActionCreator(AUTH_LOGIN, 'client', 'tokens', 'expireAt');
export const logout = makeActionCreator(AUTH_LOGOUT);
export const block = makeActionCreator(AUTH_BLOCK, 'id');
export const unblock = makeActionCreator(AUTH_UNBLOCK, 'id');
export const changeSettings = makeActionCreator(AUTH_CHANGE_SETTINGS, 'client');

export const requestLoginAndCreateSocket = (client, tokens, tokenExpiration) => (dispatch) => {
    dispatch(login(client, tokens, tokenExpiration));
    SocketService.createSocket(tokens.token);
    SocketService.getOrCreateChannel('user:lobby');
    SocketService.getOrCreateChannel('conversation:lobby');
};

export const requestLogoutAndDeleteSocket = (history) => (dispatch) => {
    dispatch(logout());
    dispatch(deleteAllUsers());
    dispatch(deleteAllConversations());
    SocketService.deleteSocket();
    history.push('/login');
};

export const requestChangeOptions = ({username, avatarUrl}) => (dispatch, getState) => {
    const userLobby = SocketService.getOrCreateChannel("user:lobby");
    const payload = {
        user: {
            id: getState().auth.client.id,
            username: username,
            avatar_url: avatarUrl
        }
    };
    userLobby.push("change", payload, 3000)
        .receive("ok", () => {})
        .receive("error", (reasons) => alert("Unable to change user data " + reasons.reason))
        .receive("timeout", () => alert("user:lobby change - Cannot connect to server"));

};

export const requestBlockUser = (userId) => (dispatch) => {
    const userChannel = SocketService.getOrCreateChannel(`user:${userId}`);

    userChannel.push("block", 3000)
        .receive("ok", () => {console.log("user blocked")})
        .receive("error", (reasons) => alert("Error: " + reasons))
        .receive("timeout", () => alert("user:id block - network issue..."));
};

export const requestUnblockUser = (userId) => (dispatch) => {
    const userChannel = SocketService.getOrCreateChannel(`user:${userId}`);
    userChannel.push("unblock", 3000)
        .receive("ok", () => {console.log("user unblocked!")})
        .receive("error", (reasons) => alert("Error: " + reasons.reason))
        .receive("timeout", () => alert("user:id block - network issue..."));
};