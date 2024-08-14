<template>
  <div class="main">
    <van-tabs class="detail-tabs" v-model:active="active" type="card" color="#AAAAAA">
      <van-tab title="下载信息" name="0">
        <!--     下载信息     -->
        <div class="item-label magnet" v-for="(magnet,index) in torrent.magnets" :key="magnet.hash">
          <div style="width: 15%">
            <van-badge color="#AAAAAA" :content="magnet.hot">
              <div
                  style="width: 3rem;height: 1.7rem;line-height:1.7rem;background-color: #f2f3f5;border-radius: 0.2rem;text-align: center;">
                资源{{ index + 1 }}
              </div>
            </van-badge>
          </div>
          <div style="width: 25%">
            <div v-if="torrent.task && torrent.task.hash === magnet.hash">
              <van-progress class="progress" color="#AAA" :show-pivot="true" :percentage="torrent.task.progress" stroke-width="16"/>
            </div>
            <div v-else>
              {{ magnet.createTime.split(' ')[0] }}
            </div>

          </div>
          <div style="width: 20%">
            <div v-if="torrent.task && torrent.task.hash === magnet.hash">{{ torrent.task.progress + '%' }}</div>
          </div>
          <div style="width: 30%;display: flex;justify-content: flex-end;align-items: center">
            <van-button v-if="!torrent.task || torrent.task.hash !== magnet.hash" class="btn" plain hairline
                        size="small" type="primary" @click="download(magnet.hash)">下载
            </van-button>
            <van-button v-if="torrent.task && torrent.task.status === 2" class="btn" plain hairline size="small"
                        type="success" @click="start(magnet.hash)">开始
            </van-button>
            <van-button v-if="torrent.task && torrent.task.status === 1" class="btn" plain hairline size="small"
                        type="warning" @click="stop(magnet.hash)">暂停
            </van-button>
            <van-button v-if="torrent.task" class="btn" style="margin-left: 10px" plain hairline size="small"
                        type="danger" @click="remove(magnet.hash)">删除
            </van-button>
          </div>
        </div>
      </van-tab>
      <van-tab title="资源信息" name="1">
        <FileBrowser :hash="torrent.hash"/>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import FileBrowser from '@/components/list-file-browser.vue'
import { api } from '@/api/api'
import { showConfirmDialog, showNotify } from 'vant'

export default {
  name: 'ListDetail',
  props: {
    torrent: {
      type: Object,
      require: true
    }
  },
  components: { FileBrowser },
  setup (props) {
    const data = reactive({
      torrent: props.torrent,
      active: '0'
    })
    const methods = {
      download (hash) {
        api.get('/downloader/download', { hashes: hash }).then(() => {
          showNotify({ message: '开始下载', type: 'primary ' })
        })
      },
      start (hash) {
        api.get('/downloader/start', { hashes: hash }).then(() => {
          showNotify({ message: '开始下载', type: 'primary ' })
        })
      },
      stop (hash) {
        api.get('/downloader/stop', { hashes: hash }).then(() => {
          showNotify({ message: '已暂停', type: 'primary ' })
        })
      },
      remove (hash) {
        showConfirmDialog({
          title: '确认删除？',
          message:
              '删除任务会同时删除已下载的文件！',
        }).then(() => {
          api.get('/downloader/remove', { hashes: hash }).then(() => {
            showNotify({ message: '已删除', type: 'primary ' })
          })
        })
      }
    }
    return {
      ...toRefs(data),
      ...methods,
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

.magnet {
  font-size: 12px;
  margin-top: 10px;
}

.magnet .btn {
  padding: 0 10px;
  height: 1.7rem;
}

.progress :deep(.van-progress__pivot) {
  border-bottom-left-radius: unset !important;
  border-top-left-radius: unset !important;
}

.detail-tabs :deep(.van-tabs__nav--card){
  margin: 0;
}
</style>
