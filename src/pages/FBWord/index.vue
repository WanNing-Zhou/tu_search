
<script lang="ts" setup>
import {ref, watch} from "vue";

type Prop = {
  enterAction: any
}

const props = defineProps<Prop>()
watch(props.enterAction,()=>{
  console.log(props.enterAction)
})
// const val = ref('')
// utools.setSubInput(({text}) => {
//   val.value = text
// }, '', true)
// window.utools.hideMainWindowTypeString("卡卡西")

const activeName = ref('')
const handleClick = () => {

}

</script>
<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="" name="">
          <div>
            {{props.enterAction }}
          </div>
        </el-tab-pane>
    </el-tabs>

  </div>
</template>



<style lang="scss" scoped>

</style>