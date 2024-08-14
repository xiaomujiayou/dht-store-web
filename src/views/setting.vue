<template>
  <div class="main">
    <van-cell-group title="系统设置" inset>
      <van-cell is-link @click="toEditPassword">
        <template #title>
          <van-icon class="iconfont" class-prefix="icon" name="xiugaimima"/>
          修改密码
        </template>
      </van-cell>
      <van-cell is-link @click="toDataShow">
        <template #title>
          <van-icon class="iconfont" class-prefix="icon" name="xiaoyanfangan" size="1.2rem"/>
          系统数据展示
        </template>
      </van-cell>
      <van-cell is-link @click="toLogout">
        <template #title>
          <van-icon class="iconfont" class-prefix="icon" name="tuichu" size="1.2rem"/>
          退出登录
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset title="下载器设置">
      <van-cell is-link v-for="item of downloaderConfigs" :key="item.name" @click="toUpdateDownloader(item)">
        <template #title>
          <div style="display: flex;align-items: center;">
            <div v-html="item.icon" />
            {{ item.name }}
          </div>
        </template>
        <template #right-icon>
          <van-switch v-model="item.use" size="20" :loading="item.loading"
                      :active-color="item.status === false ? '#ee0a24' :''"
                      @click.stop="item.loading=true;changeUse(item)"/>
        </template>
        <div v-if="item.use" style="margin: 0 10px">{{
            item.status === false ? '下载器异常' : item.loading === true ? '正在启用...' : '已启用'
          }}</div>
      </van-cell>
    </van-cell-group>
    <div style="text-align: center;">
      <div style="margin:auto;padding: 10px;width: 5rem;color: blue" @click="toAddDownloader()">添加下载器</div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { api } from '@/api/api'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showNotify } from 'vant'

export default {
  name: 'SettingView',
  setup () {
    const data = reactive({
      name: null,
      downloaderConfigs: []
    })
    const router = useRouter()
    const method = {
      async getDownloaderConfig () {
        let res = await api.get('/downloader')
        data.downloaderConfigs = res.data.data
      },
      toEditPassword(){
        router.push('/setting/edit-password')
      },
      toDataShow(){
        router.push('/setting/data-show')
      },
      toAddDownloader () {
        router.push('/setting/add-downloader')
      },
      toUpdateDownloader (config) {
        router.push({
          path: '/setting/add-downloader',
          query: {
            ...config
          },
        })
      },
      toLogout(){
        showConfirmDialog({
          title: '友情提示',
          message: '确认退出登录？',
        }).then(() => {
          api.post('/logout').then((res) => {
            if (res.data.code === 200) {
              router.push('/login')
            }
          })
        })
      },
      changeUse (item) {
        if(item.use === false){
          showConfirmDialog({
            title: '友情提示',
            message: '关闭后请启用其他下载器，否则会影响其他模块功能',
          }).then(() => {
            api.post('/change/use', item).then((res) => {
              method.getDownloaderConfig()
              if (res.data.code === 200) {
                showNotify({
                  message: '设置成功',
                  type: 'primary ',
                })
              } else {
                showNotify({
                  message: res.data.msg,
                })
              }
            })
          }).catch(()=>{
            method.getDownloaderConfig()
          })
        }else {
          api.post('/downloader/test', item).then(() => {
            api.post('/change/use', item).then((res) => {
              method.getDownloaderConfig()
              if (res.data.code === 200) {
                showNotify({
                  message: '设置成功',
                  type: 'primary ',
                })
              } else {
                showNotify({
                  message: res.data.msg,
                })
              }
            })
          }).catch(() => {
            item.use = false
            item.loading = false
          })
        }
      }
    }
    method.getDownloaderConfig()
    return {
      ...toRefs(data),
      ...method
    }
  }
}
</script>

<style scoped>

</style>
