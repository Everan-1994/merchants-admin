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
                <Col span="24" style="margin-bottom: 15px;">
                    <span style="">
                        <Input v-model="name" placeholder="输入用户名" class="mleft" style="width: 200px"/>
                        <Select v-model="status" class="mleft" style="width:100px" placeholder="状态">
                            <Option v-for="item in statusList" :value="item.value"
                                    :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <DatePicker type="datetimerange" placement="bottom-end" v-model="fdate" placeholder="选择中奖时间范围"
                                    style="width: 280px" class="mleft"></DatePicker>
                        <Button type="info" icon="ios-search" class="mleft" @click="query">查询</Button>
                        <Button type="default" icon="md-refresh" class="mleft" @click="resetQuery">重置查询</Button>
                    </span>
                </Col>
            </Row>
            <Table ref="winning" :columns="columns" :data="list" :loading="loading"></Table>
            <Row class="marginTop">
                <Col span="6">
                    <div style="padding-bottom: 1px; overflow: hidden;">
                        <Button type="error" v-if="viewAccessAll">删除</Button>
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
        <Modal
                v-model="winning_detail"
                title="中奖详情"
                @on-cancel="cancelWinningDetail">
            <p>用户昵称：{{this.detail.user_name}}</p>
            <p>中奖时间：{{this.detail.date}}</p>
            <p>奖品：{{this.detail.prize_name}}</p>
            <p>状态：{{this.detail.status}}</p>
            <Divider dashed style="margin: 10px 0;"/>
            <p>收件人：{{this.detail.contact_name}}</p>
            <p>联系号码：{{this.detail.contact_phone}}</p>
            <p>所在地区：{{this.detail.province}}{{this.detail.city}}{{this.detail.district}}</p>
            <p>详细地址：{{this.detail.address}}</p>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import {hasOneOf} from '@/libs/tools'
    import {winningList, toUpdateStatus} from '@/api/winning'
    import {getLocalStorage} from '@/libs/util'

    export default {
        name: 'winning_list',
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
                winning_detail: false,
                statusList: [
                    {
                        value: 0,
                        label: '未处理'
                    },
                    {
                        value: 1,
                        label: '处理中'
                    },
                    {
                        value: 2,
                        label: '已完成'
                    },
                ],
                loading: true,
                changeAccess: true,
                editAccessL: true,
                columns: [
                    {
                        title: '中奖用户',
                        key: 'user_name',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', [
                                params.row.user_name
                            ])
                        }
                    },
                    {
                        title: '联系电话',
                        key: 'contact_phone',
                        render: (h, params) => {
                            return h('span', [
                                params.row.contact_phone
                            ])
                        }
                    },
                    {
                        title: '奖品',
                        key: 'prize_name',
                        render: (h, params) => {
                            return h('span', [
                                params.row.prize_name
                            ])
                        }
                    },
                    {
                        title: '中奖时间',
                        key: 'created_at',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('span', [
                                params.row.created_at
                            ])
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            return h('span', [
                                params.row.status.res
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
                                    style: {
                                        marginRight: '5px',
                                    },
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.winningDetail(params.row)
                                        }
                                    }
                                }, '详情'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '确定要进行此操作吗?',
                                        transfer: true
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display: params.row.status.status === 2 ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.updateStatus(params.row.id, params.row.status.status)
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        style: {
                                            marginRight: '5px'
                                        },
                                        props: {
                                            type: params.row.status.status > 0 ? 'success' : 'error',
                                            size: 'small',
                                            placement: 'top'
                                        }
                                    }, params.row.status.res)
                                ]),
                            ])
                        }
                    }
                ],
                list: [],
                detail: {
                    prize_name: '',
                    user_name: '',
                    contact_name: '',
                    contact_phone: '',
                    province: '',
                    city: '',
                    district: '',
                    address: '',
                    created_at: '',
                    status: ''
                }
            }
        },
        computed: {
            // 删除权限限制
            viewAccessAll() {
                return false
            },
            // 添加权限限制
            addAccess() {
                const addAccess = getLocalStorage('access').split(',')
                const item = ['Patch:/admin/winning/{id:[0-9]+}']
                const arr = ['*']
                if (addAccess.toString() === arr.toString()) {
                    return true
                } else {
                    return hasOneOf(item, addAccess)
                }
            }

        },
        created() {
            this.setWinningList()
            this.editAccess()
        },
        methods: {
            editAccess() {
                const addAccess = getLocalStorage('access').split(',')
                const item = ['Patch:/admin/winning/{id:[0-9]+}']
                const arr = ['*']
                if (addAccess.toString() === arr.toString()) {
                    return true
                } else {
                    this.editAccessL = hasOneOf(item, addAccess)
                    return hasOneOf(item, addAccess)
                }
            },
            setWinningList: function () {
                var _this = this
                const params = {
                    name: _this.name,
                    status: _this.status,
                    page: _this.page,
                    pageSize: _this.pageSize,
                    startTime: _this.fdate && _this.fdate[0] ? Date.parse(_this.fdate[0]) / 1000 : 0,
                    endTime: _this.fdate && _this.fdate[1] ? Date.parse(_this.fdate[1]) / 1000 : 0
                }

                winningList(params).then(function (res) {
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
            changePage(value) {
                this.loading = true
                this.page = value
                this.setWinningList()
            },
            changePageSize(value) {
                this.loading = true
                this.pageSize = value
                this.setWinningList()
            },
            query() {
                this.loading = true
                this.page = 1
                this.setWinningList()
            },
            resetQuery() {
                this.loading = true
                this.page = 1
                this.name = ''
                this.fdate = ''
                this.status = ''
                this.setWinningList()
            },
            winningDetail(data) {
                this.winning_detail = true
                this.detail = {
                    user_name: data.user_name,
                    prize_name: data.prize_name,
                    contact_name: data.contact_name,
                    contact_phone: data.contact_phone,
                    province: data.province,
                    city: data.city,
                    district: data.district,
                    address: data.address,
                    date: data.created_at,
                    status: data.status.res
                }
            },
            cancelWinningDetail() {
                this.winning_detail = false
                this.detail = {
                    user_name: '',
                    prize_name: '',
                    contact_name: '',
                    contact_phone: '',
                    province: '',
                    city: '',
                    district: '',
                    address: '',
                    created_at: '',
                    status: '',
                }
            },
            updateStatus(id, status) {
                let _this = this
                let data = {
                    status: status + 1
                }
                toUpdateStatus(data, id).then(function (res) {
                    if (res.data.errorCode === 0) {
                        _this.$Message.success('操作成功')
                        _this.setWinningList()
                    } else {
                        _this.$Message.info(res.data.messages || '数据渲染失败')
                    }
                }).catch(function (err) {
                    _this.$Message.info(err.data.messages || '接口获取失败')
                })
            }
        }
    }
</script>
