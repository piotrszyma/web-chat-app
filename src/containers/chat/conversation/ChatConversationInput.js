import React from 'react';
import {Form, TextArea} from "semantic-ui-react";
import classnames from 'classnames';

class ChatConversationInput extends React.Component {

    constructor() {
        super();
        this.state = {
            message: ''
        };
    }

    render() {
        const chatConversationInputClass = classnames('chat__conversation-input');
        const chatConversationTextAreaClass = classnames('chat__conversation-text-area');
        const chatConversationTextAreaInfoClass = classnames('chat__conversation-text-area-info');
        const message = this.state.message;

        return <div className={chatConversationInputClass}>
            <Form onSubmit={this.handleSubmitMessage}>
                <TextArea className={chatConversationTextAreaClass}
                          value={this.state.message}
                          onChange={this.handleMessageChange}
                          placeholder='Enter your message'
                          rows={1}
                          autoHeight
                          onKeyDown={this.handleTextAreaClick}
                          />
                <div
                    className={chatConversationTextAreaInfoClass}
                    onClick={this.handleSubmitMessage}
                >
                    {message ? 'To send message press ENTER or click here.' : ' '}
                </div>

            </Form>
        </div>
    }

    handleMessageChange = (event) => {
        this.setState({message: event.target.value});
    };

    handleSubmitMessage = (event) => {
        event.preventDefault();
        const trimmed = this.state.message.trim();
        if (trimmed === '') return;
        this.props.onMessageSent(trimmed);
        this.setState({message: ''});
    };

    handleTextAreaClick = (event) => {
        if(event.ctrlKey && event.which === 13) {
            const target = event.target;
            const message = target.value;
            const start = target.selectionStart;
            if(target.selectionStart === target.selectionEnd) {
                const parsedMessage = message.substring(0, target.selectionStart)
                    + '\n' + message.substring(target.selectionStart, message.length);
                this.setState({message: parsedMessage}, () => {
                    target.selectionStart = start + 1;
                    target.selectionEnd = start + 1;
                });
            }
        } else if(event.which === 13) {
            this.handleSubmitMessage(event);
        }
    };
}

export default ChatConversationInput