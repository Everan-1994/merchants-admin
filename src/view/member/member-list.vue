<template>
    <div>
        <Card>
            <Row>
                <Col span="24" style="margin-bottom: 15px;">
                    <Button type="primary" icon="md-add" @click="addOrEditMember" v-if="addAccess"
                            to="/member/member-add">
                        添加成员
                    </Button>
                </Col>
            </Row>

            <Table stripe ref="members" :columns="columns" :data="memberList" :loading="loading"></Table>

            <Button type="error" icon="ios-trash" @click="deleteMembers" style="margin-top: 15px;" v-if="viewAccessAll">
                删 除
            </Button>

        </Card>
    </div>
</template>
<script type="text/ecmascript-6">
    import Tables from '_c/tables'
    import {getMemberListData, deleteMember, changeMemberStatus} from '@/api/member'
    import {getLocalStorage} from '@/libs/util'
    import {hasOneOf} from '@/libs/tools'

    export default {
        name: 'member-list',
        components: {
            Tables
        },
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '昵称',
                        key: 'username',
                        sortable: true,
                        render: (h, params) => {
                            if((new Date().getTime() - new Date(params.row.createdAt).getTime()) <= 300000){
                                return h('span', [
                                    params.row.username,
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
                            }else{
                                return h('span', [
                                    params.row.username
                                ])
                            }
                        }
                    },
                    {title: '邮箱', key: 'email'},
                    {title: '真实姓名', key: 'realname'},
                    {title: '角色', key: 'role'},
                    {
                        title: '启用',
                        key: 'isEnable',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if (this.release) {
                                return h('i-switch', {
                                    props: {
                                        size: 'small',
                                        value: !!params.row.isEnable
                                    },
                                    scopedSlots: {
                                        open: () => h('span'),
                                        close: () => h('span')
                                    },
                                    on: {
                                        'on-change': (value) => {
                                            this.changeStatus(params.row.id, value)
                                        }
                                    }
                                })
                            } else {
                                return h('div', {}, params.row.isEnable ? '启用' : '不启用')
                            }

                        }
                    },
                    {
                        title: '添加时间',
                        key: 'createdAt',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('span', [
                                params.row.createdAt
                            ])
                        }
                    },
                    {
                        key: 'action',
                        title: '操作',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    props: {
                                        to: '/member/member-edit/' + params.row.id,
                                        type: 'primary',
                                        size: 'small',
                                        placement: 'top',
                                    },
                                    on: {
                                        click: () => {
                                            this.addOrEditMember(params.row.id)
                                        }
                                    }
                                }, '编辑')
                            ])
                        }
                    }
                ],
                memberList: [],
                loading: true,
                release: true
            }
        },
        computed: {
            //删除权限限制
            viewAccessAll() {
                const changeAccess = getLocalStorage('access').split(',');
                const item = ['Delete:/admin/members'];
                const arr = ["*"];
                if (changeAccess.toString() == arr.toString()) {
                    return true
                } else {
                    if (!hasOneOf(item, changeAccess)) {
                        this.columns[0].type = 'html'
                    }
                    return hasOneOf(item, changeAccess)
                }
            },
            addAccess() {
                const changeAccess = getLocalStorage('access').split(',');
                const item = ['Post:/admin/members']
                const arr = ["*"];
                if (changeAccess.toString() == arr.toString()) {
                    return true
                } else {
                    return hasOneOf(item, changeAccess)
                }
            }
        },
        created() {
            this.editAccess();
            this.releaseAccess();
        },
        methods: {
            editAccess() {
                const addAccess = getLocalStorage('access').split(',');
                const item = ['Put:/admin/members'];
                const arr = ["*"];
                if (addAccess.toString() == arr.toString()) {
                    return true
                } else {
                    const type = hasOneOf(item, addAccess);
                    if (!type) {
                        this.columns.pop();
                    }
                    return hasOneOf(item, addAccess)
                }
            },
            releaseAccess() {
                const addAccess = getLocalStorage('access').split(',');
                const item = ['Patch:/admin/members'];
                const arr = ["*"];
                if (addAccess.toString() == arr.toString()) {
                    return true
                } else {
                    this.release = hasOneOf(item, addAccess);
                    return hasOneOf(item, addAccess)
                }
            },
            addOrEditMember(id = 0) {
                const route = {
                    name: `${id > 0 ? 'member-edit' : 'member-add'}`,
                    params: {
                        id
                    }
                }
                this.$router.push(route)
            },
            deleteMembers() {
                const list = this.$refs.members.getSelection()

                if (list.length === 0) {
                    this.$Message.error('请勾选要删除的数据')
                    return false
                }

                this.$Modal.warning({
                    title: '温馨提示',
                    content: '确定要执行删除动作吗？',
                    closable: true,
                    onOk: () => {
                        const ids = []
                        for (let item of list) {
                            ids.push(item.id)
                        }

                        deleteMember({ids: ids}).then(res => {
                            const data = res.data
                            if (data.errorCode === 0) {
                                const success = data.data.success;
                                const fail = data.data.fail;
                                this.$Message.success('删除成功' + success.length + '条，失败' + fail.length + '条。');

                                const that = this;
                                let i;
                                for (i = that.memberList.length - 1; i >= 0; i -= 1) {
                                    const memberIndex = success.indexOf(that.memberList[i].id);
                                    if (memberIndex >= 0) {
                                        that.memberList.splice(i, 1)
                                    }
                                }
                            } else {
                                this.$Message.error('删除失败')
                            }
                        })
                    }
                })
            },

            changeStatus(id, status) {
                const data = {
                    id: id,
                    isEnable: status
                }
                changeMemberStatus(data).then(res => {
                    const data = res.data
                    if (data.errorCode === 0) {
                        this.$Message.success('操作成功')
                    } else {
                        this.$Message.error('操作失败')
                    }
                })
            }
        },
        mounted() {
            getMemberListData().then(res => {
                this.memberList = res.data.data
                this.loading = false;
            })
        }
    }

</script>
<style>
    .mleft {
        margin-left: 10px;
    }
</style>
