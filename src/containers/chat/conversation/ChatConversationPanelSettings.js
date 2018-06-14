import React, {Component} from 'react';
import {Button, Form, List, Segment} from "semantic-ui-react";
import ChatConversationPanelSettingsList from "./ChatConversationPanelSettingsList";
import {connect} from "react-redux";
import {requestLeaveConversation, requestRemoveUserFromConversation} from "../../../redux/actions/conversations";
import {withRouter} from "react-router-dom";
import {trimUsername} from "../../../utils/trim";

class ChatConversationPanelSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.conversation.title,
        }
    }

    render() {
        return (
            <Segment.Group>
                <Segment>
                    <Form
                        as={"div"}
                        >
                        <Form.Field>
                            <label>Title</label>
                            <input
                                value={this.state.title}
                                placeholder='Conversation title'
                                onChange={this.onConversationTitleFieldChange}
                            />
                        </Form.Field>
                        <p>Users in conversation:</p>
                        <List divided>
                            <List.Item key={this.props.clientId}>
                                <List.Content floated='right' verticalAlign='middle'>
                                    <Button
                                        onClick={this.onLeaveConversation}
                                        compact>Leave conversation</Button>
                                </List.Content>
                                <List.Content verticalAlign='middle'>
                                    You ({trimUsername(this.props.usersDetails[this.props.clientId].username)})
                                </List.Content>
                            </List.Item>
                            {this.props.conversation.users
                                .filter(id => id !== this.props.clientId)
                                .map(id => (
                                    <List.Item key={id}>
                                            <List.Content floated='right' verticalAlign='middle'>
                                                <Button compact onClick={(event) => this.onRemoveAnotherUser(id)}>Remove</Button>
                                            </List.Content>
                                            <List.Content verticalAlign='middle'>
                                                {trimUsername(this.props.usersDetails[id].username)}
                                            </List.Content>
                                    </List.Item>)
                                )}
                        </List>
                        <ChatConversationPanelSettingsList onUsersAdd={this.onConversationUsersFieldChange}
                                                           users={this.props.conversation.users}/>
                    </Form>
                </Segment>
            </Segment.Group>
        )
    }

    onConversationTitleFieldChange = (event) => {
        this.setState({title: event.target.value});
        this.props.onTitleChange(event.target.value);
    };

    onConversationUsersFieldChange = (newUsers) => {
        this.props.onNewUsersChange(newUsers);
    };

    onLeaveConversation = (event) => {
        event.preventDefault();
        this.props.dispatch(requestLeaveConversation({
            conversationId: this.props.conversation.id,
            userId: this.props.clientId
        }));
        this.props.onCloseModal();
        this.props.history.push('/');
    };

    onRemoveAnotherUser = (userId) => {
        this.props.dispatch(requestRemoveUserFromConversation({
            conversationId: this.props.conversation.id,
            userId: userId
        }));
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        clientId: state.auth.client.id
    }
};

export default withRouter(connect(mapStateToProps)(ChatConversationPanelSettings));