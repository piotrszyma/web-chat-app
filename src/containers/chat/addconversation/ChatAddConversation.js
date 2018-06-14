import React, {Component} from 'react';
import {Button, Input, Form, Menu, Modal} from "semantic-ui-react";
import ChatAddConversationFormDropdown from './ChatAddConversationFormDropdown';
import {connect} from "react-redux";
import {requestAddConversation} from "../../../redux/actions/conversations";


/**
 * Component that holds modal for adding a conversation
 */
class ChatAddConversation extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            users: []
        };
    }

    /**
     * Function that shows this modal
     * It changes internal component state property "open"
     */
    show = () => this.setState({open: true});

    /**
     * It renders component's DOM element - add conversation modal
     * @returns {XML}
     */
    render() {
        const {open, size} = this.state;
        return (
            <Menu.Item name='createConv' onClick={this.show}>
                Create Conversation
                <Modal size={'small'}
                       open={open}
                       onClose={this.clearFormAndCloseModal}>
                    <Modal.Header>
                        Create new conversation
                    </Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Title of conversation</label>
                                <Input placeholder='Title'
                                       onChange={this.handleTitleChange}
                                       value={this.state.title}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Participants</label>
                                <ChatAddConversationFormDropdown handleChange={this.handleUsersListChange}/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.clearFormAndCloseModal} negative>
                            Cancel
                        </Button>
                        <Button positive icon='checkmark'
                                labelPosition='right'
                                content="Create conversation"
                                onClick={this.handleAddConversation}
                        />
                    </Modal.Actions>
                </Modal>
            </Menu.Item>
        )
    }

    /**
     * Function, that handles users list change
     * @param event - event that was initialized by change
     * @param data - new value
     */
    handleUsersListChange = (event, data) => {
        this.setState({users: data.value});
    };

    /**
     * Function, that handles title change
     * @param event - event that was initialized by change
     * @param data - new value
     */
    handleTitleChange = (event) => {
        this.setState({title: event.target.value});
    };

    /**
     * Function, that handles click on save button
     * @param event - event that was initialized on click
     */
    handleAddConversation = (event) => {
        event.preventDefault();
        const trimmed = this.state.title.trim();
        if(trimmed === '') {
            this.props.dispatch(openAlert("No, you cannot set your conversation name like this..."));
        } else if (this.state.title === '') {
            this.props.dispatch(openAlert("Conversation name cannot be empty"));
        } else if(this.state.title.length < 3 || this.state.title.length > 254) {
            this.props.dispatch(openAlert("Conversation length must be between 3 & 254"));
        } else {
            this.props.dispatch(requestAddConversation({
                title: this.state.title,
                users: this.state.users
            }));
            this.clearFormAndCloseModal()
        }

    };

    /**
     * Function, that handles click on close button
     */
    clearFormAndCloseModal = () => {
        this.setState({
            title: '',
            users: [],
            open: false
        })
    }
}


export default connect()(ChatAddConversation)