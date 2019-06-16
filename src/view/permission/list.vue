<template>
    <div>
        <Card>
            <Row>
                <Col span="24">
                    <Button type="primary" icon="md-add" @click="addPermission" to="/system/add" v-if="addAccess">添加权限</Button>
                    <Divider v-if="addAccess"/>
                </Col>
            </Row>
            <Table ref="permissionList" :data="permissionList" :columns="columns" :loading="loading">
            </Table>

            <Button type="error" icon="ios-trash" @click="delPermission" style="margin-top: 15px;" v-if="viewAccessAll">
                删 除
            </Button>
        </Card>
        <Modal
                width="450"
                v-model="editModal"
                :mask-closable="false">
            <div slot="header" style="color:#2786ff;text-align:center">
                <Icon :type="'md-edit'"></Icon>
                <span v-html="'编辑权限'"></span>
            </div>
            <Form ref="forms" :model="formItem" :rules="rules" :label-width="80">
                <FormItem label="权限名称" prop="name">
                    <Input v-model="formItem.name" placeholder="权限名称"/>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="formItem.description" type="textarea" placeholder="权限描述"/>
                </FormItem>

            </Form>
            <div slot="footer">
                <Button type="primary" size="large" icon="md-checkmark" long :loading="aeloading" @click="handleSubmit">
                    提 交
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script type="text/ecmascript-6">
import {getPermissionData, deletePermissions, editPermission, sortPermission} from '@/api/permission'
import {getLocalStorage} from '@/libs/util'
import {hasOneOf} from '@/libs/tools'
import sortPoptip from '@/view/components/sortPoptip'

export default {
  name: 'permission-list',
  components: {
    sortPoptip
  },
  data () {
    return {
      loading: true,
      aeloading: false,
      permissionList: [],
      editModal: false,
      editAccessL: true,
      sortAccessL: true,
      formItem: {
        id: 0,
        name: '',
        description: ''
      },
      rules: {
        name: [
          {required: true, message: '请填写权限名称', trigger: 'blur'}
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '权限',
          key: 'name',
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
        {
          title: '路由',
          key: 'route'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '添加时间',
          key: 'createAt',
          align: 'center',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'ios-calendar-outline'
                }
              }),
              h('span', {
                style: 'margin-left: 3px;'
              }, params.row.createdAt)
            ])
          }
        },

        {
          key: 'action',
          title: '操作',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: this.editAccessL ? 'inline-block;' : 'none'
                },
                on: {
                  click: () => {
                    this.getActionDetail(params.row)
                  }
                }
              }, '编辑'),
              h(sortPoptip, {
                props: {
                  sortObj: {
                    current: {
                      'id': params.row.id,
                      'sort': params.row.sort,
                      'parentId': params.row.parentId
                    }
                  },
                  sortFunc: sortPermission
                },
                style: {
                  display: this.sortAccessL ? 'inline-block' : 'none'
                },
                on: {
                  sortUpdated: () => {
                    this.getPermission()
                  }
                }
              },
              '排序')
            ])
          }
        }
      ]
    }
  },
  created () {
    this.getPermission()
    this.editAccess()
    this.sortAccess()
  },
  computed: {
    // 删除权限限制
    viewAccessAll () {
      const changeAccess = getLocalStorage('access').split(',')
      const item = ['Delete:/admin/actions']
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
      const item = ['Post:/admin/actions']
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
      const item = ['Put:/admin/actions']
      const arr = ['*']
      if (addAccess.toString() === arr.toString()) {
        return true
      } else {
        this.editAccessL = hasOneOf(item, addAccess)
        return hasOneOf(item, addAccess)
      }
    },
    sortAccess () {
      const addAccess = getLocalStorage('access').split(',')
      const item = ['Patch:/admin/actions/sort']
      const arr = ['*']
      if (addAccess.toString() === arr.toString()) {
        return true
      } else {
        this.sortAccessL = hasOneOf(item, addAccess)
        return hasOneOf(item, addAccess)
      }
    },
    addPermission () {
      const route = {
        name: 'permission-add'
      }
      this.$router.push(route)
    },
    getPermission () {
      // 初始化
      getPermissionData().then(res => {
        const data = res.data.data
        this.loading = false
        this.permissionList = [] // 初始化
        this.tree(data)
      })
    },
    tree (tree, floor = 1) {
      let _str = '└'
      let str = ' ╌ '
      var that = this
      tree.forEach(function (e) {
        that.permissionList.push({
          'id': e.id,
          'parentId': e.parentId,
          'name': e.parentId > 0 ? _str + str.repeat((floor - 1) * 2) + e.name : e.name,
          'truename': e.name,
          'route': e.parentId > 0 ? e.route : '仅分组',
          'description': e.description,
          'sort': e.sort,
          'createdAt': e.createdAt
        })
        if (e.children) {
          that.tree(e.children, floor + 1)
        }
      })
    },

    delPermission () {
      const list = this.$refs.permissionList.getSelection()

      if (list.length === 0) {
        this.$Message.error('请勾选要删除的数据')
        return false
      }

      var arr1 = []
      var arr2 = []
      this.permissionList.filter((item, index) => {
        for (let val of list) {
          if (val.id === item.parentId) {
            arr1.push(item.id)
          }
        }
      })

      list.filter((item, index) => {
        for (let v of list) {
          if (v.id === item.parentId) {
            arr2.push(item.id)
          }
        }
      })

      if (arr1.length !== arr2.length) {
        this.$Modal.warning({
          title: '操作警告',
          content: '所选分类下存在子权限，若要删除，请先删除所选权限下的子权限！',
          maskClosable: false
        })
      } else {
        this.$Modal.warning({
          title: '温馨提示',
          content: '确定要执行删除动作吗？',
          closable: true,
          onOk: () => {
            const ids = []
            const keys = []

            this.permissionList.filter((item, index) => {
              for (let val of list) {
                if (val.id === item.id) {
                  ids.push(item.id)
                  keys.push(index)
                }
              }
            })

            deletePermissions({ids: ids}).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                const success = data.data.success
                const fail = data.data.fail
                this.$Message.success('删除成功' + success.length + '条，失败' + fail.length + '条。')

                const that = this
                let i
                for (i = that.permissionList.length - 1; i >= 0; i -= 1) {
                  const permissionIndex = success.indexOf(that.permissionList[i].id)
                  if (permissionIndex >= 0) {
                    that.permissionList.splice(i, 1)
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
    getActionDetail (data) {
      this.formItem = {
        id: data.id,
        name: data.truename,
        description: data.description,
        sort: data.sort
      }

      this.editModal = true
    },
    handleSubmit () {
      this.$refs.forms.validate((valid) => {
        if (valid) {
          this.aeloading = true
          editPermission(this.formItem).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.getPermission()
              this.$Message.success('更新成功')
              this.aeloading = false
            } else {
              this.$Message.error(data.message || '更新失败')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
