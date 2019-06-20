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

            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
                <FormItem label="名称" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
                </FormItem>
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
                        <img v-if="formValidate.front_cover" :src="formValidate.front_cover" alt="视频"
                             style="width: 100%; overflow: hidden"
                             ref="front_cover">
                        <div v-else style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>单击或拖动文件进行上传</p>
                        </div>
                    </Upload>
                    <Input v-model="formValidate.front_cover" type="text" style="display: none;"></Input>
                </FormItem>
                <FormItem style="margin-top: 5%;">
                    <Button type="success" @click="submitBlockDetail('formValidate')">保存</Button>
                    <Button type="text" to="/block/list">返回视频模块列表</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script type="text/ecmascript-6">

import {addBlock, editBlock, blockListDetail} from '@/api/block'
import uploadUrl from '@/libs/uploadUrl'
import {getToken} from '@/libs/util'

export default {
  name: 'add_block',
  data () {
    return {
      upload_url: uploadUrl,
      headers: {
        'Authorization': getToken()
      },
      formValidate: {
        name: '',
        front_cover: '',
        status: 1,
        sort: 0
      },
      ruleValidate: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        front_cover: [
          {required: true, message: '请上传封面图', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.block_title = this.$route.params.id >= 0 ? '编辑视频模块内容' : '添加视频模块内容'
    this.setBlockDetail()
  },
  mounted () {
  },
  methods: {
    setBlockDetail: function () {
      let id = this.$route.params.id
      var that = this
      if (id >= 0) {
        blockListDetail(id).then(function (res) {
          if (res.data.errorCode === 0) {
            that.formValidate.name = res.data.data.name
            that.formValidate.front_cover = res.data.data.front_cover
          } else {
            that.$Message.info('数据渲染失败')
          }
        }).catch(function (err) {
          that.$Message.info('接口获取失败')
        })
      } else {
        that.formValidate.name = ''
      }
    },
    submitBlockDetail (name) {
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
          blockListDetail(val).then(function (res) {
            if (res.data.errorCode === 0) {
              that.formValidate.name = res.data.data.name
              that.formValidate.front_cover = res.data.data.front_cover
            } else {
              that.$Message.info('数据渲染失败')
            }
          }).catch(function (err) {
            that.$Message.info('接口获取失败')
          })
        } else {
          that.formValidate.name = ''
          that.formValidate.front_cover = ''
        }
      },
      deep: false
    }
  }
}
</script>
