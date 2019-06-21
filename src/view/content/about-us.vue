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
            <Form ref="formItem" :model="formItem" :label-width="80" @submit.native.prevent :rules="validateRules">
                <FormItem label="联系我们" prop="body">
                    <NEditor ref="editor" @on-change="getContent"></NEditor>
                    <Input v-model="formItem.body" type="text" style="display: none;"></Input>
                </FormItem>
                <Button type="success" @click="submitForm">保 存</Button>
            </Form>
        </Card>
    </div>
</template>

<script>
    import {getDetail, update} from '@/api/other'
    import NEditor from '@/components/neditor/index'

    export default {
        name: 'about_us',
        components: {
            NEditor
        },
        data() {
            return {
                title: '联系我们',
                formItem: {
                    body: ''
                },
                validateRules: {
                    body: [
                        {required: true, message: '请填写内容', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        update(this.formItem, 2).then(res => {
                            const data = res.data
                            if (data.errorCode === 0) {
                                this.$Message.success('保存成功')
                            } else {
                                this.$Message.error(data.message || '保存失败')
                            }
                        })
                    }
                })
            },
            getDetail(id) {
                getDetail(id).then(res => {
                    this.$refs.editor.setHtml(res.data.data.body)
                    this.formItem.body = res.data.data.body
                })
            },
            getContent(html) {
                this.formItem.body = html
            },
        },
        created() {
            this.getDetail(2)
        }
    }
</script>

<style scoped>

</style>
