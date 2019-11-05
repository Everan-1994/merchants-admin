<style>
    .ivu-upload-drag {
        height: 100% !important;
    }

    .demo-upload-list {
        display: inline-block;
        width: 160px;
        height: 108px;
        text-align: center;
        line-height: 108px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
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
            <h4>{{activity_title}}</h4>
            <Divider/>

            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
                <FormItem label="封面图" prop="front_cover">
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
                        <img v-if="formValidate.front_cover" :src="formValidate.front_cover" alt="封面图"
                             style="width: 100%; overflow: hidden"
                             ref="front_cover">
                        <div v-else style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>单击或拖动文件进行上传</p>
                        </div>
                    </Upload>
                    <div class="tips">建议上传686px*295px的图片</div>
                    <Input v-model="formValidate.front_cover" type="text" style="display: none;"></Input>
                </FormItem>
                <FormItem label="名称" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入活动名称" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="报名" prop="apply_start_end">
                    <DatePicker type="datetimerange" v-model="formValidate.apply_start_end" placeholder="活动报名开始和结束时间" style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem label="活动" prop="activity_start_end">
                    <DatePicker type="datetimerange" v-model="formValidate.activity_start_end" placeholder="活动开始和结束时间" style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem label="上限" prop="limit">
                    <InputNumber
                            :min="1"
                            :max="100"
                            v-model="formValidate.limit"
                            placeholder="请输入人数上限" style="width: 120px">
                    </InputNumber>
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Input v-model="formValidate.address" placeholder="请输入活动地址" style="width: 600px"></Input>
                </FormItem>
                <FormItem label="介绍" prop="uploadListJson">
                    <div class="demo-upload-list" v-for="item in formValidate.uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :on-success="uploadSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            multiple
                            type="drag"
                            :action="upload_url"
                            :headers="headers"
                            style="display: inline-block;width:158px;">
                        <div style="width: 158px;height:100px;line-height: 100px;">
                            <Icon type="ios-camera" size="30"></Icon>
                        </div>
                    </Upload>
                    <div class="tips">建议上传750px*480px的图片</div>
                    <Input v-model="formValidate.uploadListJson" type="text" style="display: none;"></Input>
                    <Modal title="预览" v-model="visible">
                        <img :src="img_url" v-if="visible" style="width: 100%">
                    </Modal>
                </FormItem>
                <FormItem label="商户" prop="content">
                    <NEditor ref="editor" @on-change="getContent"></NEditor>
                    <Input v-model="formValidate.content" type="text" style="display: none;"></Input>
                </FormItem>
                <FormItem style="margin-top: 5%;">
                    <Button type="success" @click="submitActivity('formValidate')">保存</Button>
                    <Button type="text" to="/activity/list">返回活动列表</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script type="text/ecmascript-6">
    import NEditor from '@/components/neditor/index'
    import {addActivity, editActivity, activityListDetail} from '@/api/activity'
    import uploadUrl from '@/libs/uploadUrl'
    import {getToken} from '@/libs/util'

    export default {
        name: 'add_edit_activity',
        components: {
            NEditor
        },
        data() {
            const checkDate = (rule, value, callback) => {
                if (this.formValidate.apply_start_end.filter(i => i).length === 0) {
                    callback(new Error('请选择活动开始和结束的报名时间'));
                } else {
                    callback();
                }
            };
            const checkDate2 = (rule, value, callback) => {
                if (this.formValidate.activity_start_end.filter(i => i).length === 0) {
                    callback(new Error('请选择活动开始和结束的时间'));
                } else {
                    callback();
                }
            };
            const checkDate3 = (rule, value, callback) => {
                let startTime = Date.parse(this.formValidate.apply_start_end[1]);
                let endTime = Date.parse(this.formValidate.activity_start_end[0]);
                if (startTime > endTime) {
                    callback(new Error('活动报名时间必须小于活动开始时间'));
                } else {
                    callback();
                }
            };
            return {
                upload_url: uploadUrl,
                headers: {
                    'Authorization': getToken()
                },
                formValidate: {
                    name: '',
                    front_cover: '',
                    limit: 1,
                    sort: 0,
                    address: '',
                    content: '',
                    uploadList: [],
                    uploadListJson: '',
                    apply_start_end: [],
                    activity_start_end: []
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'}
                    ],
                    front_cover: [
                        {required: true, message: '请上传封面图', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入活动地址', trigger: 'blur'}
                    ],
                    limit: [
                        {required: true, type: 'number', message: '请输入份数', trigger: 'blur'}
                    ],
                    uploadListJson: [
                        {required: true, message: '请上传介绍图', trigger: 'blur'}
                    ],
                    apply_start_end: [
                        {required: true, type: 'array', message: '请选择活动开始和结束的时间', trigger: 'blur'},
                        {validator: checkDate, trigger: 'blur'}
                    ],
                    activity_start_end: [
                        {required: true, type: 'array', message: '请选择活动开始和结束的时间', trigger: 'blur'},
                        {validator: checkDate2, trigger: 'blur'},
                        {validator: checkDate3, trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请填写商户内容', trigger: 'blur'}
                    ],
                },
                img_url: '',
                visible: false
            }
        },
        created() {
            this.activity_title = this.$route.params.id >= 0 ? '编辑活动内容' : '添加活动内容'
            this.setActivityDetail()
        },
        methods: {
            setActivityDetail: function () {
                let id = this.$route.params.id
                var that = this
                if (id >= 0) {
                    activityListDetail(id).then(function (res) {
                        if (res.data.errorCode === 0) {
                            that.formValidate.name = res.data.data['name']
                            that.formValidate.front_cover = res.data.data['front_cover']
                            that.formValidate.limit = res.data.data['limit']
                            that.formValidate.address = res.data.data['address']
                            that.formValidate.content = res.data.data['content']
                            that.$refs.editor.setHtml(res.data.data['content'])

                            that.formValidate.apply_start_end = [
                                res.data.data['apply_start'],
                                res.data.data['apply_end']
                            ]

                            that.formValidate.activity_start_end = [
                                res.data.data['activity_start'],
                                res.data.data['activity_end']
                            ]

                            that.formValidate.uploadListJson = res.data.data['activity_intro']

                            for(var img of res.data.data['default_list']) {
                                that.formValidate.uploadList.push({
                                    url: img,
                                    percentage: 100,
                                    status: "finished",
                                    showProgress: false
                                })
                            }
                        } else {
                            that.$Message.info('数据渲染失败')
                        }
                    }).catch(function (err) {
                        console.log(err)
                        that.$Message.info('接口获取失败')
                    })

                }
            },
            submitActivity(name) {
                let id = this.$route.params.id
                var that = this
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = {
                            name: that.formValidate.name,
                            front_cover: that.formValidate.front_cover,
                            address: that.formValidate.address,
                            limit: that.formValidate.limit,
                            content: that.formValidate.content,
                            activity_intro: that.formValidate.uploadListJson.substring(0, that.formValidate.uploadListJson.length - 1),
                            apply_start: Date.parse(that.formValidate.apply_start_end[0]) / 1000,
                            apply_end: Date.parse(that.formValidate.apply_start_end[1]) / 1000,
                            activity_start: Date.parse(that.formValidate.activity_start_end[0]) / 1000,
                            activity_end: Date.parse(that.formValidate.activity_start_end[1]) / 1000
                        }
                        if (id >= 0) {
                            editActivity(data, id).then(function (res) {
                                if (res.data.errorCode == 0) {
                                    that.$Message.info('保存成功')
                                    that.$router.push({
                                        name: 'activity_list'
                                    })
                                } else {
                                    that.$Message.info(res.data.message || '保存失败')
                                }
                            }).catch(function (err) {
                                that.$Message.info(err.data.message || '接口获取失败')
                            })
                        } else {
                            addActivity(data).then(function (res) {
                                if (res.data.errorCode == 0) {
                                    that.$Message.info('保存成功')
                                    that.$router.push({
                                        name: 'activity_list'
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
            },
            handleError(error, file) {
                this.$Notice.error({
                    title: '上传失败',
                    desc: '系统错误。'
                })
            },
            handleSuccess(res, file) {
                if (res.errno === 0) {
                    this.formValidate.front_cover = res.data
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
            uploadSuccess(res, file) {
                if (res.errno === 0) {
                    file.url = res.data;
                    this.formValidate.uploadListJson += res.data + ','
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
                // this.$Notice.info({
                //     title: '温馨提示',
                //     desc: '图片： ' + file.name + ' 正在上传。'
                // })
            },
            handleBeforeUpload() {
                const check = this.formValidate.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多允许上传5张图片'
                    });
                }
                return check;
            },
            handleView(img_url) {
                this.img_url = img_url;
                this.visible = true;
            },
            handleRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);

                this.formValidate.uploadListJson = ''
                for (let v of this.formValidate.uploadList) {
                    this.formValidate.uploadListJson += v.url + ','
                }
            },
            getContent(html) {
                this.formValidate.content = html
            },
        },
        computed: {
            changId() {
                return this.$route.params.id
            }
        },
        mounted () {
            this.formValidate.uploadList = this.$refs.upload.fileList;
        },
        watch: {
            changId: {
                handler(val, oldVal) {
                    var that = this
                    if (val >= 0) {
                        that.setActivityDetail()
                    } else {
                        that.formValidate.name = ''
                        that.formValidate.front_cover = ''
                        that.formValidate.address = ''
                        that.formValidate.limit = ''
                        that.formValidate.uploadList = []
                        that.formValidate.uploadListJson = ''
                        that.formValidate.apply_start_end = ''
                        that.formValidate.activity_start_end = ''
                        that.formValidate.content = ''
                    }
                },
                deep: false
            }
        }
    }
</script>
