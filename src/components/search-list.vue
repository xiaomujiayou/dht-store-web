<template>
  <div class="main">
    <van-list
        :loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="200"
        @load="nextSearch"
    >
      <ListItem :torrents="list" />
    </van-list>
    <ListRefresh v-model:torrents="list" />
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { api } from '@/api/api'
import ListItem from '@/components/list-item.vue'
import ListRefresh from '@/components/list-refresh.vue'

export default {
  name: 'SearchList',
  components: { ListItem ,ListRefresh},
  setup () {
    const list = ref([])
    const data = reactive({
      form: {
        keywords: null,
        searchField: '',
        searchModel: '',
        pageNum: 0,
        pageSize: 10,
      },
      loading: false,
      finished: false,
    })
    const method = {
      async search () {
        console.log('search')
        let res = await api.get('/search', data.form)
        list.value = list.value.concat(res.data.data.content)
        data.loading = false
        data.finished = res.data.data.last
      },
      newSearch (search) {
        list.value = []
        data.form = { ...search, pageNum: 0, pageSize: 10 }
        method.nextSearch()
      },
      nextSearch () {
        data.loading = true
        method.search()
        data.form.pageNum = data.form.pageNum + 1
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
