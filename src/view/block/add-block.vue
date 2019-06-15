<style>

</style>
<template>
    <div>
        <Card>
            <h4>{{block_title}}</h4>
            <Divider/>

            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
                <Tooltip content="仅后台管理使用" placement="top-start" style="width: 100%">
                    <FormItem label="名称" prop="name">
                        <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
                    </FormItem>
                </Tooltip>
                <FormItem label="描述">
                    <NEditor ref="editor" @on-change="changeContent"></NEditor>
                    <Input v-model="formValidate.description" type="text" style="display: none;"></Input>
                </FormItem>
                <Tooltip content="仅开发者使用,flag不得重复" placement="top-start" style="width: 100%">
                    <FormItem label="flag" prop="flag">
                        <Input v-model="formValidate.flag" style="width: 150px;" placeholder="请输入flag"></Input>
                    </FormItem>
                </Tooltip>

                <FormItem>
                    <Button type="success" @click="submitBlockDetail('formValidate')">保存</Button>
                    <Button type="text" to="/block/list">返回区块列表</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script type="text/ecmascript-6">

    import NEditor from '@/components/neditor/index'
    import {addBlock, editBlock, blockListDetail} from '@/api/block'

    export default {
        name: 'add_block',
        components: {
            NEditor
        },
        data() {
            return {
                formValidate: {
                    name: '',
                    description: '',
                    flag: '',
                    block_title: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    flag: [
                        {required: true, message: '请输入flag', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.block_title = this.$route.params.id >= 0 ? '编辑区块内容' : '添加区块内容'
            this.setBlockDetail()
            this.formValidate.flag = this.generateFlag(16);
        },
        mounted() {
        },
        methods: {
            changeContent(html) {
                this.formValidate.description = html
            },
            setBlockDetail: function () {
                let id = this.$route.params.id
                var that = this
                if (id >= 0) {
                    blockListDetail(id).then(function (res) {
                        if (res.data.errorCode === 0) {
                            that.formValidate.name = res.data.data.name
                            that.formValidate.description = res.data.data.description
                            that.formValidate.flag = res.data.data.flag
                            that.$refs.editor.setHtml(res.data.data.description)
                        } else {
                            that.$Message.info('数据渲染失败')
                        }
                    }).catch(function (err) {
                        that.$Message.info('接口获取失败')
                    })
                } else {
                    that.formValidate.name = ''
                    that.formValidate.description = ''
                    that.formValidate.flag = ''
                }
            },
            submitBlockDetail(name) {
                let id = this.$route.params.id
                var that = this
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (id >= 0) {
                            editBlock(this.formValidate, id).then(function (res) {
                                if (res.data.errorCode == 0) {
                                    that.$Message.info('保存成功')
                                    that.$router.push({
                                        name: 'block_list'
                                    })
                                } else {
                                    that.$Message.info(res.data.message || '保存失败')
                                }
                            }).catch(function (err) {
                                that.$Message.info(err.data.message || '接口获取失败')
                            })
                        } else {
                            addBlock(this.formValidate).then(function (res) {
                                if (res.data.errorCode == 0) {
                                    that.$Message.info('保存成功')
                                    that.$router.push({
                                        name: 'block_list'
                                    })
                                } else {
                                    that.$Message.info(res.data.message || '保存失败')
                                }
                            }).catch(function (err) {
                                that.$Message.info(err.data.message || '接口获取失败')
                            })
                        }
                    } else {
                    }
                })
            }
        },
        computed: {
            changId() {
                return this.$route.params.id
            }
        },
        watch: {
            changId: {
                handler(val, oldVal) {
                    var that = this
                    if (val >= 0) {
                        blockListDetail(val).then(function (res) {
                            if (res.data.errorCode === 0) {
                                that.formValidate.name = res.data.data.name
                                that.formValidate.description = res.data.data.description
                                that.formValidate.flag = res.data.data.flag
                                that.$refs.editor.setHtml(res.data.data.description)
                            } else {
                                that.$Message.info('数据渲染失败')
                            }
                        }).catch(function (err) {
                            that.$Message.info('接口获取失败')
                        })
                    } else {
                        that.formValidate.name = ''
                        that.formValidate.description = ''
                        that.formValidate.flag = ''
                        that.$refs.editor.clearHtml()
                    }
                },
                deep: false
            }
        }

    }
</script>
