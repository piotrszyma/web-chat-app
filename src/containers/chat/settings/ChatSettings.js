import React from 'react';
import {Button, Menu, Modal} from "semantic-ui-react";
import {connect} from "react-redux";
import ChatSettingsForm from "./ChatSettingsForm";
import {requestBlockUser, requestChangeOptions} from "../../../redux/actions/auth";
import {openAlert} from "../../../redux/actions/alert";

class ChatSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            form: {
                username: this.props.auth.client.username,
                avatarUrl: this.props.auth.client.avatarUrl,
                newBlocked: []
            }
        };
    }

    render() {
        return (
            <Menu.Item onClick={this.onSettingsClick} name='settings'>
                Account Settings
                <Modal size="small"
                       open={this.state.open}
                       closeOnEscape={false}
                       onClose={this.onCloseModalClick}>
                    <Modal.Header>
                        Account settings
                    </Modal.Header>
                    <Modal.Content>
                        <ChatSettingsForm
                            form={this.state.form}
                            blockedList={this.props.auth.client.blockedList}
                            onUserChange={(event) => this.onUserFieldChange(event)}
                            onNewBlockedChange={(list) => this.onNewBlockedChange(list)}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.onCloseModalClick} negative>
                            Cancel
                        </Button>
                        <Button onClick={this.onSaveModalClick} positive icon='checkmark' labelPosition='right'
                                content='Save'/>
                    </Modal.Actions>
                </Modal>
            </Menu.Item>
        )
    }

    onUserFieldChange = (event) => {
        this.setState({
            form: {
                ...this.state.form,
                username: event.target.value
            }
        });
    };

    onNewBlockedChange = (list) => {
        this.setState({
            form: {
                ...this.state.form,
                newBlocked: list
            }
        });
    };

    onSettingsClick = () => {
        this.setState({
            open: true,
            form: {
                username: this.props.auth.client.username,
                avatarUrl: this.props.auth.client.avatarUrl,
                newBlocked: []
            }
        })
    };

    onCloseModalClick = () => {
        this.setState({open: false});
    };

    onSaveModalClick = () => {
        const trimmed = this.state.form.username.trim();
        if(trimmed === '') {
            this.props.dispatch(openAlert("No, you cannot set your nickname like this..."));
        } else if (this.state.form.username === '') {
            this.props.dispatch(openAlert("Username cannot be empty"));
        } else if(this.state.form.username.length < 3 || this.state.form.username.length > 254) {
            this.props.dispatch(openAlert("Username length must be between 3 & 254"));
        } else {
            this.props.dispatch(requestChangeOptions(
                {
                    username: this.state.form.username.slice(0, 254),
                    avatarUrl: this.state.form.avatarUrl
                }
            ));
            this.state.form.newBlocked.forEach(id => {
                this.props.dispatch(requestBlockUser(id))
            });
            this.onCloseModalClick();
        }
    };
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
};

export default connect(mapStateToProps)(ChatSettings);