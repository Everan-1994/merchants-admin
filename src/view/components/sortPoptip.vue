<style>
    .sort-item-list{
        min-width: 40px;
        text-align: left;
        width: 80px;
    }
    .sort-item-list .ivu-poptip-body{
        padding: 0px;
    }
    .sort-item-list button{
        display: block;
    }
    .sort-item-list .ivu-btn-text:focus {
        box-shadow: none;
    }
</style>
<template>
    <Poptip placement="bottom-start" popper-class="sort-item-list">
        <Button size="small" type="default">排序</Button>
        <div class="mark-poptip" slot="content">
            <Button size="small" icon="ios-arrow-up" @click="sort('up')" type="text" >上</Button>
            <Button size="small" icon="ios-arrow-down" @click="sort('down')" type="text">下</Button>
            <Button size="small" icon="md-arrow-up" @click="sort('top')" type="text">最顶</Button>
            <Button size="small" icon="md-arrow-down" @click="sort('bottom')"  type="text">最底</Button>
        </div>
    </Poptip>
</template>

<script>
    export default {
        name: 'sortPoptip',
        mounted() {
        },
        props: {
            sortObj: Object,
            sortFunc: Function
        },
        methods: {
            sort($sortType){
                this.sortFunc({
                    'item': {
                        'id': this.sortObj.current.id,
                        'sort': this.sortObj.current.sort,
                        'parentId': this.sortObj.current.parentId
                    },
                    'sortType': $sortType
                }).then(res => {
                    if (res.data.errorCode === 0) {
                        this.$Message.success('操作成功')
                        this.$emit('sortUpdated');
                    } else {
                        this.$Message.error('操作失败')
                    }
                }).catch(function (err) {
                    this.$Message.info('操作失败')
                });
            }
        }
    }
</script>