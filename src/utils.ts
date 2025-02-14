import {ElMessage} from "element-plus";

/**
 * 将base64转换为file
 * @param base64
 * @param filename
 */
export function base64ToFile(base64: string, filename: string) {
    // 提取 MIME 类型
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    // 解码 Base64 数据
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    // 创建 Blob 对象
    const blob = new Blob([u8arr], { type: mime });
    // 创建 File 对象
    return new File([blob], filename, { type: mime });
}

/**
 * 将file转换为base64
 * @param file
 * @returns
 */



export function fileToBase64(file: File):Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => {
            console.log('error reader')
            reject(error)} ;
    });
}



/**
 * 判断是否为图片
 * @param file
 */
export function isImage(file: File) {
    const type = file.type;
    return type.indexOf('image') === 0;
}

/**
 * 正则获取文件名
 * @param url
 */

export function getFileName(url: string) {
    const reg = /\/([^\/]+)$/;
    const regRes = reg.exec(url);
    if(!regRes) return null;
    return regRes[1];
}

/**
 * 异常处理
 * @param e
 */

export function handleError(e: any) {
    utools.showNotification("嘿嘿~ 出bug啦，请反馈给开发者吧，及时修复哦~")
}

/**
 * 根据图片地址获取base64编码
 * @param src
 */
export async function imageToBase64(src: string):Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // 处理跨域问题
        img.src = src;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // 将画布内容转换为 Base64 编码
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };
    });
}

