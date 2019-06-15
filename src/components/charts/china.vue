<template>
    <div ref="dom" class="charts chart-china"></div>
</template>

<script>
    import echarts from 'echarts'
    import china from './china.json'
    require('echarts/map/js/china.js')
    echarts.registerMap('china', china)

    export default {
        name: 'ChartChina',
        props: {
            value: Array,
            text: String,
            subtext: String
        },
        watch: {
            value: {
                handler(newVal, oldVal) {
                    this.draw(newVal);
                },
                deep: true
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.draw(this.value);
            })
        },
        methods: {
            draw(value) {
                let option = {
                    title : {
                        text: this.text,
                        subtext: this.subtext,
                        left: 'center'
                    },
                    tooltip : {
                        trigger: 'item',
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: [this.subtext]
                    },
                    visualMap: {
                        min: 0,
                        max: 3000,
                        left: 'left',
                        top: 'bottom',
                        inRange: {
                            color: ['lightskyblue','gold', 'orangered']
                        },
                        text:['高','低'],
                        calculable : true
                    },
                    series : [
                        {
                            name: this.subtext,
                            type: 'map',
                            mapType: 'china',
                            showLegendSymbol: false,
                            roam: false,
                            itemStyle: {
                                emphasis: {
                                    areaColor: '#8dc600',
                                    borderColor: '#8dc600'
                                },
                            },
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true,
                                }
                            },
                            data: value
                        }
                    ]
                };

                let dom = echarts.init(this.$refs.dom, 'china')
                dom.setOption(option)
            }
        }
    }
</script>

<style lang="less">
    .charts {
        //
    }
</style>
