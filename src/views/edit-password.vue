<template>
  <div class="main">
    <van-nav-bar
        title="修改密码"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <van-form label-width="4rem" @submit="onSubmit">
      <van-cell-group inset title="请填写账号密码">
        <van-field
            class="userName"
            readonly
            v-model="form.userName"
            name="userName"
            label="用户名"
        />
        <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="原密码"
            placeholder="请输入原密码"
            :rules="[{ required: true, message: '请输入原密码' }]"
        />
        <van-field
            v-model="form.newPassword"
            type="password"
            name="newPassword"
            label="新密码"
            placeholder="请输入新密码"
            :rules="[{ required: true, message: '请输入新密码' }]"
        />
        <van-field
            v-model="form.newPassword1"
            type="password"
            name="newPassword1"
            label="密码确认"
            placeholder="请再次输入新密码"
            :rules="[{ required: true, message: '请再次输入新密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button size="large" type="primary" native-type="submit" >
          修改
        </van-button>
      </div>
    </van-form>

  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { api } from '@/api/api'
import { showConfirmDialog, showNotify } from 'vant'

export default {
  name: 'EditPassword',
  setup () {
    const data = reactive({
      form: {
        userName: 'xiaomu',
        password: null,
        newPassword: null,
      }
    })
    const method = {
      back () {
        history.back()
      },
      onSubmit (values) {
        if(values.newPassword !== values.newPassword1){
          showNotify({
            message: "新密码两次输入不一致",
          })
          return
        }

        showConfirmDialog({
          title: '修改提示',
          message: '确认修改？',
        }).then(() => {
          api.post("/edit/password", values).then((res) => {
            if (res.data.code === 200) {
              showNotify({
                message: "修改成功，请重新登录",
                type: 'primary ',
                duration: 3000,
                onClose: () => {
                  history.back()
                }
              })
            }
          })
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
.userName {
  background-color: #EFEFEF;
}
</style>
