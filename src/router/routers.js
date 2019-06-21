import Main from '@/components/main'
import {getAccess} from '@/libs/getAccess'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/login.vue')
    },
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    hideInMenu: true,
                    title: '首页',
                    notCache: true
                },
                component: () => import('@/view/single-page/home')
            }
        ]
    },
    {
        path: '/user',
        name: '用户中心',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [
            {
                path: 'info',
                meta: {
                    hideInMenu: true,
                    title: '个人信息',
                    notCache: true
                },
                component: () => import('@/view/user/info')
            }
        ]
    },
    {
        path: '/users',
        name: 'users',
        meta: {
            icon: 'md-person',
            title: '用户管理',
            // access: Access,
            access: getAccess([
                '*',
                'Get:/admin/user',
            ]),
        },
        component: Main,
        children: [
            {
                path: 'user-list',
                name: 'user_list',
                meta: {
                    access: getAccess(['*', 'Get:/admin/user']),
                    icon: 'md-contacts',
                    title: '用户列表',
                    notCache: true
                },
                component: () => import('@/view/user/user-list')
            },
            {
                path: 'user-activity',
                name: 'user_activity',
                meta: {
                    icon: 'md-trending-up',
                    title: '分析图表',
                    notCache: true,
                    access: getAccess(['*']),
                },
                component: () => import('@/view/user/user-activity')
            },
        ]
    },
    {
        path: '/content',
        name: 'content',
        meta: {
            icon: 'md-aperture',
            title: '内容管理',
            // access: Access,
            access: getAccess([
                '*',
                'Delete:/admin/suggest',
                'Get:/admin/suggest',
                'Get:/admin/other/{id}',
                'put:/admin/other/{id}'
            ]),
        },
        component: Main,
        children: [
            {
                path: 'suggest-list',
                name: 'suggest_list',
                meta: {
                    access: getAccess(['*', 'Get:/admin/suggest', 'Delete:/admin/suggest']),
                    icon: 'md-copy',
                    title: '反馈列表',
                    notCache: true
                },
                component: () => import('@/view/content/suggest-list')
            },
            {
                path: 'about-us',
                name: 'about_us',
                meta: {
                    icon: 'ios-leaf',
                    title: '关于我们',
                    notCache: true,
                    access: getAccess(['*', 'Get:/admin/other/{id}', 'Put:/admin/other/{id}']),
                },
                component: () => import('@/view/content/about-us')
            },
        ]
    },
    {
        path: '/check_in',
        name: 'check_in',
        meta: {
            icon: 'ios-bookmarks',
            title: '签到管理',
            // access: Access,
            access: getAccess([
                '*',
                'Post:/admin/prizes',
                'Delete:/admin/prizes',
                'Get:/admin/prizes/{id}',
                'Get:/admin/prizes',
                'Put:/admin/prizes/{id}'
            ]),
        },
        component: Main,
        children: [
            {
                path: 'add-edit/:id',
                name: 'add_edit_prize',
                meta: {
                    icon: 'md-flower',
                    title: route => `${route.params.id >= 0 ? '编辑奖品' : '添加奖品'}`,
                    // access: Access,
                    hideInMenu: true,
                    access: getAccess(['*', 'Get:/admin/prizes/{id}', 'Put:/admin/prizes']),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/check-in/add-edit-prize')
            },
            {
                path: 'list',
                name: 'prize_list',
                meta: {
                    access: getAccess(['*', 'Get:/admin/prizes', 'Delete:/admin/prizes']),
                    icon: 'md-list-box',
                    title: '奖品列表',
                    notCache: true
                },
                component: () => import('@/view/check-in/prize-list')
            },
            {
                path: 'check-in-rule',
                name: 'check_in_rule',
                meta: {
                    icon: 'ios-leaf',
                    title: '签到规则',
                    notCache: true,
                    access: getAccess(['*', 'Get:/admin/other/{id}']),
                },
                component: () => import('@/view/check-in/rule-detail.vue')
            },
            {
                path: 'winning-list',
                name: 'winning_list',
                meta: {
                    access: getAccess(['*', 'Get:/admin/winning', 'Patch:/admin/winning']),
                    icon: 'ios-cart',
                    title: '中奖列表',
                    notCache: true
                },
                component: () => import('@/view/check-in/winning-list')
            },
        ]
    },
    {
        path: '/activity',
        name: 'activity',
        meta: {
            icon: 'logo-buffer',
            title: '活动管理',
            notCache: true,
            access: getAccess(['*',
                'Get:/admin/activity',
                'Get:/admin/activity/{id:[0-9]+}',
                'Put:/admin/activity/{id:[0-9]+}',
                'Post:/admin/activity',
                'Delete:/admin/activity',
                'Get:/admin/activity/{id:[0-9]+}/item',
                'Get:/admin/activity/item/{id:[0-9]+}',
                'Post:/admin/activity/item',
                'Put:/admin/activity/item/{id:[0-9]+}',
                'Delete:/admin/activity/item',
                'Patch:/admin/activity/item/sort'
            ]),
        },
        component: Main,
        children: [
            {
                path: 'add-edit/:id',
                name: 'add_edit_activity',
                meta: {
                    icon: 'md-flower',
                    title: route => `${route.params.id >= 0 ? '编辑活动' : '添加活动'}`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/activity/{id:[0-9]+}","Put:/admin/activity/{id:[0-9]+}","Post:/admin/activity"]),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/activity/add-edit-activity.vue')
            },
            {
                path: 'list',
                name: 'activity_list',
                meta: {
                    access: getAccess(["*","Get:/admin/activity","Delete:/admin/activity"]),
                    // access: Access,
                    icon: 'md-images',
                    title: '活动管理',
                    notCache: true,
                },
                component: () => import('@/view/activity/activity-list.vue'),
            },
            {
                path: 'sign_list/:id',
                name: 'activity_sign_list',
                meta: {
                    icon: 'md-flower',
                    title: route => `报名列表`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/activity/{activityId:[0-9]+}/sign","Delete:/admin/activity/sign"])
                },
                component: () => import('@/view/activity/activity-sign-list.vue')
            },

            {
                path: 'report_list/:id',
                name: 'activity_report_list',
                meta: {
                    icon: 'md-flower',
                    title: route => `报告列表`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/activity/{activityId:[0-9]+}/report","Delete:/admin/activity/report"])
                },
                component: () => import('@/view/activity/activity-report-list.vue')
            }
        ]
    },
    {
        path: '/try_use',
        name: 'try_use',
        meta: {
            icon: 'logo-buffer',
            title: '试用管理',
            notCache: true,
            access: getAccess(['*',
                'Get:/admin/try_use',
                'Get:/admin/try_use/{id:[0-9]+}',
                'Put:/admin/try_use/{id:[0-9]+}',
                'Post:/admin/try_use',
                'Delete:/admin/try_use',
                'Get:/admin/try_use/{id:[0-9]+}/item',
                'Get:/admin/try_use/item/{id:[0-9]+}',
                'Post:/admin/try_use/item',
                'Put:/admin/try_use/item/{id:[0-9]+}',
                'Delete:/admin/try_use/item',
                'Patch:/admin/try_use/item/sort'
            ]),
        },
        component: Main,
        children: [
            {
                path: 'add-edit/:id',
                name: 'add_edit_try_use',
                meta: {
                    icon: 'md-flower',
                    title: route => `${route.params.id >= 0 ? '编辑试用' : '添加试用'}`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/try_use/{id:[0-9]+}","Put:/admin/try_use/{id:[0-9]+}","Post:/admin/try_use"]),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/try-use/add-edit-try-use.vue')
            },
            {
                path: 'list',
                name: 'try_use_list',
                meta: {
                    access: getAccess(["*","Get:/admin/try_use","Delete:/admin/try_use"]),
                    // access: Access,
                    icon: 'md-basket',
                    title: '试用管理',
                    notCache: true,
                },
                component: () => import('@/view/try-use/try-use-list.vue'),
            },
            {
                path: 'sign_list/:id',
                name: 'try_use_sign_list',
                meta: {
                    icon: 'md-flower',
                    title: route => `报名列表`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/try_use/{tryUseId:[0-9]+}/sign","Delete:/admin/try_use/sign"])
                },
                component: () => import('@/view/try-use/try-use-sign-list.vue')
            },

            {
                path: 'report_list/:id',
                name: 'try_use_report_list',
                meta: {
                    icon: 'md-flower',
                    title: route => `报告列表`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/try_use/{tryUseId:[0-9]+}/report","Delete:/admin/try_use/report"])
                },
                component: () => import('@/view/try-use/try-use-report-list.vue')
            }
        ]
    },
    {
        path: '/topic',
        name: 'topic',
        meta: {
            icon: 'logo-buffer',
            title: '话题管理',
            notCache: true,
            access: getAccess(['*',
                'Get:/admin/topic',
                'Get:/admin/topic/{id:[0-9]+}',
                'Put:/admin/topic/{id:[0-9]+}',
                'Post:/admin/topic',
                'Delete:/admin/topic',
                'Get:/admin/topic/{id:[0-9]+}/item',
                'Get:/admin/topic/item/{id:[0-9]+}',
                'Post:/admin/topic/item',
                'Put:/admin/topic/item/{id:[0-9]+}',
                'Delete:/admin/topic/item',
                'Patch:/admin/topic/item/sort'
            ]),
        },
        component: Main,
        children: [
            {
                path: 'add-edit/:id',
                name: 'add_edit_topic',
                meta: {
                    icon: 'md-flower',
                    title: route => `${route.params.id >= 0 ? '编辑话题' : '添加话题'}`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/topic/{id:[0-9]+}","Put:/admin/topic/{id:[0-9]+}","Post:/admin/topic"]),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/topic/add-edit-topic.vue')
            },
            {
                path: 'list',
                name: 'topic_list',
                meta: {
                    access: getAccess(["*","Get:/admin/topic","Delete:/admin/topic"]),
                    // access: Access,
                    icon: 'md-bookmarks',
                    title: '话题管理',
                    notCache: true,
                },
                component: () => import('@/view/topic/topic-list.vue'),
            },
            {
                path: 'comment/:id',
                name: 'comment_detail_list',
                meta: {
                    icon: 'md-flower',
                    title: route => `评论列表`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/topic/{topicId:[0-9]+}/item","Delete:/admin/topic/item"])
                },
                component: () => import('@/view/topic/topic-comment-list.vue')
            }
        ]
    },
    {
        path: '/block',
        name: 'block',
        meta: {
            icon: 'logo-buffer',
            title: '视频模块',
            notCache: true,
            access: getAccess(['*', 'Get:/admin/block', 'Get:/admin/block/{id:[0-9]+}', 'Put:/admin/block/{id:[0-9]+}', 'Post:/admin/block', 'Delete:/admin/block', 'Get:/admin/block/{id:[0-9]+}/item', 'Get:/admin/block/item/{id:[0-9]+}', 'Post:/admin/block/item', 'Put:/admin/block/item/{id:[0-9]+}', 'Delete:/admin/block/item', 'Patch:/admin/block/item/sort']),
        },
        component: Main,
        children: [
            {
                path: 'add-edit/:id',
                name: 'add_block',
                meta: {
                    icon: 'md-flower',
                    title: route => `${route.params.id >= 0 ? '编辑视频模块' : '添加视频模块'}`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/block/{id:[0-9]+}","Put:/admin/block/{id:[0-9]+}","Post:/admin/block"]),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/block/add-block.vue')
            },
            {
                path: 'list',
                name: 'block_list',
                meta: {
                    access: getAccess(["*","Get:/admin/block","Delete:/admin/block"]),
                    // access: Access,
                    icon: 'logo-youtube',
                    title: '视频管理',
                    notCache: true,
                },
                component: () => import('@/view/block/block-list'),
            },
            {
                path: 'list/:id',
                name: 'block_detail_list',
                meta: {
                    icon: 'md-flower',
                    title: route => `视频模块管理`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/block/{blockId:[0-9]+}/item","Delete:/admin/block/item","Patch:/admin/block/item/sort"])
                },
                component: () => import('@/view/block/block-detail-list.vue')
            },
            {
                path: 'list/:id/add-edit/:itemId',
                name: 'block_detail',
                meta: {
                    icon: 'md-flower',
                    title: route => `${route.query.itemId  ? '编辑视频模块' : '添加视频模块'}`,
                    notCache: true,
                    hideInMenu: true,
                    access: getAccess(["*","Get:/admin/block/item/{id:[0-9]+}","Post:/admin/block/item","Put:/admin/block/item/{id:[0-9]+}"]),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/block/block-detail.vue')
            }
        ]
    },
    {
        path: '/system',
        name: 'system',
        meta: {
            icon: 'md-cog',
            title: '系统管理',
            notCache: true,
            // access: Access
            access: getAccess([
                '*',
                'Get:/admin/members',
                'Post:/admin/members',
                'Delete:/admin/members',
                'Get:/admin/members/{id}',
                'Put:/admin/members',
                'Patch:/admin/members',
                'Get:/admin/operation',
                'Get:/admin/roles',
                'Post:/admin/roles',
                'Delete:/admin/roles',
                'Get:/admin/roles/{id:[0-9]+}',
                'Put:/admin/roles',
                'Get:/admin/actions',
                'Post:/admin/actions',
                'Delete:/admin/actions',
                'Post:/admin/actions/route',
                'Put:/admin/actions',
                'Patch:/admin/actions/sort'
            ])
        },
        component: Main,
        children: [
            {
                path: 'member-list',
                name: 'member-list',
                meta: {
                    // access: Access,
                    icon: 'md-contact',
                    title: '管理员列表',
                    notCache: true,
                    access: getAccess(['*', 'Get:/admin/members', 'Delete:/admin/members', 'Patch:/admin/members'])
                },
                component: () => import('@/view/member/member-list')
            },
            {
                path: 'member-add',
                name: 'member-add',
                meta: {
                    icon: 'md-flower',
                    title: '添加成员',
                    // access: Access,
                    hideInMenu: true,
                    access: getAccess(['*', 'Post:/admin/members']),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/member/member-add-edit')
            },
            {
                path: 'member-edit/:id',
                name: 'member-edit',
                meta: {
                    icon: 'md-flower',
                    title: '编辑成员',
                    // access: Access,
                    hideInMenu: true,
                    access: getAccess(['*', 'Get:/admin/members/{id}', 'Put:/admin/members']),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/member/member-add-edit')
            },
            {
                path: 'role-list',
                name: 'role-list',
                meta: {
                    // access: Access,
                    icon: 'md-school',
                    title: '角色列表',
                    notCache: true,
                    access: getAccess(['*', 'Get:/admin/roles', 'Post:/admin/roles', 'Delete:/admin/roles', 'Get:/admin/roles/{id:[0-9]+}', 'Put:/admin/roles'])
                },
                component: () => import('@/view/member/role-list')
            },

            {
                path: 'role-add/:id',
                name: 'role-add',
                meta: {
                    icon: 'md-flower',
                    title: '添加角色',
                    notCache: true,
                    // access: Access,
                    hideInMenu: true,
                    access: getAccess(['*', 'Post:/admin/roles']),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/member/role-add-edit')
            },
            {
                path: 'role-edit/:id',
                name: 'role-edit',
                meta: {
                    icon: 'md-flower',
                    title: '编辑角色',
                    notCache: true,
                    // access: Access,
                    hideInMenu: true,
                    access: getAccess(['*', 'Get:/admin/roles/{id:[0-9]+}', 'Put:/admin/roles']),
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/member/role-add-edit')
            },
            {
                path: 'list',
                name: 'permission-list',
                meta: {
                    // access: Access,
                    icon: 'ios-ribbon',
                    title: '权限列表',
                    notCache: true,
                    access: getAccess(['*', 'Get:/admin/actions', 'Delete:/admin/actions'])
                },
                component: () => import('@/view/permission/list')
            },
            {
                path: 'add',
                name: 'permission-add',
                meta: {
                    icon: 'md-flower',
                    title: '添加权限',
                    // access: Access,
                    hideInMenu: true,
                    beforeCloseName: 'before_close_normal',
                    access: getAccess(['*', 'Post:/admin/actions'])
                },
                component: () => import('@/view/permission/add')
            },
            {
                path: 'log',
                name: 'operation_list',
                meta: {
                    access: getAccess(['*', 'Get:/admin/operation']),
                    icon: 'ios-paper',
                    title: '日志列表',
                    notCache: true,
                },
                component: () => import('@/view/operation-log/operation-list'),
            },
        ]
    },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/404.vue')
    }
]
