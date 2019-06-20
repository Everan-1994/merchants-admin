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
                    <Input v-model="formValidate.front_cover" type="text" style="display: none;"></Input>
                </FormItem>
                <FormItem label="标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入话题标题"></Input>
                </FormItem>
                <FormItem label="内容" prop="content">
                    <Input v-model="formValidate.content" type="textarea" :autosize="{minRows: 5, maxRows: 15}"
                           placeholder="内容"></Input>
                </FormItem>
                <FormItem style="margin-top: 5%;">
                    <Button type="success" @click="submitTopicDetail('formValidate')">保存</Button>
                    <Button type="text" to="/topic/list">返回话题列表</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script type="text/ecmascript-6">

import {addTopic, editTopic, topicListDetail} from '@/api/topic'
import uploadUrl from '@/libs/uploadUrl'
import {getToken} from '@/libs/util'

export default {
  name: 'add_edit_block',
  data () {
    return {
      upload_url: uploadUrl,
      headers: {
        'Authorization': getToken()
      },
      formValidate: {
        title: '',
        front_cover: '',
        content: '',
        sort: 0
      },
      ruleValidate: {
        title: [
          {required: true, message: '请输入话题标题', trigger: 'blur'}
        ],
        front_cover: [
          {required: true, message: '请上传封面图', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请填写话题内容', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.topic_title = this.$route.params.id >= 0 ? '编辑话题内容' : '添加话题内容'
    this.setTopicDetail()
  },
  methods: {
    setTopicDetail: function () {
      let id = this.$route.params.id
      var that = this
      if (id >= 0) {
        topicListDetail(id).then(function (res) {
          if (res.data.errorCode === 0) {
            that.formValidate.title = res.data.data.title
            that.formValidate.front_cover = res.data.data.front_cover
            that.formValidate.content = res.data.data.content
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
    submitTopicDetail (name) {
      let id = this.$route.params.id
      var that = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (id >= 0) {
            editTopic(this.formValidate, id).then(function (res) {
              if (res.data.errorCode == 0) {
                that.$Message.info('保存成功')
                that.$router.push({
                  name: 'topic_list'
                })
              } else {
                that.$Message.info(res.data.message || '保存失败')
              }
            }).catch(function (err) {
              that.$Message.info(err.data.message || '接口获取失败')
            })
          } else {
            addTopic(this.formValidate).then(function (res) {
              if (res.data.errorCode == 0) {
                that.$Message.info('保存成功')
                that.$router.push({
                  name: 'topic_list'
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
    handleError (error, file) {
      this.$Notice.error({
        title: '上传失败',
        desc: '系统错误。'
      })
    },
    handleSuccess (res, file) {
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
    handleFormatError (file) {
      this.$Notice.warning({
        title: '温馨提示',
        desc: '文件： ' + file.name + ' 格式不正确，请上传 jpg , png 或 jpeg 格式的图片。'
      }, 1.5)
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '温馨提示',
        desc: '图片： ' + file.name + ' 太大，不能超过 2M。'
      }, 1.5)
    },
    handleProgress (event, file) {
      this.$Notice.info({
        title: '温馨提示',
        desc: '图片： ' + file.name + ' 正在上传。'
      })
    }
  },
  computed: {
    changId () {
      return this.$route.params.id
    }
  },
  watch: {
    changId: {
      handler (val, oldVal) {
        var that = this
        if (val >= 0) {
          topicListDetail(val).then(function (res) {
            if (res.data.errorCode === 0) {
              that.formValidate.name = res.data.data.name
              that.formValidate.front_cover = res.data.data.front_cover
              that.formValidate.content = res.data.data.content
            } else {
              that.$Message.info('数据渲染失败')
            }
          }).catch(function (err) {
            that.$Message.info('接口获取失败')
          })
        } else {
          that.formValidate.name = ''
          that.formValidate.front_cover = ''
          that.formValidate.content = ''
        }
      },
      deep: false
    }
  }
}
</script>
