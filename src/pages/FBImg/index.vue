<script setup lang="ts">

import {onMounted, ref, watch} from "vue";

import searchList from "./searchList";
import compressFile, {base64ToFile, fileToBase64, handleError, imageToBase64} from "../../utils.ts";
import {UploadFilled} from "@element-plus/icons-vue";
import Waterfall from "wq-waterfall-vue3";
import {UploadFile} from "element-plus";

type Prop = {
  enterAction: any
}

const props = defineProps<Prop>()
const imgFile = ref<File | null>(null)
const imgBase64 = ref<string>('')
const fileList = ref<File[]>([])
const pageLoading = ref(false)
const searchListVal = searchList;
const activeName = ref(searchListVal[0].alias);
const page = ref<number>(0)
const imagesList = ref<{
  name: string,
  src: string,
  orgSrc: string
}[]>([])
const showBodyEl = ref()


onMounted(async () => {
  if (!props.enterAction) return
  const type = props.enterAction.type
  if (type === "files") {
    try {
      // 根据path创建file对象
      const _file = window.services.readFile(props.enterAction?.payload[0].path) as File
      imgBase64.value = await fileToBase64(_file)
    } catch (err) {
      handleError(new Error('文件读取错误'))
    }

  } else if (type === "img") {
    imgBase64.value = props.enterAction.payload
    // 根据base64创建file对象
    imgFile.value = base64ToFile(imgBase64.value, 'default.png')
  }
})

async function imgFileTransform(file: File) {
  if(!file) return
  imgFile.value = await compressFile(file)
  imgBase64.value = await fileToBase64(imgFile.value)
}

const uploadClickHandle = async (event: Event) => {

  // 启动utools选择文件
  event.preventDefault()
  event.stopPropagation()
  const files = window.utools.showOpenDialog({
    title: '选择文件',
    properties: ['openFile']
  })

  if (!files || files.length === 0) {
    utools.showNotification("请选择文件")
    return
  } else if (files.length > 1) {
    utools.showNotification("请选择单个文件")
    return
  }

  const _filePath = files[0]
  try {
    const _file = window.services.readFile(_filePath)
    await imgFileTransform(_file)
  } catch (err) {
    handleError("文件读取错误")
  }
}


watch(imgBase64, async (newVal, oldVal) => {
  if (newVal === oldVal) return
  pageLoading.value = true
  const resList = await window.services.searchByImg(activeName.value, {
    imgBase64: imgBase64.value,
    imgFile: imgFile.value as File,
    page: 0,
  })
  imagesList.value = resList
  pageLoading.value = false
}, {once: true})

const loading = ref(false);

const loadHandle = async () => {
  if (loading.value) return
  loading.value = true
  page.value++
  const resList = await window.services.searchByImg(activeName.value, {
    imgBase64: imgBase64.value,
    imgFile: imgFile.value as File,
    page: page.value,
  })
  imagesList.value.splice(imagesList.value.length, 0, ...resList)
  loading.value = false
}


const copyHandle = async (src: string) => {
  try {
    const b64 = await imageToBase64(src)
    window.utools.copyImage(b64)
    ElMessage.success('已复制到剪切板')
  } catch (err) {
    handleError(new Error('复制失败'))
  }
}

const saveHandle = async (data: any) => {
  const name = Date.now()
  let b64 = ''
  let savePath = ''
  let orgFlag = true
  pageLoading.value = true
  try {
     // 先保存原始图片
     b64 = await imageToBase64(data.orgSrc)
     savePath =  window.services.writeImgFile(b64, name + '.png')
  }catch(err) {
    // 原始图片保存失败，尝试保存压缩后的图片
    orgFlag = false
  }
  if (!orgFlag){
    try {
      b64 = await imageToBase64(data.src)
      savePath =  window.services.writeImgFile(b64, name + '.png')
    }catch (err){
      handleError(new Error('文件保存错误'))
    }
  }
  if (!savePath) {
    ElMessage.warning('取消保存')
  } else {
    ElMessage.success('保存成功')
  }
  pageLoading.value = false
}


