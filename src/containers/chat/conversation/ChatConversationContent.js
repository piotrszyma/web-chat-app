import React from 'react';
import {Comment, Loader} from "semantic-ui-react";
import classnames from 'classnames';
import Message from './Message'

class ChatConversationContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentDidMount() {
        this.messageListEnd.scrollIntoView(false);
        if (this.scrollNotVisible()) this.checkForMoreHistory();
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.id !== this.props.id) {
            this.messageListEnd.scrollIntoView(false);
            this.setState({isLoading: false});
            if (this.scrollNotVisible()) {
                this.checkForMoreHistory();
            }
        } else {
            if (prevProps.messagesList !== this.props.messagesList) {
                if (this.scrollNotVisible() && !this.receivedAll()) {
                    if (this.props.messagesList.length !== 0) {
                        this.checkForMoreHistory();
                    }
                } else if (!this.state.isLoading) {
                    this.messageListEnd.scrollIntoView(false);

                } else {
                    this.setState({isLoading: false});
                }
            }
        }

    };

    render = () => {
        const chatConversationContentClass = classnames('chat__conversation-content');
        const messages = this.props.messagesList
            .map((message, i) => (
                    <Message
                        key={i}
                        message={message}
                    />
                )
            );
        return (
            <div className={chatConversationContentClass}
                 onScroll={this.updateMessage}
                 ref={(w) => {
                     this.messageListWrap = w;
                 }}>
                {this.state.isLoading ? (<Loader active inline='centered'/>) : ('')}
                <div ref={(l) => {
                    this.messageList = l;
                }}>
                    <Comment.Group>
                        {messages}
                    </Comment.Group>
                </div>
                <div style={{float: "left", clear: "both", position: "relative", transform: "translateY(10px)"}}
                     ref={(e) => {
                         this.messageListEnd = e;
                     }}>
                </div>
            </div>
        );
    };


    receivedAll = () => this.props.messagesCount === -1;

    scrollNotVisible = () => this.messageListWrap.clientHeight > this.messageList.clientHeight;

    scrolledTop = (event) => event.target.scrollTop === 0;

    checkForMoreHistory = () => {
        if (this.props.messagesList.length >= 20) this.props.onGetMsgHistory();
    };

    updateMessage = (event) => {
        if (this.scrolledTop(event) && !this.state.isLoading) {
            if (!this.receivedAll()) {
                this.setState({isLoading: true});
                this.props.onGetMsgHistory();
                setTimeout(() => {
                    this.setState({isLoading: false});
                }, 3000);
            }

        }
    };

}

export default ChatConversationContent