import {changeSettings} from "../../redux/actions/auth";

import store from '../../redux/store/configure-store';
import {addUser, changeDetailsOfUser, changeUserAvailability} from "../../redux/actions/users";
import SocketService from './socket-service';

const _createChannel = (socket, userId) => {
    if (userId === 'lobby') {
        const channel = socket.channel('user:lobby');
        channel.join()
            .receive("ok", (response) => {
                if(response.blocked !== null) {
                    response.blocked.forEach(id => {
                        SocketService.getOrCreateChannel(`user:${id}`);
                    });
                }

                store.dispatch(changeSettings(
                    {
                        avatarUrl: response.avatar,
                        blockedList: response.blocked,
                        id: response.id,
                        username: response.display_name
                    }
                ));

                SocketService.getOrCreateChannel(`user:${response.id}`);
            })
            .receive("error", ({reason}) => alert(`Unable to connect to (CHANNEL user:${userId})\n ${reason}`))
            .receive("timeout", () => alert(`Networking issue. (CHANNEL user:${userId})`));
        return addHooksToLobby(channel);
    } else {
        const channel = socket.channel(`user:${userId}`);
        channel.join()
            .receive("ok", (user) => {
                if(user.id === store.getState().auth.client.id) return;
                store.dispatch(addUser({
                    id: user.id,
                    username: user.display_name,
                    avatarUrl: user.avatar,
                    online: user.is_online
                }));
            })
            .receive("error", ({reason}) => console.log(`ON FAILED HOOK (CHANNEL user:${userId})`))
            .receive("timeout", () => console.log(`Networking issue. (CHANNEL user:${userId})`));

        return addHooksToChannel(channel);
    }
};

const UserChannelService = {
    createChannel: (socket, userId) => {
        return _createChannel(socket, userId);
    }
};


const addHooksToLobby = (channel) => {
    return channel;
};

const addHooksToChannel = (channel) => {
    const userId = Number(channel.topic.split(":")[1]);

    if(userId === store.getState().auth.client.id) {
        channel.on('changed', ({user}) => {
            const userObj = {
                id: user.id,
                username: user.username,
                avatarUrl: user.avatar_url
            };
            store.dispatch(changeSettings(userObj));
        });
    } else {
        channel.on('logged_in', () => {
            store.dispatch(changeUserAvailability(userId, true));

        });

        channel.on('logged_out', () => {
            store.dispatch(changeUserAvailability(userId, false));
        });

        channel.on('changed', ({user}) => {
            const userObj = {
                id: user.id,
                username: user.username,
                avatarUrl: user.avatar_url
            };
            store.dispatch(changeDetailsOfUser(userObj));
        });
    }
    return channel;

};

export default UserChannelService;
