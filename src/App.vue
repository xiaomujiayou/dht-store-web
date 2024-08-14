<template>
  <div class="app-container">
    <router-view/>
    <van-tabbar class="tab-bar" v-model="active" route placeholder>
      <van-tabbar-item name="system" to="/system">
        <template #icon>
          <van-icon class="iconfont" class-prefix="icon" name="system"/>
        </template>
        系统状态
      </van-tabbar-item>
      <van-tabbar-item icon="search" name="search" to="/search">资源搜索</van-tabbar-item>
      <van-tabbar-item icon="back-top" name="downloader" to="/downloader">下载器</van-tabbar-item>
      <van-tabbar-item icon="setting-o" name="setting" to="/setting">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'App',
  components: {},
  setup () {
    const active = ref('search')
    return {
      active,
    }
  }
}
</script>

<style scoped>
.app-container {
  background-color: #F7F8FA; /* 你想要设置的底色 */
  min-height: 100vh; /* 确保页面高度至少为视口高度 */
}
.tab-bar :deep(.van-icon-back-top) {
  transform: rotate(180deg);
}
.iconfont{
  font-size: unset;
}
</style>
<style>
</style>
