<style>

    .marginTop {
        margin-top: 20px;
    }

</style>
<template>
    <div>
        <Card>
            <!--<h4>区块内容管理</h4>-->
            <!--<Divider/>-->
            <Row class="marginTop" style="margin-bottom: 20px">
                <Col span="24">
                    <Button type="primary" @click="addBlock" v-if="addAccess" v-bind:to="toUrl" >添加内容</Button>
                </Col>
            </Row>

            <Table ref="dragable" :columns="columns1" :data="list" :loading="loading"
                   @on-selection-change="selctChange"></Table>

            <Row class="marginTop">
                <Col span="24">
                    <Button type="error" @click="deleteProduct" v-if="viewAccessAll">删除</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script type="text/ecmascript-6">
import {blockListItem, removeBlockListItem, sortBlockListItem} from '@/api/block'
import {getLocalStorage} from '@/libs/util'
import {hasOneOf} from '@/libs/tools'
import sortPoptip from '@/view/components/sortPoptip'

export default {
  name: 'block_detail_list',
  components: {
    sortPoptip
  },
  data () {
    return {
      toUrl: '',
      list: [],
      loading: true,
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          render: (h, params) => {
            if ((new Date().getTime() - new Date(params.row.createdAt).getTime()) <= 300000) {
              return h('span', [
                params.row.title,
                h('span', {
                  style: {
                    padding: '3px',
                    marginLeft: '5px',
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: '#009b00'
                  }
                }, 'NEW')
              ])
            } else {
              return h('span', [
                params.row.title
              ])
            }
          }
        },
        {
          title: '链接地址',
          key: 'url'
        },
        {
          title: '图片',
          key: 'imagePath',
          render: (h, params) => {
            return h('div', [
              h('img', {
                style: {
                  maxWidth: '200px',
                  maxHeight: '150px',
                  margin: '10px 0'
                },
                attrs: {
                  src: params.row.imagePath
                }
              })
            ])
          }
        },
        {
          title: '添加时间',
          width: 200,
          key: 'createAt',
          align: 'center',
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
                  to: '/block/list/' + params.row.blockId + '/add-edit/' + params.row.id,
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: this.editAccessL ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.editBlock(params.row.blockId, params.row.id)
                  }
                }
              }, '编辑'),
              h(sortPoptip, {
                props: {
                  sortObj: {
                    current: {'id': params.row.id, 'sort': params.row.sort, 'parentId': params.row.blockId}
                  },
                  sortFunc: sortBlockListItem
                },
                style: {
                  display: this.sortAccessL ? 'inline-block' : 'none'
                },
                on: {
                  sortUpdated: () => {
                    this.setBlockList(this.$route.params.id)
                  }
                }
              },
              '排序')
            ])
          }
        }
      ],
      selectArr: [],
      editAccessL: true,
      sortAccessL: true,
      operation: true
    }
  },
  created () {
    let id = this.$route.params.id
    this.toUrl = '/block/list/' + id + '/add-edit/0'
    this.setBlockList(id)
    this.editAccess()
    this.sortAccess()
    if (!this.sortAccess() && !this.editAccess()) {
      this.columns1.pop()
    }
  },
  methods: {
    editAccess () {
      const addAccess = getLocalStorage('access').split(',')
      const item = ['Put:/admin/block/item/{id:[0-9]+}']
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
      const item = ['Patch:/admin/block/item/sort']
      const arr = ['*']
      if (addAccess.toString() === arr.toString()) {
        return true
      } else {
        this.sortAccessL = hasOneOf(item, addAccess)
        return hasOneOf(item, addAccess)
      }
    },
    selctChange: function (selection) {
      const arr = []
      for (let i = 0; i < selection.length; i++) {
        arr.push(selection[i].id)
      }
      this.selectArr = arr
    },
    // 删除
    deleteProduct: function () {
      var _this = this
      this.$Modal.confirm({
        title: '温馨提示',
        content: '确定要执行删除动作吗？',
        onOk: () => {
          const ids = {}
          ids.ids = _this.selectArr
          removeBlockListItem(ids).then(function (res) {
            if (res.data.errorCode === 0) {
              let arr = _this.list.filter(item => !_this.selectArr.some(ele => ele === item.id))
              _this.list = arr
              _this.$Message.info('删除成功')
            } else {
              _this.$Message.info('删除失败')
            }
          }).catch(function (err) {
            _this.$Message.info('接口获取失败')
          })
        },
        onCancel: () => {
          this.$Message.info('取消删除')
        }
      })
    },
    // 渲染区块列表
    setBlockList: function (id) {
      var _this = this
      blockListItem(id).then(function (res) {
        if (res.data.errorCode === 0) {
          _this.list = res.data.data
          _this.loading = false
        } else {
          _this.$Message.info('数据渲染失败')
        }
      }).catch(function (err) {
        _this.$Message.info('接口获取失败')
      })
    },
    // 编辑
    editBlock: function (id, itemId) {
      const route = {
        name: 'block_detail',
        query: {
          id: id,
          itemId: itemId
        },
        meta: {
          title: `编辑区块内容`
        }
      }
      this.$router.push(route)
    },
    // 添加
    addBlock: function () {
      let id = this.$route.params.id
      let blockId = this.$route.params.id
      const route = {
        name: 'block_detail',
        query: {
          id: blockId
        },
        meta: {
          title: `添加区块内容`
        }
      }
      this.$router.push(route)
    }
  },
  mounted () {
  },
  computed: {
    // 监听路由传递的id
    changId () {
      return this.$route.params.id
    },
    // 删除权限限制
    viewAccessAll () {
      const changeAccess = getLocalStorage('access').split(',')
      const item = ['Delete:/admin/block/item']
      const arr = ['*']
      if (changeAccess.toString() === arr.toString()) {
        return true
      } else {
        if (!hasOneOf(item, changeAccess)) {
          this.columns1[0].type = 'html'
        }
        return hasOneOf(item, changeAccess)
      }
    },
    addAccess () {
      const changeAccess = getLocalStorage('access').split(',')
      const item = ['Post:/admin/block/item']
      const arr = ['*']
      if (changeAccess.toString() === arr.toString()) {
        return true
      } else {
        return hasOneOf(item, changeAccess)
      }
    }
  },
  watch: {
    changId: {
      // 监听路由传递的id 根据不同的id值初始化渲染页面
      handler (val, oldVal) {
        var _this = this
        this.setBlockList(val)
      },
      deep: false
    }
  }
}
</script>
