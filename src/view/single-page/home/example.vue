<style>
    .bleft {
        margin-left: 10px;
    }
</style>
<template>
    <Card style="width: 100%;height: 100%;">
        <Row>
            <Col span="12"><h3>用户分析图表</h3></Col>
            <Col span="12" style="text-align: right;">
                <RadioGroup v-model="timeData" type="button">
                    <Radio label="1">今日</Radio>
                    <Radio label="2">本周</Radio>
                    <Radio label="3">本月</Radio>
                    <Radio label="4">全年</Radio>
                </RadioGroup>
                <DatePicker type="daterange"
                            class="bleft"
                            placement="bottom-end"
                            v-model="fdate"
                            placeholder="选择开始和结束的时间范围"
                            style="width: 250px">
                </DatePicker>
            </Col>
        </Row>
        <Divider/>
        <Row style="text-align: center; margin: 50px 20px;">
            <Col span="8">
                <span style="font-size: 20px;">注册用户量</span>
                <br>
                <h2>{{user_count}}</h2>
            </Col>
            <Col span="8">
                <span style="font-size: 20px;">访问用户量</span>
                <br>
                <h2>{{today_view}}</h2>
            </Col>
            <Col span="8">
                <span style="font-size: 20px;">新增用户量</span>
                <br>
                <h2>{{today_register}}</h2>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <div ref="dom" style="width: 100%;height: 310px;" :loading="loading"></div>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import echarts from 'echarts'
    import { on, off } from '@/libs/tools'
    import {getDatas} from '@/api/home'

    export default {
        name: 'serviceRequests',
        data () {
            return {
                dom: null,
                fdate: '',
                timeData: '1',
                loading: true,
                user_count: 0,
                today_view: 0,
                today_register: 0,
                date: [],
                num: []
            }
        },
        methods: {
            getData() {
                let _this = this
                const params = {
                    times: _this.timeData,
                    startTime: _this.fdate && _this.fdate[0] ? Date.parse(_this.fdate[0]) / 1000 : 0,
                    endTime: _this.fdate && _this.fdate[1] ? Date.parse(_this.fdate[1]) / 1000 : 0
                }
                getDatas(params).then(function (res) {
                    if (res.data.errorCode === 0) {
                        const data = res.data.data
                        _this.date = data.data.date
                        _this.num = data.data.num
                        _this.user_count = data.user_count
                        _this.today_view = data.today_view
                        _this.today_register = data.today_register
                        _this.loading = false
                        _this.init() // 初始化 数据图
                    } else {
                        _this.$Message.info(res.data.messages || '数据渲染失败')
                    }
                }).catch(function (err) {
                    _this.$Message.info(err.data.messages || '接口获取失败')
                })
            },
            resize () {
                this.dom.resize()
            },
            init () {
                let _this = this
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    grid: {
                        top: '3%',
                        left: '1.2%',
                        right: '1%',
                        bottom: '3%',
                        containLabel: true
                    },
                    color: ['#369aff'], // 折线颜色
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: _this.date
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '活跃量',
                            type: 'line',
                            stack: '总量',
                            smooth: true, // 曲线平滑
                            areaStyle: { normal: {
                                    color: '#eaf4ff'
                                } },
                            data: _this.num
                        },
                    ]
                }
                this.$nextTick(() => {
                    this.dom = echarts.init(this.$refs.dom)
                    this.dom.setOption(option)
                    on(window, 'resize', this.resize)
                })
            }
        },
        mounted () {
            this.getData()
        },
        watch: {
            fdate(val, old) {
                if (old.length) {
                    this.timeData = '5' // 去掉选中
                    this.fdate = val
                    this.getData()
                }
            },
            timeData(val, old) {
                this.timeData = val
                this.getData()
            }
        },
        beforeDestroy () {
            off(window, 'resize', this.resize)
        }
    }
</script>
