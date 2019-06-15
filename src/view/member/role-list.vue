<template>
    <div>
        <Card>
            <Row>
                <Col span="24" style="margin-bottom: 15px;">
                    <Button type="primary" icon="md-add" @click="addOrEditRole(0)" v-if="addAccess"
                            to="/member/role-add/0">
                        添加角色
                    </Button>
                </Col>
            </Row>

            <Table stripe ref="roles" :columns="columns" :data="roleList"
                   :loading="loading"></Table>

            <Button type="error" icon="ios-trash" @click="deleteRoles" style="margin-top: 15px;" v-if="viewAccessAll">删
                除
            </Button>

        </Card>
    </div>
</template>
<script type="text/ecmascript-6">
import {getRoleListData, deleteRole} from '@/api/role'
import {getLocalStorage} from '@/libs/util'
import {hasOneOf} from '@/libs/tools'

export default {
  name: 'role-list',
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '角色',
          key: 'name',
          sortable: true,
          render: (h, params) => {
            if ((new Date().getTime() - new Date(params.row.createdAt).getTime()) <= 300000) {
              return h('span', [
                params.row.name,
                h('tag', {
                  style: {
                    marginLeft: '10px',
                    fontWeight: 'bold',
                    color: '#fff'
                  },
                  props: {
                    color: '#009b00'
                  }
                }, 'NEW')
              ])
            } else {
              return h('span', [
                params.row.name
              ])
            }
          }
        },
        {title: '成员数量', key: 'memberCount'},
        {
          title: '添加时间',
          key: 'createdAt',
          align: 'center',
          width: 180,
          render: (h, params) => {
            return h('span', [
              params.row.createdAt
            ])
          }
        },
        {
          key: 'action',
          title: '操作',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                style: {
                  marginRight: '5px'
                },
                props: {
                  to: '/member/role-edit/' + params.row.id,
                  type: 'primary',
                  size: 'small',
                  placement: 'top'
                },
                on: {
                  click: () => {
                    this.addOrEditRole(params.row.id)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      roleList: [],
      loading: true
    }
  },
  created () {
    this.editAccess()
  },
  computed: {
    // 删除权限限制
    viewAccessAll () {
      const changeAccess = getLocalStorage('access').split(',')
      const item = ['Delete:/admin/roles']
      const arr = ['*']
      if (changeAccess.toString() === arr.toString()) {
        return true
      } else {
        if (!hasOneOf(item, changeAccess)) {
          this.columns[0].type = 'html'
        }
        return hasOneOf(item, changeAccess)
      }
    },
    addAccess () {
      const changeAccess = getLocalStorage('access').split(',')
      const item = ['Post:/admin/roles']
      const arr = ['*']
      if (changeAccess.toString() === arr.toString()) {
        return true
      } else {
        return hasOneOf(item, changeAccess)
      }
    }
  },
  methods: {
    editAccess () {
      const addAccess = getLocalStorage('access').split(',')
      const item = ['Put:/admin/roles']
      const arr = ['*']
      if (addAccess.toString() === arr.toString()) {
        return true
      } else {
        const type = hasOneOf(item, addAccess)
        if (!type) {
          this.columns.pop()
        }
        return hasOneOf(item, addAccess)
      }
    },
    addOrEditRole (id) {
      const route = {
        name: `${id > 0 ? 'role-edit' : 'role-add'}`,
        params: {
          id
        }
      }
      this.$router.push(route)
    },

    deleteRoles () {
      const list = this.$refs.roles.getSelection()

      if (list.length === 0) {
        this.$Message.error('请勾选要删除的数据')
        return false
      }

      this.$Modal.warning({
        title: '温馨提示',
        content: '确定要执行删除动作吗？',
        closable: true,
        onOk: () => {
          const ids = []
          for (let item of list) {
            ids.push(item.id)
          }

          deleteRole({ids: ids}).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              const success = data.data.success
              const fail = data.data.fail
              this.$Message.success('删除成功' + success.length + '条，失败' + fail.length + '条。')

              const that = this
              let i
              for (i = that.roleList.length - 1; i >= 0; i -= 1) {
                const roleIndex = success.indexOf(that.roleList[i].id)
                if (roleIndex >= 0) {
                  that.roleList.splice(i, 1)
                }
              }
            } else {
              this.$Message.error('删除失败')
            }
          })
        }
      })
    }
  },
  mounted () {
    getRoleListData().then(res => {
      this.roleList = res.data.data
      this.loading = false
    })
  }
}

</script>
<style>
    .mleft {
        margin-left: 10px;
    }
</style>
