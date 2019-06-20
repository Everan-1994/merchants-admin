<style>

    .marginTop {
        margin-top: 20px;
    }

    .mleft {
        margin-left: 10px;
    }

    .imgs {
        width: 150px;
        height: 100px;
        border: solid 1px #ecafaf;
        border-radius: 3px;
        margin-left: 3px;
    }
</style>
<template>
    <div>
        <Card>
            <Row class="marginTop" style="margin-bottom: 10px">
                <Col span="24" style="margin-bottom: 15px;">
                    <span style="">
                        <Input v-model="name" placeholder="输入用户昵称" class="mleft" style="width: 200px"/>
                        <DatePicker type="daterange" placement="bottom-end" v-model="fdate" placeholder="选择填写时间范围"
                                    style="width: 200px" class="mleft"></DatePicker>
                        <Button type="info" icon="ios-search" class="mleft" @click="query">查询</Button>
                        <Button type="default" icon="md-refresh" class="mleft" @click="resetQuery">重置查询</Button>
                    </span>
                </Col>
            </Row>

            <Table ref="comment" :columns="columns1" :data="list" :loading="loading"
                   @on-selection-change="selctChange"></Table>
            <Row class="marginTop">
                <Col span="6">
                    <div style="padding-bottom: 1px; overflow: hidden;">
                        <Button type="error" @click="deleteProduct" v-if="viewAccessAll">删除</Button>
                        <Button type="text" to="/activity/list">返回活动列表</Button>
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
                v-model="sign_detail"
                title="报告详情"
                @on-cancel="cancelReportDetail">
            <p>用户昵称：{{this.detail.name}}</p>
            <p>体验心得：{{this.detail.content}}</p>
            <p>图片：
                <Divider style="margin: 10px 0 !important;" />
                <img class="imgs" v-for="image in this.detail.images" :src="image" alt="">
                <Divider style="margin: 10px 0 !important;" />
            </p>
            <p>点赞量：{{this.detail.like_times}}</p>
            <p>填写时间：{{this.detail.date}}</p>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import {reportList, removeReportList} from '@/api/activity'
    import {getLocalStorage} from '@/libs/util'
    import {hasOneOf} from '@/libs/tools'

    export default {
        name: 'activity_report_list',
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
                toUrl: '',
                list: [],
                loading: true,
                sign_detail: false,
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户昵称',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', [
                                params.row.name
                            ])
                        }
                    },
                    {
                        title: '点赞量',
                        key: 'like_times',
                        align: 'center',
                        width: 100,
                        sortable: true,
                        render: (h, params) => {
                            return h('span', [
                                params.row.like_times
                            ])
                        }
                    },
                    {
                        title: '填写时间',
                        key: 'created_at',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', [
                                params.row.created_at
                            ])
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'operation',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    style: {
                                        marginRight: '5px',
                                        display: this.detailAccessL ? 'inline-block' : 'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.reportDetail(params.row)
                                        }
                                    }
                                }, '报告详情')
                            ])
                        }
                    }
                ],
                selectArr: [],
                detailAccessL: true,
                operation: true,
                detail: {
                    name: '',
                    content: '',
                    images: '',
                    like_times: 0,
                    date: ''
                }
            }
        },
        created() {
            let id = this.$route.params.id
            this.setReportList(id)
        },
        methods: {
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

                const list = _this.$refs.comment.getSelection()

                if (list.length === 0) {
                    this.$Message.error('请勾选要删除的报告')
                    return false
                }

                this.$Modal.confirm({
                    title: '温馨提示',
                    content: '确定要执行删除动作吗？',
                    onOk: () => {
                        const ids = {}
                        ids.ids = _this.selectArr
                        removeReportList(ids).then(function (res) {
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
            setReportList: function (id) {
                var _this = this
                let query = {
                    name: _this.name,
                    status: _this.status,
                    startTime: this.fdate && this.fdate[0] ? Date.parse(this.fdate[0]) / 1000 : 0,
                    endTime: this.fdate && this.fdate[1] ? Date.parse(this.fdate[1]) / 1000 : 0
                }
                reportList(id, query).then(function (res) {
                    if (res.data.errorCode === 0) {
                        const data = res.data.data
                        _this.list = data.data
                        _this.total = data.total
                        _this.showPage = data.total > _this.pageSize
                        _this.loading = false
                    } else {
                        _this.$Message.info('数据渲染失败')
                    }
                }).catch(function (err) {
                    _this.$Message.info('接口获取失败')
                })
            },
            changePage(value) {
                let id = this.$route.params.id
                this.loading = true
                this.page = value
                this.setReportList(id)
            },
            changePageSize(value) {
                let id = this.$route.params.id
                this.loading = true
                this.pageSize = value
                this.setReportList(id)
            },
            query() {
                let id = this.$route.params.id
                this.loading = true
                this.page = 1
                this.setReportList(id)
            },
            resetQuery() {
                let id = this.$route.params.id
                this.loading = true
                this.page = 1
                this.name = ''
                this.fdate = ''
                this.setReportList(id)
            },
            reportDetail(data) {
                this.sign_detail = true
                this.detail = {
                    name: data.name,
                    like_times: data.like_times,
                    content: data.content,
                    images: data.images,
                    date: data.created_at,
                }
            },
            cancelReportDetail() {
                this.sign_detail = false
                this.detail = {
                    name: '',
                    like_times: 0,
                    content: '',
                    images: '',
                    date: '',
                }
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
                const item = ['Delete:/admin/activity/report']
                const arr = ['*']
                if (changeAccess.toString() === arr.toString()) {
                    return true
                } else {
                    if (!hasOneOf(item, changeAccess)) {
                        this.columns1[0].type = 'html'
                    }
                    return hasOneOf(item, changeAccess)
                }
            }
        },
        watch: {
            changId: {
                // 监听路由传递的id 根据不同的id值初始化渲染页面
                handler(val, oldVal) {
                    var _this = this
                    this.setReportList(val)
                },
                deep: false
            }
        }
    }
</script>
