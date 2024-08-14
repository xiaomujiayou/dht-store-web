<template>
  <div class="main">
    <van-tabs v-model:active="status" @change="onLoad">
      <van-tab title="全部" name="" :disabled="disabled"></van-tab>
      <van-tab title="下载中" name="1" :disabled="disabled"></van-tab>
      <van-tab title="已暂停" name="2" :disabled="disabled"></van-tab>
      <van-tab title="已完成" name="3" :disabled="disabled"></van-tab>
    </van-tabs>
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
    >
      <ListItem :torrents="list"/>
    </van-list>
    <ListRefresh v-model:torrents="list"/>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { api } from '@/api/api'
import ListItem from '@/components/list-item.vue'
import ListRefresh from '@/components/list-refresh.vue'

export default {
  name: 'DownloaderList',
  components: { ListRefresh, ListItem },
  setup () {
    const list = ref([])
    const data = reactive({
      status: null,
      loading: false,
      finished: false,
      disabled: false
    })
    const method = {
      async search () {
        data.disabled = true
        data.loading = true
        data.finished = false
        let res = await api.get('/downloader/torrents', {
          status: data.status
        })
        if (res.data.code === 200) {
          list.value = list.value.concat(res.data.data)
        }
        data.disabled = false
        data.loading = false
        data.finished = true
      },
      onSearch () {
        list.value = []
        data.search = { pageNum: 0, pageSize: 10 }
        method.search()
      },
      nextSearch () {
        data.search.pageNum = data.search.pageNum + 1
        method.search()
      },
      onLoad: () => {
        method.onSearch()
      }
    }
    return {
      list,
      ...toRefs(data),
      ...method,
    }
  }
}
</script>

<style scoped>

</style>
