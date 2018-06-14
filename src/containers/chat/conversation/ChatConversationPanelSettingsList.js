import React, {Component} from 'react';
import {Dropdown, Form, Segment} from "semantic-ui-react";
import {connect} from "react-redux";
import {requestFindUserByName} from "../../../redux/actions/users";

class ChatConversationPanelSettingsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            users: [],
            searchQuery: '',
        }
    }


    render() {
        const {options, users, searchQuery} = this.state;
        return (
            <Form.Field>
                <label>Add new users to conversation</label>
                <Dropdown placeholder='No new users'
                          fluid
                          multiple
                          selection
                          search
                          minCharacters={3}
                          openOnFocus={false}
                          searchQuery={searchQuery}
                          options={options}
                          value={users}
                          onSearchChange={this.handleSearchChange}
                          onChange={this.handleChange}
                />
            </Form.Field>)
    }

    handleChange = (event, {value}) => {
        console.log(value);
        this.setState({
            searchQuery: '',
            users: value
        });
        this.props.onUsersAdd(value);
    };

    handleSearchChange = (event, data) => {
        const query = data.searchQuery;
        this.setState({
            searchQuery: query
        });

        if (query.length < 3) {
            return;
        }
        if (query.trim() !== query) {
            return;
        }
        requestFindUserByName(query)
            .then(users => {
                const alreadyInOptions = this.state.options;
                const alreadyInOptionsIds = this.state.options.map(u => u.key);
                const receivedUsers = users.map(u => ({
                    key: u.id,
                    text: u.username,
                    value: u.id
                })).filter(u => !alreadyInOptionsIds.includes(u.key));

                this.setState({
                    options: [...alreadyInOptions, ...receivedUsers]
                });
                
            }).catch(() => {});
    };

}

const mapStateToProps = (state, ownProps) => {
    return {
        usersDetails: {
            ...state.users, [state.auth.client.id]: {
                username: state.auth.client.username,
                avatarUrl: state.auth.client.avatarUrl
            }
        }
    }
};

export default connect(mapStateToProps)(ChatConversationPanelSettingsList);