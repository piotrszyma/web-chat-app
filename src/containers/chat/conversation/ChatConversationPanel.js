import React from 'react';
import {Dropdown, Header, Modal} from "semantic-ui-react";
import classnames from 'classnames';
import Button from "semantic-ui-react/dist/es/elements/Button/Button";
import ChatConversationPanelSettings from "./ChatConversationPanelSettings";
import {connect} from "react-redux";
import {
    requestAddUserToConversation,
    requestModifyConversation
} from "../../../redux/actions/conversations";
import {openAlert} from "../../../redux/actions/alert";
import Popup from "semantic-ui-react/dist/es/modules/Popup/Popup";
import List from "semantic-ui-react/dist/es/elements/List/List";
import Image from "semantic-ui-react/dist/es/elements/Image/Image";
import SocketService from "./../../../services/socket/socket-service";
import {trimTitle, trimUsername} from "../../../utils/trim";

class ChatConversationPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModifyModal: false,
            openRemoveModal: false,
            conversation: this.props.conversation,
            newUsers: [],
        };
    }

    render() {
        const panelStyleClass = classnames('chat__conversation-panel');
        const panelSettingsStyleClass = classnames('chat__conversation-panel-settings');

        return (
            <div className={panelStyleClass}>
                <div className={panelSettingsStyleClass}>
                    <Popup
                        trigger={<Button size='mini'>Info</Button>}
                        position='bottom left'
                        on="click"
                    >
                        {this.state.conversation.users ? ( <Popup.Content>
                            <p>Users</p>
                            <List>
                                {this.props.conversation.users ? this.props.conversation.users.map((u, i) => {
                                    if (u === this.props.clientId) {
                                        return (
                                            <List.Item key={i}>
                                                <Image avatar
                                                       src={this.props.usersDetails[u] ? this.props.usersDetails[u].avatarUrl : ''}/>
                                                <List.Content>
                                                    <List.Header
                                                        as='a'>{this.props.usersDetails[u] ? this.props.usersDetails[u].username : ''}</List.Header>
                                                    <List.Description><p className="you">You</p></List.Description>
                                                </List.Content>
                                            </List.Item>
                                        )
                                    } else {
                                        return (
                                            <List.Item key={i}>
                                                <Image avatar
                                                       src={this.props.usersDetails[u] ? this.props.usersDetails[u].avatarUrl : ''}/>
                                                <List.Content>
                                                    <List.Header
                                                        as='a'>{this.props.usersDetails[u] ? trimUsername(this.props.usersDetails[u].username) : ''}</List.Header>
                                                    <List.Description>{this.props.usersDetails[u] ? this.props.usersDetails[u].online ? (
                                                        <p className="online">Online</p>) : (
                                                        <p className="offline">Offline</p>) : ''}</List.Description>
                                                </List.Content>
                                            </List.Item>
                                        );
                                    }
                                }) : ''}
                            </List>
                        </Popup.Content>) : ''}
                    </Popup>

                    <Dropdown text='Conversation Settings'>
                        <Dropdown.Menu>
                            <Dropdown.Item text='Modify conversation' onClick={this.onOpenModifyModal}/>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Modal size="small"
                           closeOnEscape={false}
                           open={this.state.openModifyModal}
                           onClose={this.onCloseModifyModal}>
                        <Modal.Header>
                            Conversation settings
                        </Modal.Header>
                        <Modal.Content>
                            <ChatConversationPanelSettings
                                conversation={this.props.conversation}
                                onTitleChange={this.handleTitleChange}
                                onNewUsersChange={this.handleNewUsersChange}
                                onCloseModal={this.onCloseModifyModal}
                                usersDetails={this.props.usersDetails}
                            />
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={this.onCloseModifyModal} negative>
                                Cancel
                            </Button>
                            <Button onClick={this.onSaveModifiedConversation} icon='checkmark' labelPosition='right'
                                    content='Save' positive/>
                        </Modal.Actions>
                    </Modal>
                </div>
                <div>
                    <Header as='h3'>{trimTitle(this.props.conversation.title)}</Header>
                </div>
                <div>

                </div>
            </div>
        )
    }

    handleTitleChange = (title) => {
        this.setState({
            conversation: {
                ...this.state.conversation,
                title: title
            }
        })
    };

    handleNewUsersChange = (newUsers) => {
        this.setState({newUsers: newUsers});
    };

    onOpenModifyModal = () => {
        this.setState({
            conversation: this.props.conversation,
            openModifyModal: true,
            newUsers: []
        });
    };
    onCloseModifyModal = () => {
        this.setState({
            conversation: this.props.conversation,
            openModifyModal: false
        });
    };

    onSaveModifiedConversation = () => {
        const trimmed = this.state.conversation.title.trim();

        if(trimmed === '') {
            this.props.dispatch(openAlert("No, you cannot set your conversation name like this..."));
        } else if (this.state.conversation.title === '') {
            this.props.dispatch(openAlert("Conversation name cannot be empty"));
        } else if(this.state.conversation.title.length < 3 || this.state.conversation.title.length > 254) {
            this.props.dispatch(openAlert("Conversation length must be between 3 & 254"));
        } else {
            if (this.state.conversation.title !== this.props.conversation.title) {
                const trimmed = this.state.conversation.title.trim();
                if (this.state.conversation.title !== '' || trimmed !== '') {
                    this.props.dispatch(requestModifyConversation(this.state.conversation));
                }
            }
            if (this.state.newUsers) {
                this.state.newUsers.forEach(id => {
                    SocketService.getOrCreateChannel(`user:${id}`);
                    this.props.dispatch(requestAddUserToConversation({
                        conversationId: this.state.conversation.id,
                        userId: id
                    }));
                });
            }
            this.onCloseModifyModal();
        }

    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        usersDetails: {
            ...state.users, [state.auth.client.id]: {
                username: state.auth.client.username,
                avatarUrl: state.auth.client.avatarUrl
            }
        },
        clientId: state.auth.client.id
    }
};

export default connect(mapStateToProps)(ChatConversationPanel);