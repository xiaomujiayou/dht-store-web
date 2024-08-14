<template>
  <DownloaderList ref="searchList"/>
</template>

<script>
import DownloaderList from '@/components/downloader-list.vue'

export default {
  name: 'DownloaderView',
  components: { DownloaderList },
  setup () {
    return {}
  }
}
</script>

<style scoped>

</style>
