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
                        <Input v-model="keyword" placeholder="输入姓名或手机号" class="mleft" style="width: 200px"/>
                        <DatePicker type="datetimerange" placement="bottom-end" v-model="fdate" placeholder="选择反馈时间范围"
                                    style="width: 280px" class="mleft"></DatePicker>
                        <Button type="info" icon="ios-search" class="mleft" @click="query">查询</Button>
                        <Button type="default" icon="md-refresh" class="mleft" @click="resetQuery">重置查询</Button>
                    </span>
            </Row>
            <Table ref="suggests" :columns="columns" :data="list" :loading="loading"
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
        <Modal
                v-model="show_detail"
                title="反馈详情"
                @on-cancel="cancelSuggestDetail">
            <p>姓名：{{this.detail.user_name}}</p>
            <p>联系电话：{{this.detail.user_tel}}</p>
            <p>反馈内容：{{this.detail.message}}</p>
            <p>反馈时间：{{this.detail.date}}</p>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import {hasOneOf} from '@/libs/tools'
    import {suggestList, removeSuggest} from '@/api/suggest'
    import {getLocalStorage} from '@/libs/util'

    export default {
        name: 'suggest_list',
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
                keyword: '',
                fdate: '',
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'user_name',
                        render: (h, params) => {
                            return h('span', [
                                params.row.user_name
                            ])
                        }
                    },
                    {
                        title: '联系电话',
                        key: 'user_tel',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', [
                                params.row.user_tel
                            ])
                        }
                    },
                    {
                        title: '反馈时间',
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
                                            this.showSuggestDetail(params.row)
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
                    user_name: '',
                    user_tel: '',
                    message: '',
                    date: ''
                }
            }
        },
        computed: {
            // 删除权限限制
            viewAccessAll() {
                this.changeAccess = getLocalStorage('access').split(',')
                const item = ['Delete:/admin/suggest']
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

        },
        created() {
            this.setSuggestList()
        },
        methods: {
            setSuggestList: function () {
                var _this = this
                const params = {
                    keyword: _this.keyword,
                    page: _this.page,
                    pageSize: _this.pageSize,
                    startTime: _this.fdate && _this.fdate[0] ? Date.parse(_this.fdate[0]) / 1000 : 0,
                    endTime: _this.fdate && _this.fdate[1] ? Date.parse(_this.fdate[1]) / 1000 : 0
                }
                suggestList(params).then(function (res) {
                    if (res.data.errorCode === 0) {
                        _this.list = res.data.data.data
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

                const list = _this.$refs.suggests.getSelection()

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
                        removeSuggest(ids).then(function (res) {
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
            showSuggestDetail(data) {
                this.show_detail = true
                this.detail = {
                    user_name: data.user_name,
                    user_tel: data.user_tel,
                    message: data.message,
                    date: data.created_at
                }
            },
            cancelSuggestDetail() {
                this.show_detail = false
                this.detail = {
                    user_name: '',
                    user_tel: '',
                    message: '',
                    date: ''
                }
            },
            changePage(value) {
                this.loading = true
                this.page = value
                this.setSuggestList()
            },
            changePageSize(value) {
                this.loading = true
                this.pageSize = value
                this.setSuggestList()
            },
            query() {
                this.loading = true
                this.page = 1
                this.setSuggestList()
            },
            resetQuery() {
                this.loading = true
                this.page = 1
                this.keyword = ''
                this.fdate = ''
                this.setSuggestList()
            }
        },
    }
</script>
