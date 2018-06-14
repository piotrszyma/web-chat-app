import React from 'react';
import ChatConversationContent from "./ChatConversationContent";
import ChatConversationInput from "./ChatConversationInput";
import classnames from 'classnames';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {requestHistoryOfConversation, requestSendMessage} from "../../../redux/actions/conversations";
import {T_SNIPPET, T_TEXT} from "../../../redux/entities/message";
import ChatConversationPanel from "./ChatConversationPanel";

class ChatConversation extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.match.params.id && !this.props.conversation.hasOwnProperty('messages')) {
            this.props.history.push('/');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.url !== '/' && !this.props.conversation.hasOwnProperty('messages')) {
            this.props.history.push('/');
        }
    }

    render() {
        const chatConversationClass = classnames('chat__conversation');
        return this.props.match.params.id ? (
                <div
                    className={chatConversationClass}>
                    <ChatConversationPanel conversation={this.props.conversation}/>
                    <ChatConversationContent
                        id={this.props.conversation.id}
                        messagesList={this.props.conversation.messages || []}
                        messagesCount={this.props.conversation.count}
                        onGetMsgHistory={this.handleGetMessageHistory}
                    />
                    <ChatConversationInput onMessageSent={this.handleSendMessage}/>
                </div>
            ) :
            (
                <div className={chatConversationClass}>Select conversation</div>

            );
    }

    handleGetMessageHistory = () => {
        if (this.props.conversation.hasOwnProperty('messages') && this.props.conversation.messages[0]) {
            this.props.dispatch(requestHistoryOfConversation({
                conversationId: this.props.conversation.id,
                oldestKnownMessageId: this.props.conversation.messages[0].id,
            }))
        }
    };

    handleSendMessage = (message) => {
        const conversationId = Number(this.props.match.params.id);
        const messageType = this.getMessageType(message);
        const parsedMessage = messageType === T_SNIPPET ? message.slice(3, -3) : message;

        if(parsedMessage.trim() !== parsedMessage || parsedMessage === '') {
            return;
        }

        this.props.dispatch(requestSendMessage({
            message: {
                type: messageType,
                content: parsedMessage
            },
            conversationId: conversationId
        }));
    };

    getMessageType = (message) => {
        if (/^[`]{3}[\s\S]*[`]{3}$/.test(message)) {
            return T_SNIPPET;
        } else {
            return T_TEXT;
        }
    }
}

const filterConversation = (conversations = {}, conversationId = null) => {
    if (conversationId === null || conversations === {}) {
        return {};
    }

    const conversation = conversations.find(c => c.id === Number(conversationId)) || {};

    if (conversation.hasOwnProperty('messages')) {
        return conversation;
    }

    return {};
};

const mapStateToProps = (state, ownProps) => {
    return {
        conversation: filterConversation(state.conversations, ownProps.match.params.id),
        userId: state.auth.client.id
    }
};

export default withRouter(connect(mapStateToProps)(ChatConversation))
