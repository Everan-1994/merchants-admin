<style>
    .ivu-modal-wrap {
        z-index: 99999 !important;
    }

    .ivu-upload-drag {
        height: 100% !important;
    }
</style>
<template>
    <div>
        <Card :title="title">
            <Form ref="formItem" :model="formItem" :label-width="80" @submit.native.prevent :rules="validateRules">
                <FormItem label="用户昵称:">
                    {{username}}
                </FormItem>
                <FormItem label="邮箱:">
                    {{email}}
                </FormItem>
                <FormItem label="真实姓名:">
                    {{realname}}
                </FormItem>
                <FormItem label="角色:">
                    {{role}}
                </FormItem>
                <FormItem label="原密码" prop="oldPass">
                    <Input v-model="formItem.oldPass" type="password" :autosize="{minRows: 5, maxRows: 15}"
                           style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="formItem.newPass" type="password" :autosize="{minRows: 5, maxRows: 15}"
                           style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="confirmPass">
                    <Input v-model="formItem.confirmPass" type="password" :autosize="{minRows: 5, maxRows: 15}"
                           style="width: 300px;"></Input>
                </FormItem>
                <Button type="success"  @click="submitForm">保 存</Button>
            </Form>
        </Card>
    </div>
</template>

<script>
import {getUserDetail, updateUser} from '@/api/user'
export default {
  name: 'user-info',
  data () {
    const pwdCheckValidate = (rule, value, callback) => {
      if (this.formItem.newPass !== '' && value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (this.formItem.newPass !== value) {
        callback(new Error('新密码和确认密码应相同'))
      } else {
        callback()
      }
    }
    return {
      title: '个人信息',
      username: '',
      email: '',
      realname: '',
      role: '',
      formItem: {
        oldPass: '',
        newPass: ''
      },
      validateRules: {
        oldPass: [
          {required: true, message: '请填写原始密码', trigger: 'blur'}
        ],
        newPass: [
          {required: true, message: '请填写新密码', trigger: 'blur'}
        ],
        confirmPass: [
          {required: true, validator: pwdCheckValidate, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.formItem.validate((valid) => {
        if (valid) {
          updateUser(this.formItem).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$Message.success('修改成功')
              this.formItem.oldPass = ''
              this.formItem.newPass = ''
              this.formItem.confirmPass = ''
            } else {
              this.$Message.error(data.message || '修改失败')
            }
          })
        }
      })
    },
    getDetail (id) {
      getUserDetail(id).then(res => {
        let userData = res.data.data
        this.username = userData.username
        this.email = userData.email
        this.realname = userData.realname
        this.role = userData.roles[0].name
      })
    }
  },
  created () {
    this.getDetail()
  }
}
</script>

<style scoped>

</style>
