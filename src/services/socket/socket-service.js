import {Socket} from "phoenix";
import UserChannelService from "./user-channel";
import ConversationChannelService from "./conversation-channel";
import store from '../../redux/store/configure-store';
import NotifyChannelService from "./notify-channel";
import {deleteAllConversations} from "../../redux/actions/conversations";
import {deleteAllUsers} from "../../redux/actions/users";
import {logout} from "../../redux/actions/auth";

let socket = null;
let channels = {};
let awaiting = [];

const _createChannel = (name) => {
    const [topic, subtopic] = name.split(":");
    switch (topic) {
        case 'conversation':
            return ConversationChannelService.createChannel(socket, subtopic);
        case 'user':
            return UserChannelService.createChannel(socket, subtopic);
        case 'notify':
            return NotifyChannelService.createChannel(socket, subtopic);
        default:
            return new Error("Unknown channel topic");
    }
};


const SocketService = {
    createSocket: (token) => {
        if (socket) throw new Error("socket already init");
        socket = new Socket('ws://10.8.0.18.xip.io:4000/socket', {
            params: {token: token},
            logger: (kind, msg, data) => {
                console.log(`${kind}: ${msg}`, data);
            }
        });
        socket.onOpen(() => {
            console.log('SOCKET WAS OPENED');
        });
        socket.onClose(() => {

        });
        socket.onError(() => {
            console.log('SOCKET ERROR');
            store.dispatch(logout());
            store.dispatch(deleteAllUsers());
            store.dispatch(deleteAllConversations());
            SocketService.deleteSocket();
            window.location.href = "http://10.8.0.18.xip.io:4000/";
        });
        socket.connect();
        return socket;
    },
    deleteSocket: () => {
        Object.keys(channels).forEach(c => channels[c].leave().receive("ok", () => console.log(`LEFT CHANNEL ${c}`)));
        if (socket) socket.disconnect((params) => console.log(params));
        socket = null;
        channels = {};
    },
    getOrCreateChannel: (name) => {
        if (!socket) {
            const token = store.getState().auth.tokens.token;
            SocketService.createSocket(token);
        }

        if (!channels[name]) {
            if(!awaiting.includes(name)) {
                channels = Object.assign({}, channels, {[name]: _createChannel(name)});
                awaiting = awaiting.filter(c => c !== name);
            }
        } else
        {
            return channels[name];
        }
    },
    leaveChannel: (name) => {
        if (!channels[name]) return;
        channels[name].leave();
        delete channels[name];
    },
    getChannel: (name) => channels[name]
};

export {
    SocketService as default,
    socket,
    channels
};
