import React from 'react';
import { Comment } from 'semantic-ui-react';
import classnames from 'classnames';
const messageImg = {
    ':)': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/za5/1.5/16/1f642.png',
        alt: '😗'
    },
    ':(': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/z7b/1.5/16/1f61e.png',
        alt: '😞'
    },
    ':D': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/z27/1.5/16/1f600.png',
        alt: '😀'
    },
    ':d': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/z27/1.5/16/1f600.png',
        alt: '😀'
    },
    ':*': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/z4d/1.5/16/1f617.png',
        alt: '😗'
    },
    '<3': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/zf3/1.5/16/2764.png',
        alt: '❤'
    },
    '(y)': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/zcc/1.5/16/f0000.png',
        alt: '󰀀'
    },
    ':rage:': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/z65/1.5/16/1f620.png',
        alt: '😠'
    },

    '(n)': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/zd6/1.5/16/1f44e.png',
        alt: '👎'
    },
    '3:)': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/z2f/1.5/16/1f608.png',
        alt: '😈'
    },
    'B)': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/zdc/1.5/16/1f60e.png',
        alt: '😎'
    },
    ':\'(': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/z67/1.5/16/1f622.png',
        alt: '😢'
    },
    ':goblin:': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/zaf/1.5/16/1f47a.png',
        alt: '👺'
    },
    ':tongue:': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/za6/1.5/16/1f445.png',
        alt: '👅'
    },
    ':santa:': {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/ze1/1.5/16/1f385.png',
        alt: '🎅'
    },
    ';)' : {
        url: 'https://static.xx.fbcdn.net/images/emoji.php/v9/zb0/1.5/16/1f609.png',
        alt: '😉'
    }
};

const msgStyle = {
    height: 1 + 'rem',
    transform: 'translateY(1px)',
    position: 'relative'
};

const MessageParser = {
    parse: (message) => {
        const textWrapperClassName = classnames('chat__msg-text-wrapper');
        const msg =  message
            .split("")
            .reduce((acc, char) => {
                if (acc.length === 0) return [char];
                if (acc.slice(-1)[0] === "\u00a0") {
                    return char === " " ? [...acc.slice(0, acc.length - 1), acc[acc.length - 1] + "\u00a0"] : [...acc, char];
                } else {
                    return char === " " ? [...acc, "\u00a0"] : [...acc.slice(0, acc.length - 1), acc[acc.length - 1] + char];
                }
            }, [])
            .map((t, i) => {
                if (Object.keys(messageImg).includes(t)) {
                    return (<img style={msgStyle} alt={messageImg[t].alt} key={i} src={messageImg[t].url}/>)
                } else {
                    return (<span key={i}>{t}</span>)
                }
            });
        return (<Comment.Text className={textWrapperClassName}>{msg}</Comment.Text>);
    }

};

export default MessageParser;
