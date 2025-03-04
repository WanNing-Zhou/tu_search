
import ImageCompressor from 'image-compressor.js';
import string from "async-validator/dist-types/validator/string";

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
            handleError('文件读取失败')
            reject(error)} ;
    });
}

/**
 * file转换为blob
 * @param file
 */
export function fileToBlob(file: File) {
    return new Blob([file]);
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

export function handleError(e: Error | string) {
    let message = '';
    if(typeof e === 'string') {
        message = e;
    } else {
        message = e.message;
    }
    utools.showNotification(message + "\n嘿嘿~ 出bug啦，请反馈给开发者吧，及时修复哦~");
    console.error(e)
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

export default function compressFile(file: File):Promise<File> {
    return new Promise((resolve, reject) => {
        const options: any = {
            success(result) {
                // 将压缩后的 Blob 转换为 File 对象（如果组件支持Blob则不用这一步）
                const compressedFile = new File([result], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                });
                return resolve(compressedFile);
            },
            error(e) {
                return reject(e);
            },
        };
        // 1-3MB
        if (file.size > 1024 * 1024 && file.size <= 3 * 1024 * 1024) {
            options.quality = 0.3; // 压缩质量
            options.convertSize = false;//不进行图像尺寸的调整
            options.checkOrientation = false; // 图片翻转，默认为false
        }
        // 3-4MB
        if (file.size > 3 * 1024 * 1024 && file.size <= 4 * 1024 * 1024) {
            options.quality = 0.25; // 压缩质量
            options.convertSize = false;//不进行图像尺寸的调整
            options.checkOrientation = false; // 图片翻转，默认为false
        }
        // 5-6MB
        if (file.size > 5 * 1024 * 1024 && file.size <= 6 * 1024 * 1024) {
            options.quality = 0.2; // 压缩质量
            options.convertSize = false;//不进行图像尺寸的调整
            options.checkOrientation = false; // 图片翻转，默认为false
        }
        // 6-7MB
        if (file.size > 6 * 1024 * 1024 && file.size <= 7 * 1024 * 1024) {
            options.quality = 0.15; // 压缩质量
            options.convertSize = false;//不进行图像尺寸的调整
            options.checkOrientation = false; // 图片翻转，默认为false
        }
        // 7-9MB
        if (file.size > 7 * 1024 * 1024 && file.size <= 9 * 1024 * 1024) {
            options.quality = 0.1; // 压缩质量
            options.convertSize = false;//不进行图像尺寸的调整
            options.checkOrientation = false; // 图片翻转，默认为false
        }
        new ImageCompressor(file, options);
    });
}

