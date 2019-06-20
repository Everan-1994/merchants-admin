<style>
    .ivu-upload-drag {
        height: 100% !important;
    }
</style>
<template>
    <div>
        <Card>
            <h4>{{topic_title}}</h4>
            <Divider/>

            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
                <FormItem label="奖品图" prop="prize_image">
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
                        <img v-if="formValidate.prize_image" :src="formValidate.prize_image" alt="奖品图"
                             style="width: 100%; overflow: hidden"
                             ref="prize_image">
                        <div v-else style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>单击或拖动文件进行上传</p>
                        </div>
                    </Upload>
                    <Input v-model="formValidate.prize_image" type="text" style="display: none;"></Input>
                </FormItem>
                <FormItem label="名称" prop="prize_name">
                    <Input v-model="formValidate.prize_name" placeholder="请输入奖品名称" style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="数量" prop="prize_num">
                    <InputNumber
                            :min="1"
                            :max="99999"
                            v-model="formValidate.prize_num"
                            placeholder="请输入奖品数量" style="width: 120px">
                    </InputNumber>
                </FormItem>
                <FormItem label="中奖率" prop="probability">
                    <InputNumber
                            :min="0"
                            :max="100"
                            v-model="formValidate.probability"
                            placeholder="请输入中奖率" style="width: 120px">
                    </InputNumber>
                </FormItem>
                <FormItem label="奖品">
                    <i-switch v-model="formValidate.status" size="large" :true-value="1" :false-value="0">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem style="margin-top: 5%;">
                    <Button type="success" @click="submitPrizeDetail('formValidate')">保存</Button>
                    <Button type="text" to="/check_in/list">返回奖品列表</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script type="text/ecmascript-6">

    import {addPrize, editPrize, prizeDetail} from '@/api/prize'
    import uploadUrl from '@/libs/uploadUrl'
    import {getToken} from '@/libs/util'

    export default {
        name: 'add_edit_prize',
        data() {
            return {
                upload_url: uploadUrl,
                headers: {
                    'Authorization': getToken()
                },
                formValidate: {
                    prize_name: '',
                    prize_num: 1,
                    prize_image: '',
                    probability: 0,
                    status: 1
                },
                ruleValidate: {
                    prize_name: [
                        {required: true, message: '请输入奖品名称', trigger: 'blur'}
                    ],
                    prize_image: [
                        {required: true, message: '请上传奖品图片', trigger: 'blur'}
                    ],
                    prize_num: [
                        {required: true, type:'number', message: '请输入奖品数量', trigger: 'blur'}
                    ],
                    probability: [
                        {required: true, type:'number', message: '请输入中奖率', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.topic_title = this.$route.params.id >= 0 ? '编辑奖品内容' : '添加奖品内容'
            this.setPrizeDetail()
        },
        methods: {
            setPrizeDetail: function () {
                let id = this.$route.params.id
                var that = this
                if (id >= 0) {
                    prizeDetail(id).then(function (res) {
                        if (res.data.errorCode === 0) {
                            that.formValidate.prize_name = res.data.data.prize_name
                            that.formValidate.prize_image = res.data.data.prize_image
                            that.formValidate.prize_num = res.data.data.prize_num
                            that.formValidate.probability = res.data.data.probability
                            that.formValidate.status = res.data.data.status
                        } else {
                            that.$Message.info('数据渲染失败')
                        }
                    }).catch(function (err) {
                        that.$Message.info('接口获取失败')
                    })
                } else {
                    that.formValidate.title = ''
                }
            },
            submitPrizeDetail(name) {
                let id = this.$route.params.id
                var that = this
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (id >= 0) {
                            editPrize(this.formValidate, id).then(function (res) {
                                if (res.data.errorCode == 0) {
                                    that.$Message.info('保存成功')
                                    that.$router.push({
                                        name: 'prize_list'
                                    })
                                } else {
                                    that.$Message.info(res.data.message || '保存失败')
                                }
                            }).catch(function (err) {
                                that.$Message.info(err.data.message || '接口获取失败')
                            })
                        } else {
                            addPrize(this.formValidate).then(function (res) {
                                if (res.data.errorCode == 0) {
                                    that.$Message.info('保存成功')
                                    that.$router.push({
                                        name: 'prize_list'
                                    })
                                } else {
                                    that.$Message.error(res.data.message || '保存失败')
                                }
                            }).catch(function (err) {
                                that.$Message.info(err.data.message || '接口获取失败')
                            })
                        }
                    } else {
                    }
                })
            },
            handleError(error, file) {
                this.$Notice.error({
                    title: '上传失败',
                    desc: '系统错误。'
                })
            },
            handleSuccess(res, file) {
                if (res.errno === 0) {
                    this.formValidate.prize_image = res.data
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
                        prizeDetail(val).then(function (res) {
                            if (res.data.errorCode === 0) {
                                that.formValidate.prize_name = res.data.data.prize_name
                                that.formValidate.prize_image = res.data.data.prize_image
                                that.formValidate.prize_num = res.data.data.prize_num
                                that.formValidate.probability = res.data.data.probability
                                that.formValidate.status = res.data.data.status
                            } else {
                                that.$Message.info('数据渲染失败')
                            }
                        }).catch(function (err) {
                            that.$Message.info('接口获取失败')
                        })
                    } else {
                        that.formValidate.prize_name = ''
                        that.formValidate.prize_image = ''
                        that.formValidate.prize_num = 1
                        that.formValidate.probability = 0
                        that.formValidate.status = 1
                    }
                },
                deep: false
            }
        }
    }
</script>
