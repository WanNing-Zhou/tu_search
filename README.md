# tu_search

一个基于vue3开发的utools的搜图插件

![gif0.gif](./doc/imgs/gif0.gif)

## 目录说明
- `src` 前端源代码‘
- `public` 静态资源
  -  `preload` preloadjs代码
    - `request` 封装的请求
      - `findByImg.js`  根据图片搜索请求
      - `findByWord.js` 根据文本搜索请求
    - `tools` 工具函数
      - `findByImg.js`  根据图片搜索
      - `findByWord.js` 根据文本搜索
    - `server.js` preload服务入口


## 如果项自定义搜索图源

1. 在`public/preload/request`目录下的js文件中按照需求添加请求
2. 在`public/preload/tools`目录下的js文件中按照需求添加搜索函数
3. 在`public/preload/server.js` 引用tools中的搜索函数
4. 按照需求更改FBImg或者FBWord的的searchList中的值


## 下载依赖
1. 在项目根目录运行
```
npm install
```

## 开发
1. 在项目根目录运行
```
npm run dev
```

## 打包

1. 在项目根目录运
```
npm run build
```
2. 在utools的开发者工具中进行打包

可以打包成本地包或者进行发布