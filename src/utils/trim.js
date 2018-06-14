export const trimMessage = (message) => message ? message.content.slice(0, 100) : '';
export const trimTitle = (title) => title ? title.length > 20 ? title.slice(0, 20) + '...' : title : '';
export const trimUsername = (username) => username ? username.length > 10 ? username.slice(0, 7) + '...' : username : '';