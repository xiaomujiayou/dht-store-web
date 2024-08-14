<template>
  <div class="main">
    <div class="nav" ref="navDiv">
      <div class="nav-item" style="white-space: nowrap;"  @click="reSet">
        全部
      </div>
      <template v-if="nav.length > 0">
        <div class="nav-item" v-for="(item,index) in nav" :key="item" :data-index="index">
          <van-icon class="item-split" name="arrow"/>
          <div class="nav-item-text" @click="onSelectNav(index)">{{ item }}</div>
        </div>
      </template>
    </div>
    <div class="file-list-container">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
          :offset="50"
      >
        <div class="file" v-for="item in list" :key="item" @click="onSelectFolder(item)">
          <div class="file-name">
            <van-icon v-if="item.folder" class="iconfont" class-prefix="icon" name="wenjianjia"/>
            <van-icon v-else class="iconfont" class-prefix="icon" name="wenjian"/>
            {{ item.name }}
          </div>
          <van-icon v-if="item.folder" class="item-split" name="arrow"/>
          <div style="font-size: 0.7rem" v-else>{{ item.length }}</div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { nextTick, reactive, ref, toRefs } from 'vue'
import { api } from '@/api/api'

export default {
  name: 'ListFileBrowser',
  props: {
    hash: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const navDiv = ref(null)
    const data = reactive({
      nav: [],
      // nav: ['新建文件夹', '我的', '新建文件夹', '我的', '新建文件夹', '我的', '新建文件夹', '我的'],
      list: [],
      loading: false,
      finished: false,
      pageNum: 0,
    })
    const method = {
      onLoad () {
        method.loadData(data.nav.join('|'), data.pageNum++)
      },
      async loadData (path, pageNum) {
        data.loading = true
        let res = await api.get('/fileList', { hash: props.hash, path: path, pageNum: pageNum, pageSize: 10 })
        data.list = data.list.concat(res.data.data.content)
        data.loading = false
        data.finished = res.data.data.last
      },
      onSelectFolder (item) {
        if (!item.folder)
          return
        data.nav.push(item.name)
        data.pageNum = 0
        data.list = []
        method.onLoad()
        nextTick(() => {
          navDiv.value.scrollLeft = navDiv.value.scrollWidth
        })
      },
      reSet () {
        data.nav = []
        data.pageNum = 0
        data.list = []
        method.onLoad()
      },
      onSelectNav (index) {
        data.nav = data.nav.slice(0, index + 1)
        data.pageNum = 0
        data.list = []
        method.onLoad()
      }
    }
    return {
      ...toRefs(data),
      ...method,
      navDiv
    }
  }
}
</script>

<style scoped>
.nav {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: scroll;
}

.nav-item {
  height: 2.0rem;
  line-height: 2.0rem;
  display: flex;
  align-items: center;
}
.nav-item-text {
  max-width: 15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0.2rem;
}

.nav-item-text:active,.nav-item:first-child:active {
  background-color: #ebedf0;
}


.file {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.file-name {
  word-break: break-all;
  white-space: pre-wrap;
  width: 80%;
}
.file-list-container{
  min-height: 80px;
  max-height: 300px;
  overflow-y: scroll;
}
</style>
