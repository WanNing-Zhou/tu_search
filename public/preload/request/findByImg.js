const {request} = require("axios");


/**
 * 百度识图
 * @interface PostLensoAiData
 * @property {string} img - 图片的base64编码。
 */


/**
 * lensoAi 识图
 * @param {PostLensoAiData} params
 * @returns {Promise<*|void>}
 */
async function postLensoAiImg(params) {
    const reqUrl = 'https://lenso.ai/api/upload'
    try {
        const resData = await request({
            url: reqUrl,
            method: 'POST',
            data: {
                image: params.img
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        return resData.data
    } catch (err) {
        console.error('lensoAi图片上传错误，请联系开发者进行更新')
        return null
    }
}

/**
 * @interface GetLensoAiData
 * @property {string} imgBase64 - 图片的base64编码。
 * @property {number} page - 图片的页数。
 * @property {string} id - 服务端返回的id。
 */


/**
 * lensoAi 识图
 * @param {GetLensoAiData} params
 * @returns {Promise<*|void>}
 */

async function getLensoAiSearch(params) {
    const searchData = {
        'lensoAi': {
            "image": {"id": '', "data": '',},
            "effects": {"rotation": 0, "zoom": 1, "pX": 0, "pY": 0, "cX": 0, "cY": 0, "cW": 1, "cH": 1},
            "selection": {"top": 0, "left": 0, "right": 1, "bottom": 1},
            "domain": "",
            "text": "",
            "page": 0,
            "type": "related",
            "sort": "",
            "seed": 0,
            "facial_search_consent": 1
        }
    }
    const reqUrl = 'https://lenso.ai/api/search'
    searchData.lensoAi.page = params.page;
    searchData.lensoAi.image.data = params.imgBase64;
    searchData.lensoAi.image.id = params.id;
    try {
        const resData = await request({
            url: reqUrl,
            method: 'POST',
            data: searchData.lensoAi,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        return resData.data
    }catch(err) {
        console.log('获取lensoAi图片失败，请联系开发者进行更新')
        return null
    }
}

module.exports = {
    postLensoAiImg,
    getLensoAiSearch
}

