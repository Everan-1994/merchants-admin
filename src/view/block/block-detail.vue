<style>
    .ivu-upload-drag {
        height: 100% !important;
    }
    .tips {
        top: 100%;
        left: 0;
        line-height: 1;
        padding-top: 6px;
    }
</style>
<template>
    <div>
        <Card>
            <h4>{{block_title}}</h4>
            <Divider/>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="封面图" prop="front_cover">
                    <Upload type="drag"
                            name="file"
                            :action="upload_url"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :max-size="2048"
                            :on-exceeded-size="handleMaxSize"
                            :on-progress="handleProgress"
                            :on-success="handleSuccessImg"
                            :on-error="handleError"
                            :show-upload-list="false"
                            :headers="headers"
                            style="width: 300px; height: 160px;">
                        <img v-if="formValidate.front_cover" :src="formValidate.front_cover" alt="视频封面"
                             style="width: 100%; overflow: hidden"
                             ref="front_cover">
                        <div v-else style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>单击或拖动图片进行上传</p>
                        </div>
                    </Upload>
                    <div class="tips">建议上传750px*401px的图片</div>
                    <Input v-model="formValidate.front_cover" type="text" style="display: none;"></Input>
                </FormItem>
                <FormItem label="标题" prop="title">
                    <Input v-model="formValidate.title" style="width: 50%;" placeholder="请输入标题"></Input>
                </FormItem>
                <FormItem label="视频" prop="video">
                    <Upload type="drag"
                            name="file"
                            :action="upload_url"
                            :format="['mp4','avi']"
                            :on-format-error="handleFormatError"
                            :max-size="51200"
                            :on-exceeded-size="handleMaxSize"
                            :on-progress="handleProgress"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :show-upload-list="false"
                            :headers="headers"
                            style="width: 50%;">
                        <video style="width: 100%;" v-if="formValidate.video" :src="formValidate.video"
                               controls="controls">
                            您的浏览器不支持 video 标签。
                        </video>
                        <div v-else style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>单击或拖动文件进行上传</p>
                        </div>
                    </Upload>
                    <Input v-model="formValidate.video" type="text" style="display: none;"/>
                </FormItem>
                <FormItem>
                    <Button type="success" @click="handleSubmit('formValidate')">保存</Button>
                    <Button type="text" @click="returnToList">返回视频列表</Button>
                </FormItem>

            </Form>

        </Card>
    </div>
</template>
<script type="text/ecmascript-6">

    import {addBlockListItem, editBlockListItem, blockListItemDetail} from '@/api/block'
    import {getToken} from '@/libs/util'
    import uploadUrl from '@/libs/uploadUrl'

    export default {
        name: 'block_detail',
        data() {
            return {
                upload_url: uploadUrl,
                headers: {
                    'Authorization': getToken()
                },
                block_title: '',
                formValidate: {
                    front_cover: '',
                    blockId: '',
                    title: '',
                    video: '',
                    sort: 0
                },
                uploadList: '',
                ruleValidate: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    front_cover: [
                        {required: true, message: '请上传封面图', trigger: 'blur'}
                    ],
                    video: [
                        {required: true, message: '请上传视频', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.block_title = this.$route.params.itemId > 0 ? '编辑视频内容' : '添加视频内容'
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
                            that.formValidate.front_cover = res.data.data.front_cover
                            that.formValidate.title = res.data.data.title
                            that.formValidate.video = res.data.data.video
                        } else {
                            that.$Message.info(res.data.message || '数据渲染失败')
                        }
                    }).catch(function (err) {
                        that.$Message.info(err.data.message || '接口获取失败')
                    })
                } else {
                    this.formValidate.front_cover = ''
                    this.formValidate.title = ''
                    this.formValidate.video = ''
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
                    this.formValidate.video = res.data
                    this.$Notice.success({
                        title: '温馨提示',
                        desc: file.name + ' 上传成功。'
                    })
                } else {
                    this.$Notice.error({
                        title: '温馨提示',
                        desc: file.name + ' 上传失败。'
                    })
                }
            },
            handleSuccessImg(res, file) {
                if (res.errno === 0) {
                    this.formValidate.front_cover = res.data
                    this.$Notice.success({
                        title: '温馨提示',
                        desc: file.name + ' 上传成功。'
                    })
                } else {
                    this.$Notice.error({
                        title: '温馨提示',
                        desc: file.name + ' 上传失败。'
                    })
                }
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '温馨提示',
                    desc: '文件： ' + file.name + ' 格式不正确，请上传正确格式的文件。'
                }, 1.5)
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '温馨提示',
                    desc: '文件： ' + file.name + ' 太大，不能超过 50M。'
                }, 1.5)
            },
            handleProgress(event, file) {
                // this.$Notice.info({
                //     title: '温馨提示',
                //     desc: '文件： ' + file.name + ' 正在上传。'
                // })
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
                        this.block_title = '添加视频内容'
                        this.formValidate.front_cover = ''
                        this.formValidate.title = ''
                        this.formValidate.video = ''
                    } else {
                        this.block_title = '编辑视频内容'
                        blockListItemDetail(val).then(res => {
                            if (res.data.errorCode === 0) {
                                this.formValidate.front_cover = res.data.data.front_cover
                                this.formValidate.title = res.data.data.title
                                this.formValidate.video = res.data.data.video
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