async function  fileChange(file: UploadFile) {
  if (!file || !file.raw) return
  await imgFileTransform(file.raw)
}

</script>

<template>

  <!--  <img :src="imgBase64">-->
  <div>
    <div class="upload-main" v-if="!imgBase64">
<!--      <el-upload-->
<!--          @click.capture="uploadClickHandle"-->
<!--          class="upload-comp"-->
<!--          drag-->
<!--          v-model:file-list="fileList"-->
<!--          accept="image/*"-->
<!--          :auto-upload="false"-->
<!--      >-->
      <el-upload
          @click.capture="uploadClickHandle"
          @change="fileChange"
          class="upload-comp"
          drag
          v-model:file-list="fileList"
          accept="image/*"
          :auto-upload="false"
          limit="1"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          拖动或 <em>点击此处</em> 上传图片
        </div>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 2MB
          </div>
        </template>
      </el-upload>
    </div>

    <div v-if="imgBase64" class="page-main">
      <el-tabs v-model="activeName" class="demo-tabs">
        <template v-for="(item, index) in searchListVal" :key="index">
          <el-tab-pane :label="item.alias" :name="item.alias">
            <div></div>
          </el-tab-pane>
        </template>
      </el-tabs>

      <div v-loading="pageLoading" ref="showBodyEl" class="content-body">
        <Waterfall  v-if="imagesList.length" :row-gap="8" :column-gap="8" :load-over-callback="loadHandle" :maxParallelTasks="16" :load-num="16" :images="imagesList">
          <template #item="{item}">
            <el-popover
                trigger="click"
                :hide-after="0"
                :append-to="showBodyEl"
            >
              <div class="center">
                <el-button size="small" @click="copyHandle(item.data.src)" text>复制</el-button>
                <el-button size="small" @click="saveHandle(item.data)" text>保存</el-button>
              </div>
              <template #reference>
                <div
                    class="image-link link-cursor"
                >
                  <el-image class="image-item" :src="item.url" loading="lazy" />
                  <el-image class="image-item" :src="item.url" loading="lazy" />
                </div>
              </template>
            </el-popover>
          </template>
        </Waterfall>
        <div class="load-footer" v-if="loading"><p>正在全力加载中。。。</p></div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.upload-main {
  color: #1a1a1a;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-comp {
  width: 80%;
  margin-top: 40px ;
}

.icon {
  color: #A8ABB2
}

.grid {
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
}

.grid-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-main {
  height: calc(100vh - 20px);
  padding: 10px;

  .content-body {
    height: calc(100vh - 70px);
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
  }
}


.result-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
  position: relative;
  cursor: pointer;
  border-radius: 10px;

  .result-card-thumbnail {
    border: 2px solid transparent;
    border-radius: 10px;
    height: 100%;
  }

  .result-image-wrapper {
    display: flex;
    background-repeat: no-repeat;
    border-radius: 8px 8px 8px 10px;
    overflow: hidden;
    transition: all .3s ease;
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
    height: 100%;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .result-image {
    width: 100%;
    object-fit: contain;
    z-index: 10;
    overflow: hidden;
  }

  .title-container {
    display: flex;
    align-items: center;
    column-gap: 4px;

    .title {
      font: 400 14px / 16px NotoSans-Regular;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #312758;
      line-height: 18px;
      flex-grow: 1;
    }
  }

}

.center {
  display: flex;
  align-items: center;
}

.image-link {
  display: block;
  height: 100%;
  cursor: default;
  border: #1a1a1a solid 1px;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;

  .image-item {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    //border-radius: var(--border-radius);
    display: inline-block;
    vertical-align: bottom;
  }
}

.link-cursor {
  cursor: pointer;
}

.load-footer {
  text-align: center;
}

</style>