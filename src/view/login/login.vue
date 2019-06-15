<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="md-pulse" title="招商H5 - 管理后台" :bordered="false">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit" :load="loading"></login-form>
                    <p class="login-tip">【招商H5】 -- 后台</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import LoginForm from '_c/login-form'
import {mapActions} from 'vuex'
import Cookies from 'js-cookie'

export default {
  components: {
    LoginForm
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit ({email, password}) {
      const _this = this
      _this.loading = true
      _this.handleLogin({email, password}).then(res => {
        if (res.data.errorCode === 0) {
          _this.$Message.loading({
            content: '登录系统中...',
            duration: 1.5,
            onClose: function () {
              _this.loading = false
              _this.$router.push({
                name: 'home'
              })
              setTimeout(() => {
                window.location.href = '/home'
              }, 1000)
            }
          })
        } else {
          setTimeout(() => {
            _this.loading = false
            _this.$Message.error(res.data.message || '系统错误')
          }, 1000)
        }
      }).catch(err => {
        setTimeout(() => {
          _this.loading = false
          // _this.$Message.error(err.response.data.message || '系统错误');
        }, 1000)
      })
    }
  }
}
</script>

<style>

</style>
