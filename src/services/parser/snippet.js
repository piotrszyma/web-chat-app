import React from 'react';
import { Comment } from 'semantic-ui-react';
import classnames from 'classnames';
// import {markdown} from 'markdown';

const SnippetParser = {
    parse(message) {
        const snippetWrapperClassName = classnames('chat__msg-snippet-wrapper');
        return (
            <Comment.Text className={snippetWrapperClassName}>
                <code className={"chat__msg-snippet"}>
                    {message}
                </code>
            </Comment.Text>
            )
    }
};

export default SnippetParser;
