import React from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {requestConversationsList} from "../../../redux/actions/conversations";
import ChatListElement from "./ChatListElement";
import classnames from 'classnames';

class ChatList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const chatListWrapperClassName = classnames('chat__list');
        return <div className={chatListWrapperClassName}>
                {
                    this.props.conversations
                        .sort((c1, c2) => (c1.lastMsg ? c1.lastMsg.timestamp : (new Date()).getTime()) < (c2.lastMsg ? c2.lastMsg.timestamp : (new Date()).getTime()))
                        .map(conversation => {
                            return (
                                <ChatListElement
                                    key={conversation.id}
                                    id={conversation.id}
                                    conversationName={conversation.title}
                                    message={conversation.lastMsg}
                                >
                                </ChatListElement>
                            )
                        })}
        </div>
    }


}


const getLastMessage = (conversations = []) => {
    return conversations.map(conversation => ({
        id: conversation.id,
        title: conversation.title,
        lastMsg: conversation.messages.slice(-1)[0]
    }))
};

const mapStateToProps = state => {
    return {
        conversations: getLastMessage(state.conversations),
        users: state.users
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({requestConversationsList}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ChatList)