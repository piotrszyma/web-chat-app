import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button, Modal} from "semantic-ui-react";
import {closeAlert} from "../../../redux/actions/alert";

class ChatAlert extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
                open={this.props.alert.open}
                size='mini'
                closeOnEscape={false}
                basic>
                <Modal.Header>Warning</Modal.Header>
                <Modal.Content>
                    <p>{this.props.alert.text}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button content='Ok' onClick={this.closeModal} />
                </Modal.Actions>
            </Modal>
        );
    }

    closeModal = () => this.props.dispatch(closeAlert());
}

const mapStateToProps = state => {
    return {
        alert: state.alert
    }
};

export default connect(mapStateToProps)(ChatAlert);