<template>
  <div
      class="drop-zone c-normal"
      :class="{
			borderOutline: outline,
		}"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="chooseFiles"
  >
    <div v-if="files.length < 1" class="flex items-center justify-center">
      <slot name="blank">
        <div class="f-6">
          <el-icon><upload-filled/></el-icon>
        </div>
      </slot>
    </div>
    <div v-if="files.length < 1">
      <slot name="title" :is-dragging="isDragging">
        <div v-if="!isDragging" class="upload-instructions f6">点击或将文件拖到这里上传</div>
        <div v-else class="dragging-feedback">释放以上传文件</div>
      </slot>
    </div>

    <div class="flex items-center">
      <div v-for="(file, index) in files" :key="index" class="flex file-item pa2 flex-column">
        <div class="f2 pa2">
          <el-icon><document/></el-icon>
        </div>
        <div class="f6 truncate">{{ file.name }}</div>
        <div class="delete-icon" @click.stop="removeFile(index)">
          <el-icon><delete/></el-icon>
        </div>
      </div>
    </div>
    <input ref="fileInput" type="file" multiple style="display: none" @change="inputChange" />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import {Delete, Document, UploadFilled} from "@element-plus/icons-vue";

type Prop = {
  outline?: boolean;
  maxFiles?: number;
  data: any;
  fileChange?: (data: any) => boolean | Promise<boolean>;
};

const props = withDefaults(defineProps<Prop>(), {
  outline: true,
  maxFiles: -1,
  data: [],
  fileChange: () => true,
});

const emits = defineEmits(['update:data']);

const isDragging = ref(false);
const files = computed({
  get() {
    return props.data;
  },
  set: async (val) => {
    const flag = await props.fileChange(val);
    if (val.length > props.maxFiles){
      //:TODO 这里需要自定义一哈
      console.log('最多只能上传'+props.maxFiles+'个文件');
      return
    }
    if (flag === false) {
      return;
    }
    emits('update:data', val);
  },
});
const fileInput = ref<HTMLInputElement>();

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const newFiles: File[] | any = e.dataTransfer?.files || [];
  files.value = [...files.value, ...newFiles];
};

const chooseFiles = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const inputChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const newFiles = target.files || [];
  files.value = [...files.value, ...newFiles];
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
};
</script>

<style lang="scss" scoped>
/*这里的我用的是外部的公共样式, 实际并没有在组件内, 这里将用到的样式复制在下面了*/
:root{
  --c-normal: #a6a5ad;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.c{
  &-normal{
    color: var(--c-normal);
  }
}
.f2 {
  font-size: 2.25rem;
}
.pa2 {
  padding: 0.5rem;
}
.f-6,
.f-headline {
  font-size: 6rem;
}
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* ↑↑↑ 上面都是引用的公共样式  */
.drop-zone {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  text-align: center;
  min-height: 150px;
  overflow-y: auto;
  &.borderOutline {
    border: 2px dashed #aaa;
  }
  .dragging-feedback {
    background-color: var(--c-normal);
  }

  .upload-instructions {
    margin-bottom: 10px;
  }
  .file-item {
    position: relative;
    width: 6rem;
    .delete-icon {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      color: var(--c-normal);
      &:hover {
        color: #1a1a1a;
      }
    }
  }
}
</style>
