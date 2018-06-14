import React, {Component} from 'react';
import {Grid} from "semantic-ui-react";
import ChatList from "./list/ChatList";
import ChatConversation from "./conversation/ChatConversation";
import classnames from 'classnames';
import {Route, withRouter} from "react-router-dom";
import ChatMenu from "./menu/ChatMenu";
import Container from "semantic-ui-react/dist/es/elements/Container/Container";
import {connect} from "react-redux";
import SocketService from '../../services/socket/socket-service';

class Chat extends Component {
    constructor(props) {
        super(props);
        if (!props.auth.isLogged) {
            this.props.history.push("/login");
        } else {
            SocketService.getOrCreateChannel("conversation:lobby");
            SocketService.getOrCreateChannel("user:lobby");
        }
    }

    render() {
        const gridClass = classnames('chat__grid');

        return (
            <div>
                <Container
                    fluid={true}>
                    <ChatMenu/>
                </Container>
                <Grid
                    padded
                    className={gridClass}>
                    <Grid.Row>
                        <Grid.Column
                            width={3}>
                            <ChatList/>
                        </Grid.Column>
                        <Grid.Column
                            width={13}>
                            <Route path="/:id?" component={ChatConversation}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
};

export default withRouter(connect(mapStateToProps)(Chat))