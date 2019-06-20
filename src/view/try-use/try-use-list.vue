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
            <Row class="marginTop" style="margin-bottom: 10px">
                <Col span="4">
                    <Button type="primary" @click="addTryUse" v-if="addAccess" to="/try_use/add-edit/-1">添加试用</Button>
                </Col>
                <Col span="20" style="margin-bottom: 15px;">
                    <span style="">
                        <Input v-model="name" placeholder="输入产品名称" class="mleft" style="width: 200px"/>
                        <Select v-model="status" class="mleft" style="width:100px" placeholder="试用状态">
                            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <DatePicker type="datetimerange" placement="bottom-end" v-model="fdate" placeholder="选择开始和结束的时间范围"
                                    style="width: 280px" class="mleft"></DatePicker>
                        <Button type="info" icon="ios-search" class="mleft" @click="query">查询</Button>
                        <Button type="default" icon="md-refresh" class="mleft" @click="resetQuery">重置查询</Button>
                    </span>
                </Col>
            </Row>
            <Table ref="try_use" :columns="columns" :data="list" :loading="loading"
                   @on-selection-change="selctChange"></Table>
            <Row class="marginTop">
                <Col span="6">
                    <div style="padding-bottom: 1px; overflow: hidden;">
                        <Button type="error" @click="deleteProduct" v-if="viewAccessAll">删除</Button>
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
    import {hasOneOf} from '@/libs/tools'
    import {tryUseList, removeTryUse, sortTryUseListItem} from '@/api/try_use'
    import {getLocalStorage} from '@/libs/util'
    import sortPoptip from '@/view/components/sortPoptip'

    export default {
        name: 'try_use_list',
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
                name: '',
                fdate: '',
                status: '',
                statusList: [
                    {
                        value: 0,
                        label: '未开始'
                    },
                    {
                        value: 1,
                        label: '进行中'
                    },
                    {
                        value: 2,
                        label: '已结束'
                    },
                ],
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
                        title: '产品名称',
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
                        title: '报名开始时间',
                        key: 'apply_start',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('span', [
                                params.row.apply_start
                            ])
                        }
                    },
                    {
                        title: '报名结束时间',
                        key: 'apply_end',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('span', [
                                params.row.apply_end
                            ])
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('span', [
                                params.row.status
                            ])
                        }
                    },
                    {
                        title: '操作',
                        width: 300,
                        align: 'center',
                        key: 'operation',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        to: '/try_use/add-edit/' + params.row.id,
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display: this.editAccessL ? 'inline-block;' : 'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.editTryUse(params.row.id)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        to: '/try_use/sign_list/' + params.row.id,
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.ManagementBlock(params.row.id)
                                        }
                                    }
                                }, '报名列表'),
                                h('Button', {
                                    props: {
                                        to: '/try_use/report_list/' + params.row.id,
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.ManagementBlock(params.row.id)
                                        }
                                    }
                                }, '报告列表'),
                                h(sortPoptip, {
                                    props: {
                                        sortObj: {
                                            current: {
                                                'id': params.row.id,
                                                'sort': params.row.sort
                                            }
                                        },
                                        sortFunc: sortTryUseListItem
                                    },
                                    style: {
                                        display: this.sortAccessL ? 'inline-block' : 'none'
                                    },
                                    on: {
                                        sortUpdated: () => {
                                            this.setTryUseList()
                                        }
                                    }
                                }, '排序')
                            ])
                        }
                    }
                ],
                list: [],
                isShow: false,
                selectArr: [],
                sortAccessL: true
            }
        },
        computed: {
            // 删除权限限制
            viewAccessAll() {
                this.changeAccess = getLocalStorage('access').split(',')
                const item = ['Delete:/admin/try_use']
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
            addAccess() {
                const addAccess = getLocalStorage('access').split(',')
                const item = ['Post:/admin/try_use']
                const arr = ['*']
                if (addAccess.toString() === arr.toString()) {
                    return true
                } else {
                    return hasOneOf(item, addAccess)
                }
            }

        },
        created() {
            this.setTryUseList()
            this.editAccess()
        },
        methods: {
            editAccess() {
                const addAccess = getLocalStorage('access').split(',')
                const item = ['Put:/admin/try_use/{id:[0-9]+}']
                const arr = ['*']
                if (addAccess.toString() === arr.toString()) {
                    return true
                } else {
                    this.editAccessL = hasOneOf(item, addAccess)
                    return hasOneOf(item, addAccess)
                }
            },
            setTryUseList: function () {
                var _this = this
                const params = {
                    name: _this.name,
                    status: _this.status,
                    page: _this.page,
                    pageSize: _this.pageSize,
                    startTime: _this.fdate && _this.fdate[0] ? Date.parse(_this.fdate[0]) / 1000 : 0,
                    endTime: _this.fdate && _this.fdate[1] ? Date.parse(_this.fdate[1]) / 1000 : 0
                }

                tryUseList(params).then(function (res) {
                    if (res.data.errorCode === 0) {
                        const data = res.data.data
                        _this.list = data.data
                        _this.total = data.total
                        _this.showPage = data.total > _this.pageSize
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

                const list = _this.$refs.topics.getSelection()

                if (list.length === 0) {
                    this.$Message.error('请勾选要删除的试用')
                    return false
                }

                this.$Modal.confirm({
                    title: '温馨提示',
                    content: '确定要执行删除动作吗？',
                    onOk: () => {
                        const ids = {}
                        ids.ids = _this.selectArr
                        removeTryUse(ids).then(function (res) {
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
                    name: 'comment_detail_list',
                    params: {
                        id
                    },
                    meta: {
                        title: `试用评论管理`
                    }
                }
                this.$router.push(route)
            },
            editTryUse: function (id) {
                const route = {
                    name: 'add_edit_try_use',
                    params: {
                        id
                    },
                    meta: {
                        title: `${id >= 0 ? '编辑试用' : '添加试用'}`
                    }
                }
                this.$router.push(route)
            },
            addTryUse: function () {
                let id = -1
                const route = {
                    name: 'add_edit_try_use',
                    params: {
                        id
                    },
                    meta: {
                        title: `${id >= 0 ? '编辑试用' : '添加试用'}`
                    }
                }
                this.$router.push(route)
            },
            changePage(value) {
                this.loading = true
                this.page = value
                this.setTryUseList()
            },
            changePageSize(value) {
                this.loading = true
                this.pageSize = value
                this.setTryUseList()
            },
            query() {
                this.loading = true
                this.page = 1
                this.setTryUseList()
            },
            resetQuery() {
                this.loading = true
                this.page = 1
                this.name = ''
                this.fdate = ''
                this.status = ''
                this.setTryUseList()
            }
        }
    }
</script>
