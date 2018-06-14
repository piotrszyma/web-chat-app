import React from 'react';
import {Comment, Icon} from "semantic-ui-react";
import classnames from 'classnames';
import {timeStampToDateStr} from "../../../utils/time";
import {connect} from "react-redux";
import MessageParser from "../../../services/parser/message";
import SnippetParser from "../../../services/parser/snippet";
import Popup from "semantic-ui-react/dist/es/modules/Popup/Popup";
import SocketService from "../../../services/socket/socket-service";
import {trimUsername} from "../../../utils/trim";

class Message extends React.Component {

    render() {
        const messageClass = classnames('message');
        SocketService.getOrCreateChannel(`user:${this.props.message.author.id}`);
        return <div className={messageClass}>
            <Comment>
                <Comment.Avatar src={this.props.user.avatarUrl}/>
                <Comment.Content>
                    <Comment.Author as='a'>{trimUsername(this.props.user.username)}</Comment.Author>
                    <Comment.Metadata>
                        {timeStampToDateStr(this.props.message.timestamp)}

                        <Popup
                            inverted
                            trigger={
                                (<Icon className="icon-info-message" name='info circle'/>)
                            }
                            position='bottom center'
                            size="mini"
                            on="hover"
                        >
                            <Popup.Content>
                                {
                                    this.props.message.readBy.length > 0 ? (
                                        <p>Read
                                            by: {this.props.message.readBy.map(id => this.props.usersDetails[id] ? trimUsername(this.props.usersDetails[id].username) : '').join(', ')}</p>
                                    ) : (
                                        <p>Not read</p>
                                    )
                                }
                            </Popup.Content>
                        </Popup>

                    </Comment.Metadata>
                    {parseMessage[this.props.message.type] ? parseMessage[this.props.message.type](this.props.message.content) : 'UNKNOWN MESSAGE TYPE'}
                </Comment.Content>


            </Comment>
        </div>
    }
}

const parseMessage = {
    'text': MessageParser.parse,
    'snippet': SnippetParser.parse
};

const getUserById = (users, client, authorId) => {
    return users[authorId] ? users[authorId] : {
        avatarUrl: client.avatarUrl,
        username: client.username
    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        user: getUserById({...state.users}, state.auth.client, ownProps.message.author.id),
        usersDetails: {
            ...state.users, [state.auth.client.id]: {
                username: state.auth.client.username,
                avatarUrl: state.auth.client.avatarUrl
            }
        },
    }
};

export default connect(mapStateToProps)(Message)
