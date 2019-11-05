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
                    <Button type="primary" @click="addPrize" v-if="addAccess">添加奖品</Button>
                </Col>
            </Row>
            <Table ref="prizes" :columns="columns" :data="list" :loading="loading"
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
    import {hasOneOf} from '@/libs/tools'
    import {prizeList, removePrize} from '@/api/prize'
    import {getLocalStorage} from '@/libs/util'

    export default {
        name: 'prize_list',
        data() {
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
                        title: '奖品名称',
                        key: 'prize_name',
                        render: (h, params) => {
                            return h('span', [
                                params.row.prize_name
                            ])
                        }
                    },
                    {
                        title: '奖品图片',
                        key: 'prize_image',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    style: {
                                        maxWidth: '200px',
                                        maxHeight: '150px',
                                        margin: '10px 0'
                                    },
                                    attrs: {
                                        src: params.row.prize_image
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '奖品数量',
                        key: 'prize_num',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', [
                                params.row.prize_num
                            ])
                        }
                    },
                    {
                        title: '中奖率',
                        key: 'probability',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', [
                                params.row.probability + '%'
                            ])
                        }
                    },
                    {
                        title: '是否是奖品',
                        key: 'status',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('span', [
                                params.row.status
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
                                        display: this.editAccessL ? 'inline-block;' : 'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.editPrize(params.row.id)
                                        }
                                    }
                                }, '编辑')
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
            viewAccessAll() {
                this.changeAccess = getLocalStorage('access').split(',')
                const item = ['Delete:/admin/prize']
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
                const item = ['Post:/admin/prize']
                const arr = ['*']
                if (addAccess.toString() === arr.toString()) {
                    return true
                } else {
                    return hasOneOf(item, addAccess)
                }
            }

        },
        created() {
            this.setPrizeList()
            this.editAccess()
        },
        methods: {
            editAccess() {
                const addAccess = getLocalStorage('access').split(',')
                const item = ['Put:/admin/prize/{id:[0-9]+}']
                const arr = ['*']
                if (addAccess.toString() === arr.toString()) {
                    return true
                } else {
                    this.editAccessL = hasOneOf(item, addAccess)
                    return hasOneOf(item, addAccess)
                }
            },
            setPrizeList: function () {
                var _this = this
                prizeList().then(function (res) {
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

                const list = _this.$refs.prizes.getSelection()

                if (list.length === 0) {
                    this.$Message.error('请勾选要删除的奖品')
                    return false
                }

                this.$Modal.confirm({
                    title: '温馨提示',
                    content: '确定要执行删除动作吗？',
                    onOk: () => {
                        const ids = {}
                        ids.ids = _this.selectArr
                        removePrize(ids).then(function (res) {
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
            editPrize: function (id) {
                const route = {
                    name: 'add_edit_prize',
                    params: {
                        id
                    },
                    meta: {
                        title: `${id >= 0 ? '编辑奖品' : '添加奖品'}`
                    }
                }
                this.$router.push(route)
            },
            addPrize: function () {
                let id = -1
                const route = {
                    name: 'add_edit_prize',
                    params: {
                        id
                    },
                    meta: {
                        title: `${id >= 0 ? '编辑奖品' : '添加奖品'}`
                    }
                }
                this.$router.push(route)
            }
        },
    }
</script>
