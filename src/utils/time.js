export const timeStampToDateStr = (timestamp) => {
    const date = new Date(timestamp);
    const day = ("0" + date.getDate()).substr(-2);
    const month = ("0" + date.getMonth()).substr(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).substr(-2);
    const minutes = ("0" + date.getMinutes()).substr(-2);
    // const seconds = ("0" + date.getSeconds()).substr(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};