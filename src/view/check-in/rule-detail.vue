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
                <FormItem label="签到规则" prop="content">
                    <Input v-model="formItem.content" type="textarea" :rows="10"></Input>
                </FormItem>
                <Button type="success" @click="submitForm">保 存</Button>
            </Form>
        </Card>
    </div>
</template>

<script>
    import {getDetail, update} from '@/api/other'

    export default {
        name: 'check_in_rule',
        data() {
            return {
                title: '签到规则',
                formItem: {
                    content: ''
                },
                validateRules: {
                    content: [
                        {required: true, message: '请填写签到规则', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        update(this.formItem, 1).then(res => {
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
                    this.formItem.content = res.data.data.content
                })
            }
        },
        created() {
            this.getDetail(1)
        }
    }
</script>

<style scoped>

</style>
