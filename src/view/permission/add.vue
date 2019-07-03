<style>
    .ivu-modal-wrap {
        z-index: 99999 !important;
    }

    .ivu-upload-drag {
        height: 100% !important;
    }
</style>
<template>
    <div>
        <Card :title="title">
            <Row style="padding: 5px 30px;">
                <b>未分类的权限</b> （点击自动添加至路由输入框）
            </Row>

            <Row :gutter="16" style="padding: 0px 35px;" justify="center">
                <Col span="6" v-for="(route,index) in routes" :value="route" :key="index"  style="padding: 5px; cursor: pointer;border: 1px dashed #f4f4f4;">
                    <span @click="autoFill(route)" >{{ route }}</span>
                </Col>
            </Row>
            <Divider/>

            <Form ref="formItem" :model="formItem" :label-width="80" :rules="rules" @submit.native.prevent>
                <FormItem label="权限" prop="name">
                    <Input v-model="formItem.name" placeholder="权限名称" style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="仅分组">
                    <i-switch size="large" @on-change="onlyRead" v-model="isTurnOn">
                        <Icon type="md-checkmark" slot="open"></Icon>
                        <Icon type="md-close" slot="close"></Icon>
                    </i-switch>
                </FormItem>
                <FormItem label="路由" prop="route" v-if="!isTurnOn">
                    <Input ref="route" v-bind:readonly="isReadOnly" v-model="formItem.route" placeholder="路由地址"
                           style="width: 300px; margin-right: 20px;"></Input>
                </FormItem>
                <FormItem label="父级" v-if="!isTurnOn">
                    <Select style="width: 300px;" v-model="formItem.parentId">
                        <Option v-for="(item,key) in types" :key=item :value="key">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 5, maxRows: 15}"
                           placeholder="权限描述"></Input>
                </FormItem>
                <FormItem>
                    <Button type="success"  @click="submitForm">保 存</Button>
                    <Button type="text" to="/system/list" >返回权限列表</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
import {getPermissionMapData, addPermission} from '@/api/permission'

const formItemData = {name: '', route: '', parentId: 0, description: ''}
export default {
  name: 'permission-add',

  data () {
    return {
      isReadOnly: false,
      isTurnOn: false,
      formItem: formItemData,
      routes: [],
      types: [],
      rules: {
        name: [
          {required: true, message: '请填写路由名称', trigger: 'blur'}
        ]
      }
    }
  },

  computed: {
    title () {
      return '添加权限'
    }
  },
  methods: {
    submitForm () {
      if (this.isTurnOn === false && this.formItem.route === '') {
        console.log(this.isTurnOn)
        this.rules = {
          name: [
            {required: true, message: '请填写路由名称', trigger: 'blur'}
          ],
          route: [
            {required: true, message: '请填写路由地址', trigger: 'blur'}
          ]
        }
        return false
      } else {
        this.rules = {
          name: [
            {required: true, message: '请填写路由名称', trigger: 'blur'}
          ]
        }
      }

      this.$refs.formItem.validate((valid) => {
        if (valid) {
          // 新增
          addPermission(this.formItem).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$Message.success('添加成功')
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
              // this.$router.push({
              //   path: '/system/list'
              // })
              // 重载路由map
              // getPermissionMapData().then(res => {
              //     this.routes = res.data.data.routes
              //     this.types = res.data.data.parent
              // })
              // this.formItem.name = ''
              // this.formItem.route = ''
              // this.formItem.parentId = 0
              // this.formItem.description = ''
              // this.isReadOnly = false
              // this.isTurnOn = false
            } else {
              this.$Message.error(data.message || '添加失败')
            }
          }).catch()
        }
      })
    },
    autoFill (params) {
      if (this.isReadOnly === false) {
        this.formItem.route = params
      }
    },
    onlyRead () {
      if (this.isReadOnly === false) {
        this.formItem.route = ''
        this.formItem.parentId = 0
        this.isReadOnly = true
      } else {
        this.isReadOnly = false
      }
    }
  },
  mounted () {
    getPermissionMapData().then(res => {
      this.routes = res.data.data.routes
      this.types = res.data.data.parent
    })
  }
}
</script>

<style scoped>

</style>
