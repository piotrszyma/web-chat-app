import React from 'react';
import {Dropdown} from "semantic-ui-react";
import {requestFindUserByName} from "../../../redux/actions/users";

/**
 * Component that holds list of users to add to new conversation
 */
class ChatAddConversationFormDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            searchQuery: '',
            _mounted: true
        };
    }

    componentWillMount() {
        this.setState({
            options: [],
            searchQuery: ''
        })
    }

    componentDidMount() {
        this.setState({
            _mounted: true
        })
    }

    componentWillUnmount() {
        this.setState({
            _mounted: false
        })
    }


    render() {
        const {options, searchQuery} = this.state;
        return (
            <Dropdown placeholder='Select users'
                      fluid
                      multiple
                      selection
                      search
                      minCharacters={3}
                      openOnFocus={false}
                      searchQuery={searchQuery}
                      options={options}
                      onSearchChange={this.handleSearchChange}
                      onChange={this.handleChange}
            />

        )
    }

    handleChange = (event, data) => {
        this.props.handleChange(event, data);
        this.setState({
            searchQuery: ''
        });
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
                const includedUsers = this.state.options.map(o => o.key);
                const fetchedUsers = users
                    .filter(u => !includedUsers.includes(u.id))
                    .map(u => ({
                    key: u.id,
                    text: u.username,
                    value: u.id
                }));
                this.setState({
                    options: [...this.state.options, ...fetchedUsers],
                },
                    () => {console.log("after state update: ", this.state.options)});
                console.log("not after: ", [...this.state.options, ...fetchedUsers]);
            }).catch(() => {});
    };


}

export default ChatAddConversationFormDropdown