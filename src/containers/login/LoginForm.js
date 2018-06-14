import React from 'react';
import classnames from 'classnames';
import {GoogleLogin} from 'react-google-login';
import {Form, Segment} from "semantic-ui-react";
import LoginService from "../../services/auth/auth-service";
import {requestLoginAndCreateSocket} from "../../redux/actions/auth";
import {withRouter} from "react-router-dom";
import * as ConfigService from "../../services/common/config-service";
import {connect} from "react-redux";
import {openAlert} from "../../redux/actions/alert";

class LoginForm extends React.Component {
    render() {
        const loginGoogleClass = classnames('login__google');
        return <Form size='large'>
            <Segment stacked>
                <Form.Field>
                    <GoogleLogin
                        className={loginGoogleClass}
                        clientId={ConfigService.getGoogleToken()}
                        buttonText="Login with Google"
                        onSuccess={this.googleAuthSuccess}
                        onFailure={this.googleAuthFailure}
                    />
                </Form.Field>
            </Segment>
        </Form>
    };

    googleAuthSuccess = (googleResponse) => {
        const client = {
            username: googleResponse.getBasicProfile().ig,
            avatarUrl: googleResponse.profileObj.imageUrl
        };
        const tokenExpiration = googleResponse.getAuthResponse().expires_at;
        const jwtAccessToken = googleResponse.tokenId;
        LoginService.login(jwtAccessToken)
            .then(response => {
                if(response.success) {
                    if (!response.data.token || !response.data.refresh_token) {
                        this.props.dispatch(openAlert("Wrong Google Token... contact administrator"));
                        return;
                    }
                    const tokens = {
                        token: response.data.token,
                        refreshToken: response.data.refresh_token
                    };
                    this.props.dispatch(requestLoginAndCreateSocket(
                        client,
                        tokens,
                        tokenExpiration));
                    this.props.history.push('/');
                } else {
                    this.props.dispatch(openAlert("Cannot connect to server... it might be offline?"))
                }

            })
            .catch(error => {
                alert(error);
            });
    };

    googleAuthFailure = (reject) => {
        console.log(reject);
    };

}

export default withRouter(connect()(LoginForm))