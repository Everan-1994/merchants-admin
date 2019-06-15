<template>
    <div>
        <Table
                ref="dragable"
                :columns="columns"
                :data="data"
                :loading="loading"
                stripe
        ></Table>
    </div>
</template>

<script>
    import Sortable from 'sortablejs';

    export default {
        name: 'DragableTable',
        props: {
            columns: Array,
            data: Array,
            loading: Boolean
        },
        methods: {
            startFunc (e) {
                this.$emit('on-start', e.oldIndex);
            },
            endFunc (e) {
                let movedRow = this.data[e.oldIndex];
                this.data.splice(e.oldIndex, 1);
                this.data.splice(e.newIndex, 0, movedRow);
                this.$emit('on-end', {
                    data: this.data,
                    from: e.oldIndex,
                    to: e.newIndex,
                    load: true
                });
            },
            chooseFunc (e) {
                this.$emit('on-choose', e.oldIndex);
            },
            selects() {
                // this.$refs.dragable.toggleSelect(index); 设置选中
                return this.$refs.dragable.getSelection();
            }
        },
        mounted () {
            var el = this.$refs.dragable.$children[1].$el.children[1];
            let vm = this;
            Sortable.create(el, {
                onStart: vm.startFunc,
                onEnd: vm.endFunc,
                onChoose: vm.chooseFunc
            });
        }
    };
</script>

