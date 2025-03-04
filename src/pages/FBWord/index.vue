<script lang="ts" setup>
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import Waterfall from "wq-waterfall-vue3";
import {handleError, imageToBase64} from "@/utils.ts";

const searchList = [
  {
    alias: "必应",
    name: "bing",
  },
  {
    alias: "搜狗",
    name: "sougou",
  },
  {
    alias: "百度",
    name: "baidu",
  }
]

const inputVal = ref('')
const searchVal = reactive({
  search: '',
  page: 0,
  engine: 'bing',
})
const imagesList = ref<any[]>([])
const pageLoading = ref(false)
const loading = ref(false)
const showBodyEl = ref()


const activeName = ref('bing')
const waterfallRef = ref()

watch(activeName, async (newVal, oldVal) => {
  if (newVal === oldVal) return
  await handleSearch()
})

const searchImages = async () => {
  if (searchVal.page === 0) {
    imagesList.value = []
  }
  loading.value = true
  const imgArr = await window.services.findByWord({
    search: searchVal.search || '壁纸',
    page: searchVal.page,
    engine: searchVal.engine,
  })

  imagesList.value.push(...imgArr)
  searchVal.page++
  loading.value = false
}

const handleSearch = async () => {
  searchVal.search = inputVal.value
  searchVal.page = 0
  searchVal.engine = activeName.value
  pageLoading.value = true
  await searchImages()
  await nextTick(() => {
    waterfallRef.value?.updateWaterfall()
  })
  pageLoading.value = false
}

const copyHandle = async (src: string) => {
  try {
    const b64 = await imageToBase64(src)
    window.utools.copyImage(b64)
    ElMessage.success('已复制到剪切板')
  } catch (err) {
    handleError(err)
  }
}

const saveHandle = async (src: string) => {
  const name = Date.now()
  ElMessage ({
    message: '正在保存中...',
    type: 'info',
  })
  try {
    const b64 = await imageToBase64(src)
    const savePath = window.services.writeImgFile(b64, name + '.png')
    if (!savePath) {
      ElMessage.warning('取消保存')
    } else {
      ElMessage.success('保存成功')
    }
  } catch (err) {
    handleError(err)
  }
}
onMounted(()=>{
  searchImages()
})

</script>

<template>
  <div class="fbw-page">
    <el-row justify="center">
      <el-col :span="12">
        <el-row :gutter="16">
          <el-col :span="20">
            <el-input @keydown.enter="handleSearch" v-model="inputVal"/>
          </el-col>
          <el-col :span="4">
            <el-button type="text" @click="handleSearch">
              搜索
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane v-for="(item) in searchList" :label="item.alias" :name="item.name" :key="item.name">
      </el-tab-pane>
    </el-tabs>

    <div v-loading="pageLoading" ref="showBodyEl" class="content-body">
      <!--        <img :src="imgBase64"/>-->
      <Waterfall ref="waterfallRef" :row-gap="8" :column-gap="8" :load-over-callback="searchImages" :images="imagesList">
        <template #item="{item}">
          <el-popover
              trigger="click"
              :hide-after="0"
              :append-to="showBodyEl"
          >
            <div class="center">
              <el-button size="small" @click="copyHandle(item.data.src)" text>复制</el-button>
              <el-button size="small" @click="saveHandle(item.url)" text>保存</el-button>
            </div>
            <template #reference>
              <div
                  class="image-link link-cursor"
              >
                <el-image class="image-item" :src="item.url" loading="lazy" />
              </div>
            </template>
          </el-popover>
        </template>
      </Waterfall>
      <div class="load-footer" v-if="loading"><p>正在全力加载中。。。</p></div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.wq-flex {
  display: flex;
}

.fbw-page {
  height: calc(100vh - 40px);
  //overflow: hidden;
  padding: 10px;

  .content-body {
    position: relative;
    height: calc(100% - 60px);
    overflow-y: scroll;
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