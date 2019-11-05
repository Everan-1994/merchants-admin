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
            <Form ref="formItem" :model="formItem" :label-width="80" :rules="rules" @submit.native.prevent>
                <FormItem label="用户昵称" prop="username">
                    <Input v-model="formItem.username" placeholder="请输入您的昵称" style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input ref="route" v-model="formItem.email" placeholder="请输入邮箱地址"
                           style="width: 300px; margin-right: 20px;"></Input>
                </FormItem>
                <FormItem label="真实姓名" prop="realname">
                    <Input ref="route" v-model="formItem.realname" placeholder="请输入您的真实姓名"
                           style="width: 300px; margin-right: 20px;"></Input>
                </FormItem>
                <FormItem label="角色" prop="roleId">
                    <Select style="width: 300px;" v-model="formItem.roleId">
                        <Option v-for="item in roleList" :key=item.id :value="item.id" >{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="密码" >
                    <Input v-model="formItem.password" type="password" :autosize="{minRows: 5, maxRows: 15}"
                           style="width: 300px;"
                           placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem label="启用">
                    <i-switch v-model="formItem.isEnable" size="large" :true-value="true" :false-value="false">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <Button type="success"  @click="submitForm">保 存</Button>
                <Button type="text" to="/system/member-list" >返回成员列表</Button>
            </Form>
        </Card>
    </div>
</template>

<script>
import {addMember, getMemberDetail, updateMember} from '@/api/member'
import {getRoleListData} from '@/api/role'
export default {
  name: 'role-add',
  data () {
    return {
      formItem: {
        username: '',
        email: '',
        realname: '',
        roleId: 0,
        password: '',
        isEnable: 0
      },
      roleList: [],
      rules: {
        username: [
          {required: true, message: '请填写用户昵称', trigger: 'blur'}
        ],
        roleId: [
          {required: true, type: 'number', message: '请选择角色', trigger: 'change'}
        ],
        email: [
          {required: true, type: 'email', message: '请填写邮箱', trigger: 'blur'}
        ],
        realname: [
          {required: true, message: '请填写真实姓名', trigger: 'blur'}
        ]
      }
    }
  },

  computed: {
    title () {
      return this.$route.params.id > 0 ? '编辑成员' : '添加成员'
    },
    changeId () {
      return this.$route.params.id
    }
  },
  watch: {
    changeId: {
      handler (val, oldVal) {
        var that = this
        if (!val) {
          this.formItem = {
            username: '',
            email: '',
            realname: '',
            roleId: 0,
            password: '',
            isEnable: 0
          }
        } else {
          that.getDetail(this.$route.params.id)
        }
      },
      deep: false
    }

  },
  methods: {
    submitForm () {
      this.$refs.formItem.validate((valid) => {
        if (valid) {
          if (this.$route.params.id > 0) {
            this.formItem.id = this.$route.params.id
            updateMember(this.formItem).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.$Message.success('修改成功')
                this.$router.push({
                  path: '/system/member-list'
                })
              } else {
                this.$Message.error(data.message || '修改失败')
              }
            })
          } else {
            // 新增
            addMember(this.formItem).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.$Message.success('添加成功')
                this.$router.push({
                  path: '/system/member-list'
                })
              } else {
                this.$Message.error(data.message || '添加失败')
              }
            }).catch()
          }
        }
      })
    },
    getDetail (id) {
      getMemberDetail(id).then(res => {
        let memberData = res.data.data
        this.formItem.username = memberData.username
        this.formItem.email = memberData.email
        this.formItem.realname = memberData.realname
        this.formItem.roleId = memberData.role
        this.formItem.isEnable = !!memberData.isEnable
      })
    }
  },
  mounted () {
    getRoleListData().then(res => {
      this.roleList = res.data.data
    })
  },
  created () {
    if (this.$route.params.id > 0) {
      console.log(this.$route.params.id)
      this.getDetail(this.$route.params.id)
    }
  }
}
</script>

<style scoped>

</style>
