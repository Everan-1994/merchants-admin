<style>
    .marginTop {
        margin-top: 20px;
    }
</style>
<template>
    <div>
        <Card>
            <Row class="marginTop" style="margin-bottom: 20px">
                <Col span="24">
                    <Button type="primary" @click="addBlock" v-if="addAccess" to="/block/add-edit/-1">添加视频模块</Button>
                </Col>
            </Row>
            <Table ref="blocks" :columns="columns" :data="list" :loading="loading" @on-selection-change="selctChange">
                <template slot="expandRow" slot-scope="props">
                    <div style="padding: 0px 90px" v-html="props.row.description"></div>
                </template>
            </Table>
            <Row class="marginTop">
                <Col span="24">
                    <Button type="error" @click="deleteProduct" v-if="viewAccessAll">删除</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script type="text/ecmascript-6">
import {hasOneOf} from '@/libs/tools'
import {blockList, removeBlock} from '@/api/block'
import {getLocalStorage} from '@/libs/util'

export default {
  name: 'block_list',
  data () {
    return {
      loading: true,
      changeAccess: true,
      editAccessL: true,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '模块名称',
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
          title: '观看人数',
          key: 'watch_times',
          align: 'center',
          width: 180,
          render: (h, params) => {
            return h('span', [
              params.row.watch_times
            ])
          }
        },
        {
          title: '发布时间',
          key: 'createAt',
          align: 'center',
          width: 180,
          render: (h, params) => {
            return h('span', [
              params.row.createdAt
            ])
          }
        },
        {
          title: '操作',
          width: 200,
          align: 'center',
          key: 'operation',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  to: '/block/add-edit/' + params.row.id,
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: this.editAccessL ? 'inline-block;' : 'none'
                },
                on: {
                  click: () => {
                    this.editBlock(params.row.id)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  to: '/block/list/' + params.row.id,
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.ManagementBlock(params.row.id)
                  }
                }
              }, '视频列表管理')
            ])
          }
        }
      ],
      list: [],
      isShow: false,
      selectArr: []
    }
  },
  computed: {
    // 删除权限限制
    viewAccessAll () {
      this.changeAccess = getLocalStorage('access').split(',')
      const item = ['Delete:/admin/block']
      const arr = ['*']
      if (this.changeAccess.toString() === arr.toString()) {
        return true
      } else {
        if (!hasOneOf(item, this.changeAccess)) {
          this.columns[0].type = 'html'
        }
        return hasOneOf(item, this.changeAccess)
      }
    },
    // 添加权限限制
    addAccess () {
      const addAccess = getLocalStorage('access').split(',')
      const item = ['Post:/admin/block']
      const arr = ['*']
      if (addAccess.toString() === arr.toString()) {
        return true
      } else {
        return hasOneOf(item, addAccess)
      }
    }

  },
  created () {
    this.setBlockList()
    this.editAccess()
  },
  methods: {
    editAccess () {
      const addAccess = getLocalStorage('access').split(',')
      const item = ['Put:/admin/block/{id:[0-9]+}']
      const arr = ['*']
      if (addAccess.toString() === arr.toString()) {
        return true
      } else {
        this.editAccessL = hasOneOf(item, addAccess)
        return hasOneOf(item, addAccess)
      }
    },
    setBlockList: function () {
      var _this = this
      blockList().then(function (res) {
        if (res.data.errorCode === 0) {
          _this.list = res.data.data
          _this.loading = false
        } else {
          _this.$Message.info(res.data.messages || '数据渲染失败')
        }
      }).catch(function (err) {
        _this.$Message.info(err.data.messages || '接口获取失败')
      })
    },
    selctChange: function (selection) {
      const arr = []
      for (let i = 0; i < selection.length; i++) {
        arr.push(selection[i].id)
      }
      this.selectArr = arr
    },
    deleteProduct: function () {
      var _this = this

      const list = _this.$refs.blocks.getSelection()

      if (list.length === 0) {
        this.$Message.error('请勾选要删除的视频模块')
        return false
      }

      this.$Modal.confirm({
        title: '温馨提示',
        content: '确定要执行删除动作吗？',
        onOk: () => {
          const ids = {}
          ids.ids = _this.selectArr
          removeBlock(ids).then(function (res) {
            if (res.data.errorCode === 0) {
              let arr = _this.list.filter(item => !_this.selectArr.some(ele => ele === item.id))
              _this.list = arr
              _this.$Message.info('删除成功')
            } else {
              _this.$Message.info(res.data.messages || '删除失败')
            }
          }).catch(function (err) {
            _this.$Message.info(err.data.messages || '接口获取失败')
          })
        },
        onCancel: () => {
          this.$Message.info('取消删除')
        }

      })
    },
    ManagementBlock: function (id) {
      const route = {
        name: 'block_detail_list',
        params: {
          id
        },
        meta: {
          title: `区块内容管理`
        }
      }
      this.$router.push(route)
    },
    editBlock: function (id) {
      const route = {
        name: 'add_block',
        params: {
          id
        },
        meta: {
          title: `${id >= 0 ? '编辑区块列表' : '添加区块'}`
        }
      }
      this.$router.push(route)
    },
    addBlock: function () {
      let id = -1
      const route = {
        name: 'add_block',
        params: {
          id
        },
        meta: {
          title: `${id >= 0 ? '编辑区块列表' : '添加区块'}`
        }
      }
      this.$router.push(route)
    }
  },
  mounted: function () {

  }
}
</script>
