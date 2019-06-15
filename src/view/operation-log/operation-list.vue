<style>
    .mleft {
        margin-left: 10px;
    }

    .ivu-divider-horizontal {
        margin: 14px 0 !important;
    }
</style>
<template>
    <div>
        <Card>
            <Row>
                <Col span="24" style="margin-bottom: 15px;">
                    <span style="">
                        <Input v-model="username" placeholder="操作用户" class="mleft" style="width: 200px"/>
                        <Input v-model="uri" placeholder="路由" class="mleft" style="width: 200px"/>
                        <DatePicker type="daterange" placement="bottom-end" v-model="fdate" placeholder="选择操作时间范围"
                                    style="width: 200px" class="mleft"></DatePicker>
                        <Button type="info" icon="ios-search" class="mleft" @click="query">查询</Button>
                        <Button type="default" icon="md-refresh" class="mleft" @click="resetQuery">重置查询</Button>
                    </span>
                </Col>
            </Row>
            <Divider style="margin-top: 5px !important;"/>
            <Table stripe ref="operations" :columns="columns" :data="operationList" :loading="loading">
                <template slot="expandRow" slot-scope="props">
                    <div style="padding:16px;">
                        <Tag color="default">Params</Tag>
                        ：
                        <Tag type="border" color="geekblue">{{ props.row.params || 'null' }}</Tag>
                        <Divider/>
                        <Tag color="default">Data</Tag>
                        ：
                        <Alert type="success" style="width: 90%; display: inline-block;">
                            <pre>{{ props.row.data || 'null' }}</pre>
                        </Alert>
                        <Divider/>
                        <Row>
                            <Col span="6">
                                <Tag color="default">Method</Tag>
                                ：
                                <Tag type="border" color="primary">{{ props.row.method }}</Tag>
                            </Col>
                            <Col span="18">
                                <Tag color="default">Uri</Tag>
                                ：
                                <Tag type="border" color="success">{{ props.row.uri }}</Tag>
                            </Col>
                        </Row>
                        <Divider/>
                        <Row>
                            <Col span="6">
                                <Tag color="default">Code</Tag>
                                ：
                                <Tag type="border" color="warning">{{ props.row.code }}</Tag>
                            </Col>
                            <Col span="18">
                                <Tag color="default">Message</Tag>
                                ：
                                <Tag type="border" color="error">{{ props.row.message || 'null' }}</Tag>
                            </Col>
                        </Row>
                        <Divider/>
                        <Tag color="default">Agent</Tag>
                        ：
                        <Tag type="border" color="cyan">{{ props.row.agent }}</Tag>
                    </div>
                </template>
            </Table>
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
        </Card>
    </div>
</template>
<script type="text/ecmascript-6">
    import {getOperation} from '@/api/operation'
    import {getLocalStorage} from '@/libs/util'
    import {hasOneOf} from '@/libs/tools'

    export default {
        name: 'operation_list',
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
                username: '',
                uri: '',
                fdate: '',
                columns: [
                    {
                        title: '#',
                        align: 'center',
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(
                                'div',
                                this.$refs.operations.$scopedSlots.expandRow({row: params.row})
                            )
                        }
                    },
                    {
                        title: '#',
                        width: 80,
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '操作者',
                        key: 'username',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'md-contact'
                                    }
                                }),
                                h('span', {
                                    style: 'margin-left: 3px;'
                                }, params.row.username)
                            ])
                        }
                    },
                    {
                        title: '操作',
                        key: 'route',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: 'margin-left: 3px;'
                                }, params.row.route)
                            ])
                        }
                    },
                    {
                        title: 'ip',
                        key: 'ip',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-pin-outline'
                                    }
                                }),
                                h('span', {
                                    style: 'margin-left: 3px;'
                                }, params.row.ip)
                            ])
                        }
                    },
                    {
                        title: 'ip信息',
                        key: 'ipInfo',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-pin'
                                    }
                                }),
                                h('span', {
                                    style: 'margin-left: 3px;'
                                }, params.row.ipInfo)
                            ])
                        }
                    },
                    {
                        title: '状态',
                        key: 'code',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type: 'dot',
                                        color: (params.row.code * 1) == 0 ? 'success' : 'error'
                                    }
                                }, (params.row.code * 1) == 0 ? '成功' : '失败')
                            ])
                        }
                    },
                    {
                        title: '操作时间',
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
                    // {
                    //     key: 'action',
                    //     title: '操作',
                    //     align: 'center',
                    //     width: 100,
                    //     render: (h, params) => {
                    //         return h('div', [
                    //             h('Button', {
                    //                 props: {
                    //                     type: 'info',
                    //                     size: 'small',
                    //                     icon: 'md-create'
                    //                 },
                    //                 style: {
                    //                     marginRight: '5px'
                    //                 },
                    //                 on: {
                    //                     click: () => {
                    //
                    //                     }
                    //                 }
                    //             }, '详情')
                    //         ])
                    //     }
                    // }
                ],
                operationList: []
            }
        },
        created() {
            this.getOperationList()
        },
        methods: {
            getOperationList() {
                const params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    username: this.username,
                    uri: this.uri,
                    startTime: this.fdate && this.fdate[0] ? Date.parse(this.fdate[0]) / 1000 : 0,
                    endTime: this.fdate && this.fdate[1] ? Date.parse(this.fdate[1]) / 1000 : 0
                }

                getOperation(params).then(res => {
                    const data = res.data.data
                    this.loading = false
                    const _data = []
                    data.data.forEach((item, index) => {
                        item.data = JSON.stringify(JSON.parse(item.data), null, 4)
                        _data[index] = item
                    })

                    this.operationList = _data
                    this.total = data.meta.total
                    this.showPage = data.meta.total > this.pageSize
                }).catch(err => {
                    this.loading = false
                    this.$Message.error('获取数据失败')
                })
            },
            changePage(value) {
                this.loading = true
                this.page = value
                this.getOperationList()
            },
            changePageSize(value) {
                this.loading = true
                this.pageSize = value
                this.getOperationList()
            },
            query() {
                this.loading = true
                this.page = 1
                this.getOperationList()
            },
            resetQuery() {
                this.loading = true
                this.page = 1
                this.username = ''
                this.uri = ''
                this.fdate = ''
                this.getOperationList()
            }
        }
    }
</script>
