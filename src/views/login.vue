<template>
  <div class="main">
    <van-form label-width="4rem" @submit="onSubmit">
      <van-cell-group inset title="系统登录">
        <van-field
            class="userName"
            v-model="form.userName"
            name="userName"
            placeholder="请输入账号"
            label="账号"
            :rules="[{ required: true, message: '请输入账号' }]"
        />
        <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button size="large" type="primary" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { api } from '@/api/api'
import { showNotify } from 'vant'
import router from '@/router'

export default {
  name: 'LoginView',
  setup () {
    const data = reactive({
      form: {
        userName: null,
        password: null,
      }
    })
    const method = {
      onSubmit (values) {
        api.post('/login', values).then((res) => {
          if (res.data.code === 200) {
            showNotify({
              message: '登录成功',
              type: 'primary ',
              duration: 1000,
              onClose: () => {
                router.push("/system")
              }
            })
          }
        })
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
</style>
