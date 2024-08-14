<template>
  <div class="main">
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item v-for="item of torrents" :key="item.hash" :name="item.hash">
        <template #title>
          <div style="word-break:break-all;white-space:pre-wrap;" v-html="item.name"/>
        </template>
        <template #label>
          <div v-for=" (highlightFile,index) of item.highlightFiles" :key="index" v-html="highlightFile"></div>
          <div class="item-label">
            <div style="width: 23%">{{ item.createTime.split(' ')[0] }}</div>
            <div style="width: 23%">热度：{{ item.hot }}</div>
            <div style="width: 25%">
              <div v-if="item.task">{{ item.task.statusStr }}</div>
            </div>
            <div style="width: 22%">
              <div v-if="item.task && item.task.status === 1">{{ item.task.speedStr }}</div>
            </div>
          </div>
        </template>
        <ListDetail v-if="activeName === item.hash" :torrent="item"/>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import ListDetail from '@/components/list-detail.vue'

export default {
  name: 'ListItem',
  components: { ListDetail },
  props: {
    torrents: {
      type: Array,
      require: true
    }
  },
  setup (props) {
    const data = reactive({
      torrents: props.torrents,
      activeName: null,
      active: '1'
    })
    const method = {

    }
    return {
      ...toRefs(data),
      ...method,
    }
  }
}
</script>

<style scoped>
.item-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
