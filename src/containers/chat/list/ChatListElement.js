import React, {Component} from 'react';
import {List} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import classnames from 'classnames';
import {timeStampToDateStr} from "../../../utils/time";
import {connect} from "react-redux";
import SocketService from "./../../../services/socket/socket-service";
import {trimMessage, trimTitle, trimUsername} from "../../../utils/trim";

class ChatListElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id
        };
        if (typeof this.props.message !== 'undefined') {
            SocketService.getOrCreateChannel(`user:${this.props.message.author.id}`);
        }
    }

    render() {
        const chatListElementStyleClass = classnames('chat__list-item');
        return (
            <List.Item
                className={chatListElementStyleClass}
                onClick={this.onChatListElementClick}>
                <List.Content>
                    <List.Header>{trimTitle(this.props.conversationName)}</List.Header>
                    <List.Description>{this.parseMessage(this.props.message)}</List.Description>
                    {this.props.message ? timeStampToDateStr(this.props.message.timestamp) : ''}
                </List.Content>
            </List.Item>
        )
    }

    onChatListElementClick = () => {
        this.props.history.push(`/${this.state.id}`);
    };

    parseMessage = (message) => {
        if (typeof message === 'undefined') return 'No messages';
        if (typeof this.props.usersDetails[message.author.id] === 'undefined') return 'No messages';
        return message ? `${trimUsername(this.props.usersDetails[message.author.id].username)}: ${trimMessage(message)}` : 'No messages';
    };

}


const mapStateToProps = (state, ownProps) => {
    return {
        usersDetails: {
            ...state.users, [state.auth.client.id]: {
                username: state.auth.client.username,
                avatarUrl: state.auth.client.avatarUrl
            }
        }
    }
};

export default withRouter(connect(mapStateToProps)(ChatListElement));