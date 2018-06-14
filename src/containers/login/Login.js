import React from 'react';
import {Grid, Header, Icon, Message} from 'semantic-ui-react'
import {GoogleLogin} from "react-google-login";
import LoginForm from "./LoginForm";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class Login extends React.Component {
    constructor(props) {
        super(props);
        if (props.auth.isLogged) {
            this.props.history.push("/");
        }
    }

    render() {
        return (
            <Grid
                textAlign='center'
                style={{ height: '100%' }}
                verticalAlign='middle'
            >
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h1' color='teal' icon>
                        <Icon name='chat' />
                        ChatApp
                    </Header>
                    <Header as='h3'>
                        Sign in
                        <Header.Subheader>
                            Login using your Google account credentials
                        </Header.Subheader>
                    </Header>
                    <LoginForm/>
                    <Message>
                        New to us? Just log in using your Google account
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }

}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
};

export default withRouter(connect(mapStateToProps)(Login))
