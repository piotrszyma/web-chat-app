import React, { Component } from 'react'
import {Menu} from 'semantic-ui-react'
import List from "semantic-ui-react/dist/es/elements/List/List";
import {withRouter} from "react-router-dom";
import classnames from 'classnames';
import ChatSettings from "../settings/ChatSettings";
import ChatAddConversation from "../addconversation/ChatAddConversation";
import {requestLogoutAndDeleteSocket} from "../../../redux/actions/auth";
import {connect} from "react-redux";
import {trimUsername} from "../../../utils/trim";

class ChatMenu extends Component {
    render() {
        const chatMenuClass = classnames('chat__menu');

        return (
            <Menu
                icon
                inverted
                borderless={true}
                className={chatMenuClass}
            >
                <Menu.Item>
                    <List>
                        <List.Item icon='chat' content="ChatApp" />
                    </List>
                </Menu.Item>

                <Menu.Menu position='right'>
                    <Menu.Item>
                        Logged in as: {trimUsername(this.props.username)}
                    </Menu.Item>
                    <ChatSettings/>
                    <ChatAddConversation/>
                    <Menu.Item name='logout' onClick={this.onLogoutButtonClick}>
                        Log out
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }

    onLogoutButtonClick = () => {
        this.props.dispatch(requestLogoutAndDeleteSocket(this.props.history));
    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        username: state.auth.client.username
    }
};

export default withRouter(connect(mapStateToProps)(ChatMenu));
