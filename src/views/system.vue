<template>
  <div class="main">
    <div v-if="showStore" class="label">仓库信息</div>
    <div v-if="showStore" class="group">
      <div class="item">
        <div class="key">数据总量</div>
        <div class="value">{{ storeInfo.count }}</div>
      </div>
      <div class="item">
        <div class="key">本次新增</div>
        <div class="value">{{ storeInfo.addCount }}</div>
      </div>
      <div class="item">
        <div class="key">违规拦截</div>
        <div class="value">{{ storeInfo.illegalCount }}</div>
      </div>
      <div class="item">
        <div class="key">今日新增</div>
        <div class="value">{{ storeInfo.today }}</div>
      </div>
      <div class="item">
        <div class="key">最近一小时</div>
        <div class="value">{{ storeInfo.hour }}</div>
      </div>
      <div class="item">
        <div class="key">最近一分钟</div>
        <div class="value">{{ storeInfo.tenMinutes }}</div>
      </div>
    </div>
    <div v-if="showIpv4 || showIpv6" class="label">爬虫信息</div>
    <div class="group">
      <div v-if="showIpv4" class="item">
        <div class="key">爬虫速度IPv4</div>
        <div class="value">{{ announce.in }}/s</div>
      </div>
      <div v-if="showIpv4" class="item">
        <div class="key">种子生产IPv4</div>
        <div class="value">{{ torrent.in }}/s</div>
      </div>
      <div v-if="showIpv4" class="item">
        <div class="key">转换率IPv4</div>
        <div class="value">{{ announce.out !== 0 ? Math.round(torrent.in / announce.out * 100) + '%' : '--'}}</div>
      </div>
      <div v-if="showIpv6" class="item">
        <div class="key">爬虫速度IPv6</div>
        <div class="value">{{ announceIpv6.in }}/s</div>
      </div>
      <div v-if="showIpv6" class="item">
        <div class="key">种子生产IPv6</div>
        <div class="value">{{ torrentIpv6.in }}/s</div>
      </div>
      <div v-if="showIpv6" class="item">
        <div class="key">转换率IPv6</div>
        <div class="value">{{ announceIpv6.out !== 0 ? Math.round(torrentIpv6.in / announceIpv6.out * 100) + '%' : '--'}}</div>
      </div>
    </div>
    <div v-if="showDownloader" class="label">下载器信息</div>
    <div v-if="showDownloader" class="group">
      <div class="item">
        <div class="key">任务总数</div>
        <div class="value">{{ downloaderInfo.dlTotalCount }}</div>
      </div>
      <div class="item">
        <div class="key">正在下载</div>
        <div class="value">{{ downloaderInfo.dlCount }}</div>
      </div>
      <div class="item">
        <div class="key">已完成</div>
        <div class="value">{{ downloaderInfo.dlCompleteCount }}</div>
      </div>
      <div class="item">
        <div class="key">当前下载速度</div>
        <div class="value">{{ downloaderInfo.dlSpeed }}</div>
      </div>
      <div class="item">
        <div class="key">当前上传速度</div>
        <div class="value">{{ downloaderInfo.upSpeed }}</div>
      </div>
      <div class="item">
        <div class="key">剩余磁盘空间</div>
        <div class="value">{{ downloaderInfo.freeSpaceOnDisk }}</div>
      </div>
    </div>
    <div v-if="showIpv4 || showIpv6" class="label">爬虫队列信息</div>
    <div v-if="showIpv4 || showIpv6" style="position: relative">
      <van-tabs class="dateBtn" v-model:active="active" color="#AAAAAA" type="card" shrink @change="changeTime">
        <van-tab title="10分钟"></van-tab>
        <van-tab title="1小时"></van-tab>
      </van-tabs>
      <div v-if="showIpv4" id="ipv4" style="width: 100%;height: 25vh;"/>
      <div v-if="showIpv6" id="ipv6" style="width: 100%;height: 25vh;"/>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { api } from '@/api/api'
import { onBeforeRouteLeave } from 'vue-router'
import { showConfirmDialog } from 'vant'
import router from '@/router'

