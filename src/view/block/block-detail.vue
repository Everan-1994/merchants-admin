<style>
    .ivu-upload-drag {
        height: 100% !important;
    }
</style>
<template>
    <div>
        <Card>
            <h4>{{block_title}}</h4>
            <Divider/>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
                </FormItem>
                <FormItem label="链接地址">
                    <Input v-model="formValidate.url" placeholder="请输入链接地址"></Input>
                </FormItem>
                <FormItem label="描述">
                    <NEditor ref="editor" @on-change="handleChange"></NEditor>
                </FormItem>

                <FormItem label="封面图">
                    <Upload type="drag"
                            name="file"
                            :action="upload_url"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :max-size="2048"
                            :on-exceeded-size="handleMaxSize"
                            :on-progress="handleProgress"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :show-upload-list="false"
                            :headers="headers"
                            style="width: 300px; height: 160px;">
                        <img v-if="formValidate.imagePath" :src="formValidate.imagePath" alt="封面图"
                             style="width: 100%; overflow: hidden"
                             ref="thumb">
                        <div v-else style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>Click or drag files here to upload</p>
                        </div>
                    </Upload>
                    <Input v-model="formValidate.imagePath" type="text" style="display: none;"></Input>
                </FormItem>
                <FormItem>
                    <Button type="success" @click="handleSubmit('formValidate')">保存</Button>
                    <Button type="text" @click="returnToList">返回区块内容列表</Button>
                </FormItem>

            </Form>

        </Card>
    </div>
</template>
<script type="text/ecmascript-6">
    import NEditor from '@/components/neditor/index'
    import {addBlockListItem, editBlockListItem, blockListItemDetail} from '@/api/block'
    import {getToken} from '@/libs/util'
    import uploadUrl from '@/libs/uploadUrl'

    export default {
        name: 'block_detail',
        components: {
            NEditor
        },
        data() {
            return {
                upload_url: uploadUrl,
                headers: {
                    'Authorization': getToken()
                },
                block_title: '',
                formValidate: {
                    blockId: '',
                    title: '',
                    description: '',
                    url: '',
                    imagePath: ''
                },
                uploadList: '',
                ruleValidate: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.block_title = this.$route.params.itemId ? '编辑区块内容' : '添加区块内容'
            this.getBlockListItemDetail()
        },
        methods: {
            returnToList: function () {
                this.$router.push({
                    path: '/block/list/' + this.$route.params.id
                })
            },
            getBlockListItemDetail: function () {
                var that = this
                if (this.$route.params.itemId > 0) {
                    let id = this.$route.params.itemId
                    blockListItemDetail(id).then(function (res) {
                        if (res.data.errorCode === 0) {
                            that.formValidate.title = res.data.data.title
                            that.formValidate.description = res.data.data.description
                            that.formValidate.url = res.data.data.url
                            that.formValidate.imagePath = res.data.data.imagePath
                            that.$refs.editor.setHtml(res.data.data.description)
                        } else {
                            that.$Message.info(res.data.message || '数据渲染失败')
                        }
                    }).catch(function (err) {
                        that.$Message.info(err.data.message || '接口获取失败')
                    })
                } else {
                    this.formValidate.title = ''
                    this.formValidate.description = ''
                    this.formValidate.url = ''
                    this.formValidate.imagePath = ''
                }
            },
            handleError(error, file) {
                this.$Notice.error({
                    title: '上传失败',
                    desc: '系统错误'
                })
            },
            handleSuccess(res, file) {
                if (res.errno === 0) {
                    this.formValidate.imagePath = res.data
                    this.$Notice.success({
                        title: '温馨提示',
                        desc: '图片： ' + file.name + ' 上传成功。'
                    })
                } else {
                    this.$Notice.error({
                        title: '温馨提示',
                        desc: '图片： ' + file.name + ' 上传失败。'
                    })
                }
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '温馨提示',
                    desc: '文件： ' + file.name + ' 格式不正确，请上传 jpg , png 或 jpeg 格式的图片。'
                }, 1.5)
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '温馨提示',
                    desc: '图片： ' + file.name + ' 太大，不能超过 2M。'
                }, 1.5)
            },
            handleProgress(event, file) {
                this.$Notice.info({
                    title: '温馨提示',
                    desc: '图片： ' + file.name + ' 正在上传。'
                })
            },
            handleChange(html, text) {
                this.formValidate.description = html
            },
            handleSubmit(name) {
                var that = this
                this.formValidate.blockId = this.$route.params.id
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (!this.$route.params.itemId) {
                            addBlockListItem(this.formValidate).then(function (res) {
                                if (res.data.errorCode === 0) {
                                    that.$Message.info('保存成功')
                                    that.$router.push({
                                        path: '/block/list/' + that.$route.params.id
                                    })
                                } else {
                                    that.$Message.info(res.data.message || '保存失败')
                                }
                            }).catch(function (err) {
                                that.$Message.info(err.data.message || '接口获取失败')
                            })
                        } else {
                            editBlockListItem(this.formValidate, this.$route.params.itemId).then(res => {
                                if (res.data.errorCode === 0) {
                                    that.$Message.info('保存成功')
                                    that.$router.push({
                                        path: '/block/list/' + that.$route.params.id
                                    })
                                } else {
                                    that.$Message.info(res.data.message || '保存失败')
                                }
                            }).catch(err => {
                                this.$Message.info(err.data.message || '接口获取失败')
                            })
                        }
                    }
                })
            }
        },
        computed: {
            changBlockId() {
                return this.$route.params.itemId
            }
        },
        watch: {
            changBlockId: {
                handler(val, oldVal) {
                    var that = this
                    if (!val) {
                        this.block_title = '添加区块内容'
                        this.formValidate.title = ''
                        this.formValidate.description = ''
                        this.formValidate.url = ''
                        this.formValidate.imagePath = ''
                        this.$refs.editor.setHtml('')
                    } else {
                        this.block_title = '编辑区块内容'
                        blockListItemDetail(val).then(res => {
                            if (res.data.errorCode === 0) {
                                this.formValidate.title = res.data.data.title
                                this.formValidate.description = res.data.data.description
                                this.formValidate.url = res.data.data.url
                                this.formValidate.imagePath = res.data.data.imagePath
                                this.$refs.editor.setHtml(res.data.data.description)
                            } else {
                                this.$Message.info(err.data.message || '数据渲染失败')
                            }
                        }).catch(err => {
                            this.$Message.info(err.data.message || '接口获取失败')
                        })
                    }
                },
                deep: false
            }
        }
    }
</script>
