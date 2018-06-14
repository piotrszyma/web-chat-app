import {
    addConversation,
    addMessageToConversation, addReadByToConversation, addUserToConversation, changeMessage, modifyConversation,
    removeUserFromConversation, requestReadMessage
} from "../../redux/actions/conversations";
import store from "../../redux/store/configure-store";

import SocketService from '../../services/socket/socket-service';

const _createChannel = (socket, conversationId) => {
    if (conversationId === 'lobby') {
        const channel = socket.channel('conversation:lobby');
        channel.join()
            .receive("ok", (conversations) => {
                conversations.forEach(c => SocketService.getOrCreateChannel(`conversation:${c.id}`));
                SocketService.getOrCreateChannel(`notify:${store.getState().auth.client.id}`);
            })
            .receive("error", ({reason}) => console.log(`ON FAILED HOOK (CHANNEL conversation:${conversationId})`))
            .receive("timeout", () => console.log(`Networking issue. (CHANNEL conversation:${conversationId})`));
        return addHooksToLobby(channel);
    } else {
        const channel = socket.channel(`conversation:${conversationId}`);
        channel.join()
            .receive("ok", (conversation) => {
                conversation.user
                    .filter(u => u.id !== store.getState().auth.client.id)
                    .forEach(u => SocketService.getOrCreateChannel(`user:${u.id}`));
                store.dispatch(addConversation(
                    conversation.id,
                    conversation.title ? conversation.title : 'No topic',
                    conversation.user.map(u => u.id),
                    conversation.messages.map(m => ({
                        id: m.id,
                        timestamp: new Date(m.timestamp).getTime(),
                        type: m.type,
                        content: m.content,
                        author: {
                            id: m.author.id
                        },
                        readBy: m.read_by
                    })).reverse(),
                    0,
                    ''
                ));
                const clientId = store.getState().auth.client.id;
                conversation.messages.forEach(m => {
                    if (!m.read_by.includes(clientId)) {
                        store.dispatch(requestReadMessage({
                            conversationId: conversationId,
                            messageId: m.id
                        }))
                    }
                });
                console.log(`ON OK HOOK (CHANNEL conversation:${conversationId})`);
            })
            .receive("error", ({reason}) => {
                console.log(`ON FAILED HOOK (CHANNEL conversation:${conversationId}) ${reason}`);
            })
            .receive("timeout", () => console.log(`Networking issue. (CHANNEL conversation:${conversationId})`));
        return addHooksToChannel(channel);
    }
};

const ConversationChannelService = {
    createChannel: (socket, conversationId) => {
        return _createChannel(socket, conversationId)
    }
};

export default ConversationChannelService;

const addHooksToLobby = (channel) => {
    return channel;
};

const addHooksToChannel = (channel) => {
    const conversationId = Number(channel.topic.split(":")[1]);

    channel.on('added', ({user_id}) => {
        console.log("SERVER ADDED NEW USER TO CONF!");
        const userId = Number(user_id);
        if (!store.getState().users[userId]) {
            SocketService.getOrCreateChannel(`user:${userId}`)
        }
        store.dispatch(addUserToConversation(conversationId, userId));
    });
    channel.on('removed', ({user_id}) => {
        console.log("SERVER REMOVED USER FROM CONF!");

        if(user_id !== store.getState().auth.client.id) {
            const userId = Number(user_id);
            store.dispatch(removeUserFromConversation(conversationId, userId));
        }
    });
    channel.on('changed', ({conversation}) => {

        const conversationObj = {
            id: conversation.id,
            title: conversation.title,
            avatarUrl: conversation.avatar
        };
        store.dispatch(modifyConversation(conversationObj))
    });
    channel.on('new_msg', (message) => {
        const messageObj = {
            id: message.id,
            timestamp: new Date(message.timestamp).getTime(),
            type: message.type,
            content: message.content,
            author: {
                id: message.author.id
            },
            readBy: message.read_by
        };
        store.dispatch(addMessageToConversation(conversationId, messageObj));
        store.dispatch(requestReadMessage({
            conversationId: conversationId,
            messageId: message.id
        }));
    });

    channel.on('read', ({message_id, user_id}) => {
        const messageId = Number(message_id);
        const userId = Number(user_id);
        store.dispatch(addReadByToConversation(conversationId, messageId, userId));
    });

    return channel;
};