export default {

  name: 'SystemView',
  components: {},
  setup () {
    if (localStorage.getItem('showIpv4') == null)
      localStorage.setItem('showIpv4', 'true')
    if (localStorage.getItem('showIpv6') == null)
      localStorage.setItem('showIpv6', 'true')
    if (localStorage.getItem('downloader') == null)
      localStorage.setItem('downloader', 'true')
    if (localStorage.getItem('store') == null)
      localStorage.setItem('store', 'true')
    const showIpv4 = ref(localStorage.getItem('showIpv4') === 'true')
    const showIpv6 = ref(localStorage.getItem('showIpv6') === 'true')
    const showDownloader = ref(localStorage.getItem('downloader') === 'true')
    const showStore = ref(localStorage.getItem('store') === 'true')

    if(!showIpv4.value && !showIpv6.value && !showDownloader.value && !showStore.value){
      showConfirmDialog({
        title: '友情提示',
        message: "请在“设置”-“系统数据展示”选择需要展示的数据，是否前往配置",
      }).then(() => {
        router.push("/setting/data-show")
      });
    }

    const announce = ref({})
    const announceIpv6 = ref({})
    const torrent = ref({})
    const torrentIpv6 = ref({})
    const storeInfo = ref({})
    const downloaderInfo = ref({})
    const active = ref(0)
    let params = [{ age: 60 * 10, incr: 5 }, { age: 60 * 60, incr: 60 }, { age: 60 * 60 * 24, incr: 1200 }]
    let chartIpv4, chartIpv6
    onMounted(() => {
      method.initData(true)
    })
    let timer = setInterval(() => {
      method.initData(false)
    }, 5000)
    onBeforeRouteLeave((to, from, next) => {
      clearInterval(timer)
      next()
    })

    const method = {
      initData (initChart) {
        let promises = []
        if (showIpv4.value) {
          promises.push(api.get('/system/status/announce.queue', params[active.value]).then((res) => {
            announce.value = res.data.data
          }))
          promises.push(api.get('/system/status/torrent.queue', params[active.value]).then((res) => {
            torrent.value = res.data.data
          }))
        }
        if (showIpv6.value) {
          promises.push(api.get('/system/status/announce.ipv6.queue', params[active.value]).then((res) => {
            announceIpv6.value = res.data.data
          }))
          promises.push(api.get('/system/status/torrent.ipv6.queue', params[active.value]).then((res) => {
            torrentIpv6.value = res.data.data
          }))
        }
        if(showStore.value){
          promises.push(api.get('/system/store/info').then((res) => {
            storeInfo.value = res.data.data
          }))
        }
        if(showDownloader.value){
          promises.push(api.get('/system/downloader/info').then((res) => {
            downloaderInfo.value = res.data.data
          }))
        }
        Promise.all(promises).then(() => {
              if (initChart) {
                if (showIpv4.value)
                  method.initIpv4Chart()
                if (showIpv6.value)
                  method.initIpv6Chart()
              } else {
                if (showIpv4.value)
                  chartIpv4.setOption({
                    xAxis: [
                      {
                        boundaryGap: false,
                        data: announce.value.inSample.map((item) => item.date),
                      }
                    ],
                    series: [
                      {
                        name: 'announce',
                        type: 'line',
                        showSymbol: false,
                        data: announce.value.inSample.map((item) => item.sample)
                      },
                      {
                        name: 'torrent',
                        type: 'line',
                        showSymbol: false,
                        data: torrent.value.inSample.map((item) => item.sample)
                      }
                    ]
                  })
                if (showIpv6.value)
                  chartIpv6.setOption({
                    xAxis: [
                      {
                        boundaryGap: false,
                        data: announceIpv6.value.inSample.map((item) => item.date),
                      }
                    ],
                    series: [
                      {
                        name: 'announce',
                        type: 'line',
                        showSymbol: false,
                        data: announceIpv6.value.inSample.map((item) => item.sample)
                      },
                      {
                        name: 'torrent',
                        type: 'line',
                        showSymbol: false,
                        data: torrentIpv6.value.inSample.map((item) => item.sample)
                      }
                    ]
                  })
              }
            })
      },
      initIpv4Chart () {
        let option = {
          grid: [
            {
              top: '25%',
              left: '2%',
              right: '2%',
              bottom: '2%',
              containLabel: true
            }
          ],
          title: [
            {
              left: '0',
              top: '2%',
              text: 'IPv4(/s)',
              textStyle: {
                fontSize: 14
              }
            }
          ],
          legend: [{
            top: '2%',
            data: ['announce', 'torrent']
          }],
          tooltip: {
            trigger: 'axis',
          },
          xAxis: [
            {
              boundaryGap: false,
              data: announce.value.inSample.map((item) => item.date),
            }
          ],
          yAxis: [
            {}
          ],
          series: [
            {
              name: 'announce',
              type: 'line',
              showSymbol: false,
              data: announce.value.inSample.map((item) => item.sample)
            },
            {
              name: 'torrent',
              type: 'line',
              showSymbol: false,
              data: torrent.value.inSample.map((item) => item.sample)
            }
          ]
        }
        let map = document.getElementById('ipv4')
        map.removeAttribute('_echarts_instance_')//解决切换页面echarts不显示的问题
        chartIpv4 = echarts.init(map)
        chartIpv4.setOption(option)
        window.onresize = () => {
          chartIpv4.resize()
        }
      },
      initIpv6Chart () {
        let option = {
          grid: [
            {
              top: '25%',
              left: '2%',
              right: '2%',
              bottom: '2%',
              containLabel: true
            }
          ],
          title: [
            {
              left: '0',
              top: '2%',
              text: 'IPv6(/s)',
              textStyle: {
                fontSize: 14
              }
            }
          ],
          legend: [{
            top: '2%',
            data: ['announce', 'torrent']
          }],
          tooltip: {
            trigger: 'axis',
          },
          xAxis: [
            {
              boundaryGap: false,
              data: announceIpv6.value.inSample.map((item) => item.date),
            }
          ],
          yAxis: [
            {}
          ],
          series: [
            {
              name: 'announce',
              type: 'line',
              showSymbol: false,
              data: announceIpv6.value.inSample.map((item) => item.sample)
            },
            {
              name: 'torrent',
              type: 'line',
              showSymbol: false,
              data: torrentIpv6.value.inSample.map((item) => item.sample)
            }
          ]
        }
        let map = document.getElementById('ipv6')
        map.removeAttribute('_echarts_instance_')//解决切换页面echarts不显示的问题
        chartIpv6 = echarts.init(map)
        chartIpv6.setOption(option)
        window.onresize = () => {
          chartIpv6.resize()
        }
      },
      changeTime () {
        clearInterval(timer)
        method.initData(true)
        timer = setInterval(() => {
          method.initData(false)
        }, 5000)
      }
    }

    return {
      showIpv4,
      showIpv6,
      showDownloader,
      showStore,
      ...method,
      announce,
      announceIpv6,
      torrent,
      torrentIpv6,
      storeInfo,
      downloaderInfo,
      active
    }
  }
}
</script>

<style scoped>
.main {
  padding: 10px;
}

.label {
  color: #969799;
  margin-top: 5px;
}

.group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item {
  width: 32%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px 0;
  background-color: #fff;
  padding: 10px 0;
  border-radius: 10px;
}

.key, .value {
  width: 6rem;
  font-size: 14px;
}

.value {
  font-size: 16px;
  color: #75CC91;
  margin-top: 5px;
}

#ipv4, #ipv6 {
  margin-top: 5px;
  background-color: #fff;
}

.dateBtn {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
}

.dateBtn :deep(.van-tabs__nav--card) {
  margin: 0;
  height: 26px;
}
.dateBtn :deep(.van-tab--card) {
  font-size: 10px;
  line-height: 16px !important;
}
.dateBtn :deep(.van-tab--shrink) {
  padding: 0 4px;
}
</style>
