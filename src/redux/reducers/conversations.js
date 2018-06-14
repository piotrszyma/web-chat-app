import {INITIAL_STATE} from '../../common/app-const';

import {
    CONV_ADD,
    CONV_ADD_USER,
    CONV_DELETE,
    CONV_ADD_HISTORY,
    CONV_ADD_MESSAGE, CONV_ADD_READ_BY,
    CONV_INIT, CONV_CHANGE_MESSAGE, CONV_DEL_MESSAGE, CONV_REMOVE_USER, CONV_MODIFY, CONV_DELETE_ALL
} from "../actions/types";

const conversations = (state = INITIAL_STATE.conversations, action) => {
    switch (action.type) {
        case CONV_INIT: {
            return [...action.conversations];
        }
        case CONV_ADD: {
            return [{
                id: action.id,
                title: action.title,
                users: action.users,
                messages: action.messages || [],
                avatarUrl: action.avatarUrl,
                count: 0
            }, ...state];
        }
        case CONV_DELETE: {
            return state.filter(conversation => conversation.id !== action.conversationId);
        }
        case CONV_MODIFY: {
            return state.map(conversation => conversation.id === action.conversation.id ?
                ({
                    id: conversation.id,
                    title: action.conversation.title || conversation.title,
                    users: action.conversation.users || conversation.users,
                    messages: action.conversation.messages || conversation.messages,
                    avatarUrl: action.conversation.avatarUrl || conversation.avatarUrl,
                    count: action.conversation.count || conversation.count
                }) : conversation)
        }
        case CONV_ADD_USER: {
            return state.map(conversation => conversation.id === action.conversationId ?
                ({
                    id: conversation.id,
                    title: conversation.title,
                    users: [...conversation.users, action.userId],
                    messages: conversation.messages,
                    avatarUrl: conversation.avatarUrl,
                    count: conversation.count
                }) : conversation)
        }
        case CONV_REMOVE_USER: {
            return state.map(conversation => conversation.id === action.conversationId ?
                ({
                    id: conversation.id,
                    title: conversation.title,
                    users: conversation.users.filter(userId => userId !== action.userId),
                    messages: conversation.messages,
                    avatarUrl: conversation.avatarUrl,
                    count: conversation.count
                }) : conversation)
        }
        case CONV_ADD_HISTORY: {
            const conversation = state.find(c => c.id === action.id);
            if(action.oldHistory.length > 0) {
                if(action.oldHistory.slice(-1)[0].id < conversation.messages[0]) throw new Error("HISTORY BUG!");
            }
            return state.map(conversation => conversation.id === action.id ?
                ({
                    id: conversation.id,
                    title: conversation.title,
                    users: conversation.users,
                    messages: [ ...action.oldHistory, ...conversation.messages],
                    avatarUrl: conversation.avatarUrl,
                    count: action.count,
                }) : conversation, [])
        }
        case CONV_ADD_MESSAGE: {
            return state.map(conversation => conversation.id === action.id ?
                ({
                    id: conversation.id,
                    title: conversation.title,
                    users: conversation.users,
                    messages: [...conversation.messages,
                        {
                            id: action.newMessage.id,
                            author: {
                                id:  action.newMessage.author.id
                            },
                            type: action.newMessage.type,
                            content: action.newMessage.content,
                            timestamp: action.newMessage.timestamp,
                            readBy: action.newMessage.readBy
                        }],
                    avatarUrl: conversation.avatarUrl,
                    count: conversation.count
                }) : conversation);
        }
        case CONV_CHANGE_MESSAGE: {
            return state.map(conversation => conversation.id === action.id ?
                ({
                    id: conversation.id,
                    title: conversation.title,
                    users: conversation.users,
                    messages: conversation.messages.map(message => message.id === action.message.id ?
                        (
                            {
                                ...message,
                                readBy: action.message.readBy ? action.message.readBy : message.readBy
                            }
                        ) : message),
                    avatarUrl: conversation.avatarUrl,
                    count: conversation.count
                }) : conversation);
        }
        case CONV_ADD_READ_BY: {
            return state.map(conversation => conversation.id === action.conversationId ?
                ({
                    id: conversation.id,
                    title: conversation.title,
                    users: conversation.users,
                    messages: conversation.messages.map(message => message.id === action.messageId ?
                        (
                            {
                                ...message,
                                readBy: [...message.readBy, action.newReadBy]
                            }
                        ) : message),
                    avatarUrl: conversation.avatarUrl,
                    count: conversation.count
                }) : conversation);
        }
        case CONV_DEL_MESSAGE: {
            return state.map(conversation => conversation.id === action.id ?
                ({
                    id: conversation.id,
                    title: conversation.title,
                    users: conversation.users,
                    messages: conversation.messages
                        .reduce((acc, message) => message.id === action.messageId ? acc : [...acc, message]),
                    avatarUrl: conversation.avatarUrl,
                    count: conversation.count
                }) : conversation);
        }
        case CONV_DELETE_ALL:
            return [];
        default: {
            return state;
        }
    }
};

export default conversations;
