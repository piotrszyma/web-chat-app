import SocketService from './socket-service';
import store from '../../redux/store/configure-store';
import {deleteConversation} from "../../redux/actions/conversations";
import {block, unblock} from "../../redux/actions/auth";

const _createChannel = (socket, userId) => {
    const channel = socket.channel(`notify:${userId}`);
    channel.join()
        .receive("ok", () => {})
        .receive("error", ({reason}) => console.log(`ON FAILED HOOK (CHANNEL user:${userId})`))
        .receive("timeout", () => console.log(`Networking issue. (CHANNEL user:${userId})`));

    return addHooksToChannel(channel);
};

const NotifyChannelService = {
    createChannel: (socket, userId) => {
        return _createChannel(socket, userId);
    }
};

const addHooksToChannel = (channel) => {
    channel.on('added', ({conversation_id}) => {
        SocketService.getOrCreateChannel(`conversation:${conversation_id}`);
    });

    channel.on('removed', ({conversation_id}) => {
        const conversationId = Number(conversation_id);
        store.dispatch(deleteConversation(conversationId));
        SocketService.leaveChannel(`conversation:${conversationId}`);
    });

    channel.on('changed', ({user}) => {
        alert("Received on notify:id changed");
    });

    channel.on('blocked', ({user_id}) => {
        const userId = Number(user_id);
        store.dispatch(block(userId));
    });


    channel.on('unblocked', ({user_id}) => {
        const userId = Number(user_id);
        store.dispatch(unblock(userId));
    });
    return channel;
};

export default NotifyChannelService;
