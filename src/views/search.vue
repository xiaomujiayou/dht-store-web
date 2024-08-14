<template>
  <div class="main">
    <van-sticky>
      <SearchInput @on-search="onSearch"/>
    </van-sticky>
    <SearchList ref="searchList"/>
  </div>
</template>

<script>
import SearchInput from '@/components/search-input.vue'
import SearchList from '@/components/search-list.vue'
import { ref } from 'vue'

export default {
  name: 'SearchView',
  components: { SearchInput, SearchList },
  setup () {
    const searchList = ref(null)
    const method = {
      onSearch (search) {
        searchList.value.newSearch(search)
      }
    }
    return {
      ...method,
      searchList
    }
  }
}
</script>

<style scoped>

</style>
