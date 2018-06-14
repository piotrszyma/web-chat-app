import {
    CONV_INIT,
    CONV_ADD,
    CONV_DELETE,
    CONV_ADD_USER,
    CONV_ADD_HISTORY,
    CONV_ADD_MESSAGE,
    CONV_DEL_MESSAGE,
    CONV_CHANGE_MESSAGE, CONV_REMOVE_USER, CONV_MODIFY, CONV_DELETE_ALL, CONV_ADD_READ_BY
} from './types';

import {makeActionCreator} from "./action-creators";
import {M_READ, M_SENT, T_TEXT} from "../entities/message";
import SocketService from "../../services/socket/socket-service";

//Conversation actions
export const setConversations = makeActionCreator(CONV_INIT, 'conversations');
export const addConversation = makeActionCreator(CONV_ADD, 'id', 'title', 'users', 'messages', 'count', 'avatarUrl');
export const modifyConversation = makeActionCreator(CONV_MODIFY, 'conversation');
export const addMessageToConversation = makeActionCreator(CONV_ADD_MESSAGE, 'id', 'newMessage');
export const deleteConversation = makeActionCreator(CONV_DELETE, 'conversationId');
export const addUserToConversation = makeActionCreator(CONV_ADD_USER, 'conversationId', 'userId');
export const removeUserFromConversation = makeActionCreator(CONV_REMOVE_USER, 'conversationId', 'userId');
export const addHistoryToConversation = makeActionCreator(CONV_ADD_HISTORY, 'id', 'oldHistory', 'count');
export const changeMessage = makeActionCreator(CONV_CHANGE_MESSAGE, 'conversationId', 'message');
export const deleteAllConversations = makeActionCreator(CONV_DELETE_ALL);
export const addReadByToConversation = makeActionCreator(CONV_ADD_READ_BY, 'conversationId', 'messageId', 'newReadBy');

export const requestAddConversation = ({title, users}) => (dispatch) => {
    const conversationLobby = SocketService.getOrCreateChannel('conversation:lobby');
    const payload = {
        title: title,
        users: users
    };
    conversationLobby.push('create', payload, 10000)
        .receive("ok", ({id}) => {
            SocketService.getOrCreateChannel(`conversation:${id}`);
        })
        .receive("error", (reasons) => alert("Error: " + reasons.reason))
        .receive("timeout", () => alert("request add conv - network issue..."));
};

export const requestSendMessage = ({message, conversationId}) => dispatch => {
    const conversation = SocketService.getOrCreateChannel(`conversation:${conversationId}`);
    const messageObj = {
        type: message.type,
        content: message.content.slice(0, 20000)
    };
    conversation.push('msg', messageObj, 10000)
        .receive("error", (reasons) => alert("Error: " + reasons.reason))
        .receive("timeout", () => alert("request send message - network issue..."));
};
export const requestAddUserToConversation = ({conversationId, userId}) => (dispatch) => {
    const conversation = SocketService.getOrCreateChannel(`conversation:${conversationId}`);
    conversation.push('add', {user_id: userId}, 10000)
        .receive('ok', () => {})
        .receive("error", (reasons) => alert("Error: " + reasons.reason))
        .receive("timeout", () => alert("request add - network issue..."));
};

export const requestRemoveUserFromConversation = ({conversationId, userId}) => dispatch => {
    const conversation = SocketService.getOrCreateChannel(`conversation:${conversationId}`);
    conversation.push('remove', {user_id: userId}, 10000)
        .receive('ok', () => {
            console.log("REMOVED!")
        })
        .receive("error", (reasons) => alert("Error: " + reasons.reason))
        .receive("timeout", () => alert("request remove - network issue..."));
};

export const requestModifyConversation = (conversation) => dispatch => {
    const conversationSocket = SocketService.getOrCreateChannel(`conversation:${conversation.id}`);
    const conversationObj = {
        id: conversation.id,
        title: conversation.title,
        avatar: conversation.avatarUrl === "" ? null : conversation.avatarUrl
    };
    conversationSocket.push('change', {conversation: conversationObj}, 10000)
        .receive('ok', () => {})
        .receive("error", (reasons) => alert("Error: " + reasons.reason))
        .receive("timeout", () => alert("request change message - network issue..."));
};

export const requestLeaveConversation = ({conversationId, userId}) => (dispatch) => {
    const conversation = SocketService.getOrCreateChannel(`conversation:${conversationId}`);
    conversation.push('remove', {user_id: userId});
    conversation.leave();
};

export const requestHistoryOfConversation = ({conversationId, oldestKnownMessageId}) => (dispatch) => {
    const conversation = SocketService.getOrCreateChannel(`conversation:${conversationId}`);
    conversation.push('more', {id: oldestKnownMessageId}, 10000)
        .receive('ok', ({count, messages}) => {
            if(messages.length === 0) {
                const countWhenNoMore = -1;
                dispatch(addHistoryToConversation(conversationId, [], countWhenNoMore));
                return;
            }
            const parsedMessages = messages.map(m => ({
                id: m.id,
                author: {
                    id: m.author.id
                },
                type: m.type,
                content: m.content,
                timestamp: m.timestamp,
                readBy: m.read_by
            })).reverse();
            dispatch(addHistoryToConversation(conversationId, parsedMessages, count));
        })
        .receive("error", (reasons) => alert("Error: " + reasons.reason))
        .receive("timeout", () => alert("request send message - network issue..."));
};

export const requestReadMessage = ({conversationId, messageId}) => (dispatch) => {
    const conversation = SocketService.getOrCreateChannel(`conversation:${conversationId}`);
    conversation.push('read', {message_id: messageId}, 10000)
        .receive('ok', () => {})
        .receive("error", (reasons) => alert("Error`: " + reasons.reason))
        .receive("timeout", () => alert("request send message - network issue..."));

};
