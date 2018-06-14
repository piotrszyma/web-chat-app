import React, {Component} from 'react';
import {Form, Dropdown} from 'semantic-ui-react'
import {requestFindUserByName} from "../../../redux/actions/users";
import {connect} from "react-redux";

class ChatSettingsFormBlacklist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            options: [],
            users: []
        }
    }

    render() {
        const {options, users, searchQuery} = this.state;

        return (
            <Form.Field>
                <label>Add user to blacklist</label>
                <Dropdown placeholder='No users to block'
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
        this.setState({
            searchQuery: '',
            users: value
        });
        this.props.onNewBlockedChange(value);
    };

    handleSearchChange = (event, data) => {
        const query = data.searchQuery;
        this.setState({
            searchQuery: query
        });

        if (query.length < 3) {
            return;
        }

        if(query.trim() !== query) {
            return;
        }
        requestFindUserByName(query)
            .then(users => {
                this.setState({
                    options: [...users
                        .filter(u => !this.props.client.blockedList.includes(u.id)
                            && u !== this.props.client.id)
                        .map(u => ({
                            key: u.id,
                            text: u.username,
                            value: u.id
                        })), ...this.state.users],
                });
            });
    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        users: state.users,
        client: state.auth.client
    }
};

export default connect(mapStateToProps)(ChatSettingsFormBlacklist);
