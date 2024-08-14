<template>
  <div class="main">
    <van-search
        v-model="keywords"
        show-action
        :placeholder="search[1].placeholder"
    >
      <template #label>
        <div @click.stop="showPicker">
          {{ search[0].label + '·' + search[1].label }}
          <van-icon/>
        </div>
      </template>
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <van-popup v-model:show="show" position="bottom">
      <van-picker
          :columns="columns"
          @cancel="showPicker"
          @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  name: 'SearchInput',
  emits: ['onSearch'],
  setup (props, { emit }) {
    const columns = [
      [
        { text: '精确查询', value: 'term', label: '精确' },
        { text: '模糊查询', value: 'match', label: '模糊' },
        { text: '通配符查询(?,*)', value: 'wildcard', label: '通配符' },
        { text: '正则查询', value: 'regexp', label: '正则' },
      ], [
        { text: '搜索种子名称', value: 'name', placeholder: '请输入种子名称', label: '名称' },
        { text: '搜索种子包含的文件', value: 'files.path', placeholder: '请输入种子包含的文件名', label: '文件' },
        { text: '全部(名称+文件)', value: null, placeholder: '请输入查询内容', label: '全部' },
      ]
    ]
    const data = reactive({
      keywords: '',
      show: false,
      search: [columns[0][0], columns[1][0]]
    })

    const method = {
      showPicker: (event) => {
        event.preventDefault()
        data.show = !data.show
      },
      onSearch: () => {
        if (data.keywords == null || data.keywords === '')
          return
        let query = {
          searchModel: data.search[0].value,
          searchField: data.search[1].value,
          keywords: data.keywords
        }
        emit('onSearch', query)
      },
      onConfirm: ({ selectedOptions }) => {
        data.search = selectedOptions
        data.show = !data.show
        method.onSearch()
      },
    }
    return {
      columns,
      ...toRefs(data),
      ...method,
    }
  }
}
</script>

<style scoped>
</style>
