<template>
  <div class="main">
    <van-nav-bar
        title="数据展示"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <van-form label-width="4rem">
      <van-cell-group class="setting" inset title="选择需要展示的数据">
        <van-field name="switch" label="展示IPv4数据">
          <template #input>
            <van-switch size="1.2rem" v-model="form.ipv4" @change="showIpv4"/>
          </template>
        </van-field>
        <van-field name="switch" label="展示IPv6数据">
          <template #input>
            <van-switch size="1.2rem" v-model="form.ipv6" @change="showIpv6"/>
          </template>
        </van-field>
        <van-field name="switch" label="展示下载器信息">
          <template #input>
            <van-switch size="1.2rem" v-model="form.downloader" @change="showDownloader"/>
          </template>
        </van-field>
        <van-field name="switch" label="展示仓库信息">
          <template #input>
            <van-switch size="1.2rem" v-model="form.store" @change="showStore"/>
          </template>
        </van-field>
      </van-cell-group>
    </van-form>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  name: 'DataShow',
  setup () {
    if (localStorage.getItem('showIpv4') == null)
      localStorage.setItem('showIpv4', 'true')
    if (localStorage.getItem('showIpv6') == null)
      localStorage.setItem('showIpv6', 'true')
    if (localStorage.getItem('downloader') == null)
      localStorage.setItem('downloader', 'true')
    if (localStorage.getItem('store') == null)
      localStorage.setItem('store', 'true')

    const data = reactive({
      form: {
        ipv4: localStorage.getItem("showIpv4") === "true",
        ipv6: localStorage.getItem("showIpv6") === "true",
        downloader: localStorage.getItem("downloader") === "true",
        store: localStorage.getItem("store") === "true",
      }
    })
    const method = {
      back () {
        history.back()
      },
      showIpv4 () {
        localStorage.setItem('showIpv4', data.form.ipv4)
      },
      showIpv6 () {
        localStorage.setItem('showIpv6', data.form.ipv6)
      },
      showDownloader () {
        localStorage.setItem('downloader', data.form.downloader)
      },
      showStore () {
        localStorage.setItem('store', data.form.store)
      },
    }
    return {
      ...toRefs(data),
      ...method
    }
  }
}
</script>
<style scoped>
.setting :deep(.van-field__label) {
  width: 80% !important;
}
</style>
