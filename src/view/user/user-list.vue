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
            <Row class="marginTop" style="margin-bottom: 20px">
                <span style="">
                        <Input v-model="name" placeholder="输入昵称" class="mleft" style="width: 200px"/>
                        <DatePicker type="datetimerange" placement="bottom-end" v-model="fdate" placeholder="选择注册时间范围"
                                    style="width: 280px" class="mleft"></DatePicker>
                        <Button type="info" icon="ios-search" class="mleft" @click="query">查询</Button>
                        <Button type="default" icon="md-refresh" class="mleft" @click="resetQuery">重置查询</Button>
                        <Button type="success" icon="md-cloud-download" class="mleft" @click="exportData">导 出</Button>
                    </span>
            </Row>
            <Table ref="users" :columns="columns" :data="list" :loading="loading"
                   @on-selection-change="selctChange"></Table>
            <Row class="marginTop">
                <Col span="24" v-show="showPage">
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
        <Modal
                v-model="show_detail"
                title="用户详情"
                @on-cancel="cancelUserDetail">
            <p>头像：<Avatar :src="this.detail.avatar"></Avatar></p>
            <p>用户昵称：{{this.detail.name}}</p>
            <p>状态：{{this.detail.status}}</p>
            <p>近7日登录次数：{{this.detail.login_times}}</p>
            <p>注册时间：{{this.detail.date}}</p>
            <Divider dashed style="margin: 10px 0;"/>
            <p>已参与活动量：{{this.detail.activities}}</p>
            <p>已参与试用量：{{this.detail.try_uses}}</p>
            <p>已填写体验报告量：{{this.detail.reports}}</p>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import {hasOneOf} from '@/libs/tools'
    import {userList, toUpdateStatus} from '@/api/wx_user'
    import {getLocalStorage} from '@/libs/util'

    export default {
        name: 'user_list',
        data() {
            return {
                total: 0,
                page: 1,
                pageSize: 10,
                pageSizeOpts: [10, 20, 30, 50, 100],
                order: 'sort',
                sort: 'desc',
                showPage: false,
                loading: true,
                changeAccess: true,
                name: '',
                fdate: '',
                columns: [
                    {
                        title: '头像',
                        key: 'avatar',
                        align: 'center',
                        render: (h, params) => {
                            return h('Avatar', {
                                props: {
                                    src: params.row.avatar
                                }
                            })
                        }
                    },
                    {
                        title: '昵称',
                        key: 'name',
                        render: (h, params) => {
                            return h('span', [
                                params.row.name
                            ])
                        }
                    },
                    {
                        title: '近7日登录次数',
                        key: 'login_times',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', [
                                params.row.login_times
                            ])
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('i-switch', {
                                props: {
                                    size: 'large',
                                    value: params.row.status
                                },
                                scopedSlots: {
                                    open: () => h('span', '启用'),
                                    close: () => h('span', '禁用')
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.updateStatus(params.row.id, value)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '注册时间',
                        key: 'created_at',
                        align: 'center',
                        sortable: true,
                        render: (h, params) => {
                            return h('span', [
                                params.row.created_at
                            ])
                        }
                    },
                    {
                        title: '操作',
                        width: 100,
                        align: 'center',
                        key: 'operation',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.showUserDetail(params.row)
                                        }
                                    }
                                }, '详情')
                            ])
                        }
                    }
                ],
                list: [],
                selectArr: [],
                show_detail: false,
                detail: {
                    name: '',
                    avatar: '',
                    status: '',
                    date: '',
                    activities: 0,
                    try_uses: 0,
                    reports: 0,
                    login_times: 0
                },
                selectMinRow: 1,
                selectMaxRow: 99999,
                selectMinCol: 1,
                selectMaxCol: 7,
            }
        },
        created() {
            this.setUserList()
        },
        methods: {
            setUserList: function () {
                var _this = this
                const params = {
                    name: _this.name,
                    page: _this.page,
                    pageSize: _this.pageSize,
                    startTime: _this.fdate && _this.fdate[0] ? Date.parse(_this.fdate[0]) / 1000 : 0,
                    endTime: _this.fdate && _this.fdate[1] ? Date.parse(_this.fdate[1]) / 1000 : 0
                }
                userList(params).then(function (res) {
                    if (res.data.errorCode === 0) {
                        _this.list = res.data.data.data
                        _this.total = res.data.data.total
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

                const list = _this.$refs.users.getSelection()

                if (list.length === 0) {
                    this.$Message.error('请勾选要删除的反馈')
                    return false
                }

                this.$Modal.confirm({
                    title: '温馨提示',
                    content: '确定要执行删除动作吗？',
                    onOk: () => {
                        const ids = {}
                        ids.ids = _this.selectArr
                        toUpdateStatus(ids).then(function (res) {
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
            showUserDetail(data) {
                this.show_detail = true
                this.detail = {
                    name: data.name,
                    avatar: data.avatar,
                    status: data.status ? '启用' : '禁用',
                    date: data.created_at,
                    activities: data.activities,
                    try_uses: data.try_uses,
                    reports: data.reports,
                    login_times: data.login_times
                }
            },
            cancelUserDetail() {
                this.show_detail = false
                this.detail = {
                    name: '',
                    avatar: '',
                    status: '',
                    date: '',
                    activities: 0,
                    try_uses: 0,
                    reports: 0,
                    login_times: 0
                }
            },
            changePage(value) {
                this.loading = true
                this.page = value
                this.setUserList()
            },
            changePageSize(value) {
                this.loading = true
                this.pageSize = value
                this.setUserList()
            },
            query() {
                this.loading = true
                this.page = 1
                this.setUserList()
            },
            resetQuery() {
                this.loading = true
                this.page = 1
                this.name = ''
                this.fdate = ''
                this.setUserList()
            },
            updateStatus(id, value) {
                let _this = this
                let data = {
                    status: value ? 1 : 0
                }
                toUpdateStatus(data, id).then(function (res) {
                    if (res.data.errorCode === 0) {
                        _this.$Message.success('操作成功')
                        _this.setUserList()
                    } else {
                        _this.$Message.info(res.data.messages || '数据渲染失败')
                    }
                }).catch(function (err) {
                    _this.$Message.info(err.data.messages || '接口获取失败')
                })
            },
            exportData() {
                const _this = this;
                if (_this.total == 0) {
                    this.$Message.warning('没有数据，无法导出工单。', 1.5);
                    return false;
                }
                var orders = [];
                _this.list.forEach((val) => {
                    orders.push({
                        name: val.name,
                        login_times: val.login_times,
                        activities: val.activities,
                        try_uses: val.try_uses,
                        reports: val.reports,
                    });
                });
                const columns = [
                    {
                        'title': '用户昵称',
                        'key': 'name'
                    },
                    {
                        'title': '近7日登录次数',
                        'key': 'login_times'
                    },
                    {
                        'title': '成功参与活动',
                        'key': 'activities'
                    },
                    {
                        'title': '成功参与试用',
                        'key': 'try_uses'
                    },
                    {
                        'title': '体验报告数',
                        'key': 'reports'
                    }
                ];
                _this.$refs.users.exportCsv({
                    filename: '用户活跃信息',
                    columns: columns.filter((col, index) => index >= _this.selectMinCol - 1 && index <= _this.selectMaxCol - 1),
                    data: orders.filter((data, index) => index >= _this.selectMinRow - 1 && index <= _this.selectMaxRow - 1)
                });
            }
        },
    }
</script>
