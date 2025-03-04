/**
 * 处理错误
 * @param {string|Error} error
 * @returns {void}
 */
function handleError(error) {
    // 判断error是否是字符串
    let message = ''
    if (typeof error === 'string') {
        message = error
    }
    // 判断error是否是Error对象
    if (error instanceof Error) {
        message = error.message
    }
    utools.showNotification(message, "\n请及时反馈给开发者进行更改" );
}

module.exports = {
    handleError
}