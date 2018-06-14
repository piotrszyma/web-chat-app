import {
    USER_ADD,
    USER_DELETE,
    USER_CHANGE_DETAILS, USER_DELETE_ALL, USER_CHANGE_AVAILABILITY
} from './types';

import {makeActionCreator} from "./action-creators";
import SocketService from "../../services/socket/socket-service";

//Users actions
export const addUser = makeActionCreator(USER_ADD, 'user');
export const deleteUser = makeActionCreator(USER_DELETE, 'id');
export const changeDetailsOfUser = makeActionCreator(USER_CHANGE_DETAILS, 'user');
export const changeUserAvailability = makeActionCreator(USER_CHANGE_AVAILABILITY, 'userId', 'status');
export const deleteAllUsers = makeActionCreator(USER_DELETE_ALL);

export const requestFindUserByName = (searchQuery) => {
    const payload = {
        search: searchQuery
    };

    return new Promise((resolve, reject) => {
        const userLobby = SocketService.getOrCreateChannel("user:lobby");

        userLobby.push("find", payload, 10000)
            .receive("ok", ({users}) => {
                resolve(users.map(u => ({
                    avatarUrl: u.avatar,
                    username: u.display_name,
                    id: u.id
                })));
            })
            .receive("error", () => {
                reject();
            })
            .receive("timeout", () => {
                reject();
            });
    });
};