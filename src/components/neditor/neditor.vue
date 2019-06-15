<template>
    <div>
        <vue-neditor-wrap v-model="content" :config="config" :destroy="destroy" :height="height" :width="width"></vue-neditor-wrap>
    </div>
</template>

<script>
import VueNeditorWrap from 'vue-neditor-wrap'

export default {
  name: 'neditor',
  components: {
    VueNeditorWrap
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          UEDITOR_HOME_URL: '/Neditor/',
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 345,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 关闭自动保存
          enableAutoSave: false,
          // 保持 toolbars 固定
          autoFloatEnabled: false,
          // 定制功能
          toolbars: [
            [
              'fullscreen', 'source', '|',
              'undo', 'redo', '|',
              'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'pasteplain', '|',
              'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
              'rowspacingtop', 'rowspacingbottom', 'lineheight', 'attachment', 'map', '|',
              'customstyle', 'paragraph', 'fontfamily', 'fontsize', 'insertcode', '|',
              'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
              'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
              'link', 'unlink', 'anchor', '|',
              'horizontal', 'spechars', 'preview', 'searchreplace', '|',
              'template', 'insertimage', 'emotion', '|',
              'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts'
            ]
          ]
        }
      }
    },
    height: {
      type: [String, Number],
      default: 345
    },
    width: {
      type: [String, Number],
      default: 812
    },
    name: {
      type: String,
      default: ''
    },
    destroy: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      content: ''
    }
  },
  created () {
    if (parseInt(this.height) > 0) {
      this.config.initialFrameHeight = this.height
    }
    if (parseInt(this.width) > 0) {
      this.config.initialFrameWidth = this.width
    }
  },
  methods: {
    setHtml (html) {
      this.content = html
    },
    clearHtml () {
      this.content = ''
    }
  },
  watch: {
    content (html) {
      this.$emit('on-change', html, this.name)
    }
  }
}
</script>

<style scoped>

</style>
