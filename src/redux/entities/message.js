export const M_SENDING = 'MSG_SENDING';
export const M_SENT = 'MSG_SENT';
export const M_READ = 'MSG_READ';

export const T_TEXT = 'text';
export const T_SNIPPET = 'snippet';
// id: 2,
//     author: 1,
//     type: 'text',
//     content: 'Lorem ipsum',
//     timestamp: 123123123,
//     status: M_SENDING
export const generateMessage = (id, author, type, content, timestamp, status) => {
  return {
      id: id,
      authorId: author,
      type: type,
      content: content,
      timestamp: timestamp,
      status: status
  }
};