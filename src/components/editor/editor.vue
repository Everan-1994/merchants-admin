<template>
    <div class="editor-wrapper">
        <div :id="editorId"></div>
    </div>
</template>

<script>
    import Editor from 'wangeditor'
    import 'wangeditor/release/wangEditor.min.css'
    import {oneOf} from '@/libs/tools'
    import {getToken} from '@/libs/util'
    import uploadUrl from '@/libs/uploadUrl'

    export default {
        name: 'Editor',
        props: {
            value: {
                type: String,
                default: ''
            },
            folder: {
                type: String,
                default: 'public'
            },
            ename: {
                type: String,
                default: ''
            },
            /**
             * 绑定的值的类型, enum: ['html', 'text']
             */
            valueType: {
                type: String,
                default: 'html',
                validator: (val) => {
                    return oneOf(val, ['html', 'text'])
                }
            },
            /**
             * @description 设置change事件触发时间间隔
             */
            changeInterval: {
                type: Number,
                default: 200
            },
            /**
             * @description 是否开启本地存储
             */
            cache: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            editorId() {
                return `editor${this._uid}`
            }
        },
        methods: {
            setHtml(val) {
                this.editor.txt.html(val)
            },
            getHtml() {
                return this.editor.txt.html()
            },
            clearHtml() {
                this.editor.txt.clear()
            }
        },
        mounted() {
            this.editor = new Editor(`#${this.editorId}`)
            this.editor.customConfig.onchange = (html) => {
                let text = this.editor.txt.text()
                if (this.cache) localStorage.editorCache = html
                this.$emit('input', this.valueType === 'html' ? html : text)
                this.$emit('on-change', html, text, this.ename)
            }
            this.editor.customConfig.onchangeTimeout = this.changeInterval
            // 自定义菜单配置
            this.editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                // 'emoticon',  // 表情
                'image',  // 插入图片
                'table',  // 表格
                'video',  // 插入视频
                // 'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ]
            // 自定义 header
            this.editor.customConfig.uploadImgHeaders = {
                'Authorization': getToken()
            }
            // 上传图片到服务器
            this.editor.customConfig.uploadImgServer = uploadUrl + '?folder=' + this.folder
            // 文件名
            this.editor.customConfig.uploadFileName = 'image'
            // 监听上传
            this.editor.customConfig.uploadImgHooks = {
                fail: function (xhr, editor, result) {
                    // 图片上传并返回结果，但图片插入错误时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                    this.$Message.error('图片上传失败');
                },
                error: function (xhr, editor) {
                    // 图片上传出错时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    this.$Message.error('图片上传失败');
                },
                timeout: function (xhr, editor) {
                    // 图片上传超时时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    this.$Message.error('上传超时，请重试。');
                },
            }
            // create这个方法一定要在所有配置项之后调用
            this.editor.create()
            // 如果本地有存储加载本地存储内容
            let html = this.value || localStorage.editorCache
            if (html) this.editor.txt.html(html)
        }
    }
</script>

<style>

</style>
