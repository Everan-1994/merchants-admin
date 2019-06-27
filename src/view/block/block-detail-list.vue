<style>

    .marginTop {
        margin-top: 20px;
    }

    .mleft {
        margin-left: 10px;
    }

</style>
<template>
    <div>
        <Card>
            <!--<h4>区块内容管理</h4>-->
            <!--<Divider/>-->
            <Row class="marginTop" style="margin-bottom: 10px">
                <Col span="4">
                    <Button type="primary" @click="addBlock" v-if="addAccess" v-bind:to="toUrl">添加视频内容</Button>
                </Col>
                <Col span="20" style="margin-bottom: 15px;">
                    <span style="">
                        <Input v-model="title" placeholder="输入视频标题" class="mleft" style="width: 200px"/>
                        <DatePicker type="daterange" placement="bottom-end" v-model="fdate" placeholder="选择发布时间范围"
                                    style="width: 200px" class="mleft"></DatePicker>
                        <Button type="info" icon="ios-search" class="mleft" @click="query">查询</Button>
                        <Button type="default" icon="md-refresh" class="mleft" @click="resetQuery">重置查询</Button>
                    </span>
                </Col>
            </Row>

            <Table ref="dragable" :columns="columns1" :data="list" :loading="loading"
                   @on-selection-change="selctChange"></Table>
            <Row class="marginTop">
                <Col span="6">
                    <div style="padding-bottom: 1px; overflow: hidden;">
                        <Button type="error" @click="deleteProduct" v-if="viewAccessAll">删除</Button>
                        <Button type="text" to="/block/list">返回视频模块列表</Button>
                    </div>
                </Col>
                <Col span="18" v-show="showPage">
                    <div style="margin: 10px; padding-bottom: 1px; overflow: hidden;">
                        <div style="float: right; width: 80%; text-align: right;">
                            <Page :total="total"
                                  :current="page"
                                  :page-size="pageSize"
                                  @on-change="changePage"
                                  @on-page-size-change="changePageSize"
                                  show-sizer
                                  show-elevator
                                  show-total
                                  :page-size-opts="pageSizeOpts"
                                  :placement="'top'">
                            </Page>
                        </div>
                    </div>
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
        data() {
            return {
                total: 0,
                page: 1,
                pageSize: 10,
                pageSizeOpts: [10, 20, 30, 50, 100],
                order: 'sort',
                sort: 'desc',
                showPage: false,
                title: '',
                fdate: '',
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
                        title: '视频标题',
                        key: 'title',
                        render: (h, params) => {
                            return h('span', [
                                params.row.title
                            ])
                        }
                    },
                    {
                        title: '封面图',
                        key: 'front_cover',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    style: {
                                        maxWidth: '200px',
                                        maxHeight: '150px',
                                        margin: '10px 0'
                                    },
                                    attrs: {
                                        src: params.row.front_cover
                                    }
                                })
                            ])
                        }
                    },
                    // {
                    //     title: '视频',
                    //     key: 'video',
                    //     width: 270,
                    //     render: (h, params) => {
                    //         return h('video', {
                    //             style: {
                    //                 maxWidth: '250px',
                    //                 maxHeight: '150px',
                    //                 margin: '5px 0'
                    //             },
                    //             attrs: {
                    //                 src: params.row.video,
                    //                 controls: 'controls'
                    //             }
                    //         })
                    //     }
                    // },
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
                                                current: {
                                                    'id': params.row.id,
                                                    'sort': params.row.sort,
                                                    'parentId': params.row.blockId
                                                }
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
        created() {
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
            editAccess() {
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
            sortAccess() {
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
                const list = _this.$refs.dragable.getSelection()

                if (list.length === 0) {
                    this.$Message.error('请勾选要删除的视频')
                    return false
                }

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
                let query = {
                    title: _this.title,
                    startTime: this.fdate && this.fdate[0] ? Date.parse(this.fdate[0]) / 1000 : 0,
                    endTime: this.fdate && this.fdate[1] ? Date.parse(this.fdate[1]) / 1000 : 0
                }
                blockListItem(id, query).then(function (res) {
                    if (res.data.errorCode === 0) {
                        const data = res.data.data
                        _this.list = data.data
                        _this.total = data.meta.total
                        _this.showPage = data.meta.total > _this.pageSize
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
            },
            changePage(value) {
                let id = this.$route.params.id
                this.loading = true
                this.page = value
                this.setBlockList(id)
            },
            changePageSize(value) {
                let id = this.$route.params.id
                this.loading = true
                this.pageSize = value
                this.setBlockList(id)
            },
            query() {
                let id = this.$route.params.id
                this.loading = true
                this.page = 1
                this.setBlockList(id)
            },
            resetQuery() {
                let id = this.$route.params.id
                this.loading = true
                this.page = 1
                this.title = ''
                this.fdate = ''
                this.setBlockList(id)
            }
        },
        computed: {
            // 监听路由传递的id
            changId() {
                return this.$route.params.id
            },
            // 删除权限限制
            viewAccessAll() {
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
            addAccess() {
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
                handler(val, oldVal) {
                    var _this = this
                    this.setBlockList(val)
                },
                deep: false
            }
        }
    }
</script>
