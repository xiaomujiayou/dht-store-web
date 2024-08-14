<template>
  <div class="main">
    <van-nav-bar
        :title="edit ? '修改下载器':'添加下载器'"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <van-form label-width="4rem" @submit="onSubmit">
      <van-cell-group inset title="请填写下载器信息">
        <van-field
            class="nameField"
            :readonly="edit"
            v-model="form.name"
            name="name"
            label="名称"
            placeholder="下载器自定义名称"
            :rules="[{ required: true, message: '请填写下载器自定义名称' }]"
        />
        <van-field
            v-model="form.type"
            is-link
            readonly
            name="type"
            label="类型"
            placeholder="选择下载器类型"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker
              :columns="types"
              @confirm="onSelectType"
              @cancel="showPicker = false"
          />
        </van-popup>
        <van-field
            v-model="form.host"
            name="host"
            label="地址"
            placeholder="下载器地址(例:http://127.0.0.1:8888)"
        />
        <van-field
            v-model="form.userName"
            name="userName"
            label="账号"
            placeholder="下载器登录账号"
        />
        <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="下载器登录密码"
            :rules="[{ required: true, message: '请填写下载器登录密码' }]"
        />
        <van-field name="use" label="是否启用" >
          <template #input>
            <van-switch size="20" v-model="form.use" :loading="form.loading" @click="configTest"/>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-row>
          <van-col span="8">
            <van-button size="large" type="danger" @click="deleteDownloader" :disabled="form.loading">
              删除
            </van-button>
          </van-col>
          <van-col span="15" offset="1">
            <van-button size="large" type="primary" native-type="submit" :disabled="form.loading">
              {{ edit ? '修改' : '添加' }}
            </van-button>
          </van-col>
        </van-row>
      </div>
    </van-form>

  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { api } from '@/api/api'
import { showConfirmDialog, showNotify } from 'vant'
import { useRouter } from 'vue-router'

export default {
  name: 'AddDownloader',
  setup () {
    let router = useRouter()
    let config = router.currentRoute.value.query
    if (config.name !== undefined) {
      config.use = JSON.parse(config.use)
    }
    const data = reactive({
      edit: config.name !== undefined,
      showPicker: false,
      types: [],
      form: config.name ? config : {
        name: null,
        type: null,
        host: null,
        userName: null,
        password: null,
        use: false,
      }
    })

    api.get('/downloader/support').then(res => {
      data.types = res.data.data.map(o => {
        return {
          text: o.name,
          value: o.name,
          icon: o.icon
        }
      })
    })
    const method = {
      back () {
        history.back()
      },
      onSelectType ({ selectedValues }) {
        console.log(selectedValues)
        data.form.type = selectedValues[0]
        data.showPicker = false
      },
      onSubmit (values) {
        api.post(data.edit ? '/edit/downloader' : '/add/downloader', values).then((res) => {
          if (res.data.code === 200) {
            showNotify({
              message: data.edit ? '修改成功' : '添加成功',
              type: 'primary ',
              duration: 1000,
              onClose: () => {
                history.back()
              }
            })
          }
        })
      },
      deleteDownloader () {
        showConfirmDialog({
          title: '删除提示',
          message: '确认删除？',
        }).then(() => {
          api.post('/del/downloader', data.form).then((res) => {
            if (res.data.code === 200) {
              showNotify({
                message: '删除成功',
                type: 'primary ',
                duration: 1000,
                onClose: () => {
                  history.back()
                }
              })
            }
          })
        })
      },
      configTest () {
        if(!data.form.host || !data.form.type){
          showNotify({
            message: "请先填写配置",
          })
          data.form.use = false
        }
        if(data.form.use === false)
          return
        data.form.loading = true
        api.post('/downloader/test', data.form).then(() => {
          data.form.loading = false
        }).catch(() => {
          data.form.loading = false
          data.form.use = false
        })
      }
    }
    return {
      ...toRefs(data),
      ...method
    }
  }
}
</script>

<style scoped>
.nameField {
  background-color: v-bind("edit ? '#EFEFEF' : none");
}
</style>
