<template>
    <div>
        <Row :gutter="20">
            <i-col span="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px; width: 25%;">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="30">
                    <count-to :end="infor.count" count-class="count-style"/>
                    <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
        </Row>
        <Row :gutter="20" style="margin-top: 20px;">
            <i-col span="8">
                <Card shadow>
                    <chart-china style="height: 557px;" :value="chinaData" text="最近7天日访问来源"
                                 subtext="访问统计"></chart-china>
                </Card>
            </i-col>
            <i-col span="16">
                <Card shadow>
                    <Row style="font-size: 17px; margin-bottom: 10px; color: #474747">
                        <b>最近7天访问排行</b>
                    </Row>
                    <Table ref="topLink" :data="topLink" :columns="columns" :loading="loading">
                    </Table>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import InforCard from '_c/info-card'
    import CountTo from '_c/count-to'
    import {ChartChina} from '_c/charts'
    import {getBoardData} from '@/api/index'

    export default {
        name: 'home',
        components: {
            InforCard,
            CountTo,
            ChartChina,
        },
        data() {
            return {
                inforCardData: [
                    {title: '文章总数', icon: 'md-person-add', count: 0, color: '#2d8cf0'},
                    {title: '今日新增文章总数', icon: 'md-locate', count: 0, color: '#19be6b'},
                    {title: '浏览总数', icon: 'md-help-circle', count: 0, color: '#ff9900'},
                    {title: '今日浏览总数', icon: 'md-share', count: 0, color: '#ed3f14'}
                ],
                chinaData: [],
                loading: true,
                columns: [
                    {
                        title: '链接地址',
                        key: 'district',
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: params.row.url,
                                    target: '_blank'
                                },
                            }, params.row.url)
                        }
                    },
                    {
                        title: '浏览次数',
                        key: 'pvCount',
                        align: 'right',
                        width: 85
                    }
                ],
                topLink: []
            }
        },
        created() {
            getBoardData().then(res => {
                const data = res.data.data
                this.inforCardData = [
                    {title: '文章总数', icon: 'md-person-add', count: data.articleCount, color: '#2d8cf0'},
                    {title: '今日新增文章总数', icon: 'md-locate', count: data.todayArticleCount, color: '#19be6b'},
                    {title: '浏览总数', icon: 'md-help-circle', count: data.pvCount, color: '#ff9900'},
                    {title: '今日浏览总数', icon: 'md-share', count: data.todayPvCount, color: '#ed3f14'}
                ];

                var that = this;

                if (data.topDistrict) {
                    data.topDistrict.forEach(function (e) {
                        that.chinaData.push({
                            name: e.district,
                            value: e.pvCount
                        });
                    })
                }

                this.topLink = data.topLink;
                this.loading = false;
            })
        },
        mounted() {
        }
    }
</script>

<style lang="less">
    .count-style {
        font-size: 50px;
    }
</style>
