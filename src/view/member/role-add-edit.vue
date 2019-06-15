<style>
    .ivu-modal-wrap {
        z-index: 99999 !important;
    }

    .ivu-upload-drag {
        height: 100% !important;
    }

    .columns {
        height: 50px;
        line-height: 50px;
        border-bottom: solid 1px #f0f0f0;
    }
</style>
<template>
    <div>
        <Card :title="title">

            <Form :label-width="80" ref="formItem">
                <FormItem label="角色">
                    <Input v-model="roleName" placeholder="请输入角色名称" style="width: 300px;"></Input>
                </FormItem>

                <Divider/>
                <Row style="text-align: center; background-color: #f0f0f0; height: 35px;; line-height: 35px;">
                    <Col span="4"><b>操作模块</b></Col>
                    <Col span="4"><b>全权限</b></Col>
                    <Col span="16"><b>权限</b></Col>
                </Row>

                <Row>
              <span v-for="(permission, index) in permissions" :key="index">
                  <Col span="4" class="columns" style="text-align: center;">
                      {{permission.name}}
                  </Col>
                  <Col span="4" class="columns" style="text-align: center;">
                      <span>
                        <Checkbox @on-change="checkParent(permission.id, $event)"
                                  v-bind:value="editAction.indexOf(permission.id) >= 0? true : false ">
                            <span v-if="permission.description">
                                <Tooltip v-if="permission.description" :content="permission.description">
                                    模块全权限
                                </Tooltip>
                            </span>
                            <span v-else="permission.description">
                                模块全权限
                            </span>
                        </Checkbox>
                      </span>
                  </Col>
                  <Col span="16" class="columns">
                      <span style="display: inline-block" v-for="child in permission.children">
                        <CheckboxGroup v-model="disabledGroup[permission.id]" @on-change="checkChild(child.id, $event)">

                        <Checkbox :label="child.id" v-bind:disabled="editChild(permission.id)"
                                  v-bind:value="checkedChild(child.id, permission.id)">
                            <span v-if="child.description">
                                <Tooltip v-if="child.description" :content="child.description">
                                    {{child.name}}
                                </Tooltip>
                            </span>
                            <span v-else="child.description">
                                {{child.name}}
                            </span>
                        </Checkbox>
                        </CheckboxGroup>
                    </span>
                  </Col>
              </span>
                </Row>

                <FormItem style="margin-top: 30px;">
                    <Button type="success"  @click="submitForm">保 存</Button>
                    <Button type="text" to="/member/role-list" >返回角色列表</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script type="text/ecmascript-6">
import {addRole, getRoleDetail, updateRole} from '@/api/role'
import {getPermissionData} from '@/api/permission'

export default {
  name: 'role-add',
  data () {
    return {
      columns: [
        {
          title: '操作模块',
          key: 'name'
        },
        {
          title: '全权限',
          key: 'age'
        },
        {
          title: '权限',
          key: 'address'
        }
      ],
      permissions: [],
      actions: [],
      disabledGroup: [],
      roleName: '',
      roleAction: [],
      editAction: []
    }
  },
  created () {
    const id = Number(this.$route.params.id)
    this.getPermissionData(id)
  },
  computed: {
    title () {
      return this.$route.params.id > 0 ? '编辑角色' : '添加角色'
    },
    changId () {
      return this.$route.params.id
    }
  },
  methods: {
    submitForm () {
      const data = {
        name: this.roleName,
        actions: this.roleAction
      }
      if (this.$route.params.id > 0) {
        data.id = this.$route.params.id

        // 更新
        updateRole(data).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.$Message.success('更新成功')
            this.$router.push({
              path: '/member/role-list'
            })
          } else {
            this.$Message.error(data.message || '更新失败')
          }
        }).catch()
      } else {
        // 新增
        addRole(data).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.$Message.success('添加成功')
            this.$router.push({
              path: '/member/role-list'
            })
          } else {
            this.$Message.error(data.message || '添加失败')
          }
        }).catch()
      }
    },
    checkParent (data, $event) {
      var that = this
      if ($event) {
        that.actions.push(data)
        this.roleAction.push(data)
        const parent = that.permissions.filter(function (e) {
          if (e.id === data) {
            return e
          }
        })

        const item = []
        parent.forEach(function (c) {
          if (c.children) {
            c.children.forEach(function (d) {
              if (that.roleAction.indexOf(d.id) >= 0) {
                that.roleAction.splice(that.roleAction.indexOf(d.id), 1)
              }
              if (that.disabledGroup.indexOf(d.id) < 0) {
                item.push(d.id)
              }
            })
          }
        })
        that.disabledGroup[data] = item
      } else {
        that.disabledGroup[data] = []
        that.actions.splice(that.actions.indexOf(data), 1)
        that.roleAction.splice(that.roleAction.indexOf(data), 1)
      }
    },
    checkChild (data, $event) {
      if ($event) {
        if (this.roleAction.indexOf(data) < 0) {
          this.roleAction.push(data)
        } else {
          this.roleAction.splice(this.roleAction.indexOf(data), 1)
        }
      }
    },
    getPermissionData (item) {
      getPermissionData().then(res => {
        this.permissions = res.data.data
        const id = this.$route.params.id
        const type = typeof item
        if (item > 0) {
          this.getDetail(item)
        } else {
          this.roleName = ''
          this.editAction = []
          this.roleAction = []
        }
      })
    },
    getDetail (id) {
      getRoleDetail(id).then(res => {
        const roleDetail = res.data.data
        this.roleName = roleDetail.name
        this.editAction = roleDetail.actions
        this.roleAction = roleDetail.actions

        let that = this

        this.permissions.forEach(function (e) {
          let itemArr = []
          if (e.children) {
            e.children.forEach(function (d) {
              if (that.editAction.indexOf(d.id) >= 0) {
                itemArr.push(d.id)
              }
            })

            if (itemArr.length > 0) {
              that.disabledGroup[e.id] = itemArr
            }
          }
        })
      })
    },

    editChild (permissionId) {
      if (this.actions.indexOf(permissionId) >= 0 || this.editAction.indexOf(permissionId) >= 0) {
        return true
      }
      return false
    },
    checkedChild (childId, permissionId) {
      if (this.editAction.indexOf(childId) >= 0 || this.editAction.indexOf(permissionId) >= 0) {
        return true
      }
      return false
    }
  },
  mounted () {
    //      this.getPermissionData();
  },
  watch: {
    changId: {
      handler (val, oldVal) {
        this.getPermissionData(val)
      },
      deep: false
    }
  }

}
</script>

<style scoped>

</style>
