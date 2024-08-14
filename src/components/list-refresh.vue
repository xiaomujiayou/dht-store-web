<template>
  <div />
</template>
<script>
import { api } from '@/api/api'
import { onBeforeRouteLeave } from 'vue-router'

export default {
  name: 'ListRefresh',
  emits:["update:torrents"],
  props: {
    torrents: {
      type: Array,
      require: true
    },
    time: {
      type: Number,
      default: 3000
    }
  },
  setup (props,ctx) {
    const work = async () => {
      let torrents = props.torrents;
      if (!torrents || torrents.length === 0)
        return
      let res = await api.get('/downloader/list')
      let tasks = res.data.data
      if (!tasks || tasks.length === 0)
        return
      for (let torrent of torrents) {
        let state = false
        a:for (let magnet of torrent.magnets) {
          for (let task of tasks) {
            if (magnet.hash === task.hash) {
              torrent.task = task
              state = true
              break a
            }
          }
        }
        if(state === false)
          torrent.task = null
      }
      ctx.emit("update:torrents", torrents)
    }
    let timer = setInterval(() => {
      work()
    }, props.time)
    const refresh = async () => {
      clearInterval(timer)
      timer = null
      await work()
      timer = setInterval(() => {
        work()
      }, props.time)
    }
    onBeforeRouteLeave((to, from, next) => {
      clearInterval(timer)
      next()
    })
    return {
      refresh,
    }
  }
}
</script>
<style scoped>

</style>
