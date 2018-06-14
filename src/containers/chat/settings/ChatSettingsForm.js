import React, {Component} from 'react';
import ChatSettingsFormBlacklist from "./ChatSettingsFormBlacklist";
import Image from "semantic-ui-react/dist/es/elements/Image/Image";
import Segment from "semantic-ui-react/dist/es/elements/Segment/Segment";
import Form from "semantic-ui-react/dist/es/collections/Form/Form";
import {Button, List} from "semantic-ui-react";
import {connect} from "react-redux";
import {requestUnblockUser} from "../../../redux/actions/auth";


class ChatSettingsForm extends Component {
    constructor (props) {
        super(props);
    }
    render() {
        return (
            <Segment.Group>
                <Segment vertical>
                    <Image src={this.props.form.avatarUrl} size='small' centered/>
                </Segment>
                <Segment>
                    <Form>
                        <Form.Field>
                            <label>Display name</label>
                            <input
                                value={this.props.form.username}
                                placeholder='Display Name'
                                onChange={this.props.onUserChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            {this.props.blockedList.length > 0 ? (<label>Blocked list</label>) : ''}
                            <List divided>
                                {this.props.blockedList
                                    .map(id => (
                                        <List.Item key={id}>
                                            <List.Content floated='right' verticalAlign='middle'>
                                                <Button compact onClick={(event) => this.onUnblockUser(event, id)}>Unblock</Button>
                                            </List.Content>
                                            <List.Content verticalAlign='middle'>
                                                {this.props.usersDetails[id] ? this.props.usersDetails[id].username : ''}
                                            </List.Content>
                                        </List.Item>)
                                    )}
                            </List>
                        </Form.Field>

                        <ChatSettingsFormBlacklist
                            onNewBlockedChange={this.props.onNewBlockedChange}
                            alreadyBlocked={this.props.blockedList}
                        />
                    </Form>
                </Segment>
            </Segment.Group>
        )
    }

    onUnblockUser = (event, id) => {
        this.props.dispatch(requestUnblockUser(id));
    }
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

export default connect(mapStateToProps)(ChatSettingsForm);