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
        path: '/member',
        name: 'member',
        meta: {
            icon: 'md-contacts',
            title: '成员管理',
            notCache: true,
            // access: Access
            access: getAccess(['*', 'Get:/admin/members', 'Post:/admin/members', 'Delete:/admin/members', 'Get:/admin/members/{id}', 'Put:/admin/members', 'Patch:/admin/members'])
        },
        component: Main,
        children: [
            {
                path: 'member-list',
                name: 'member-list',
                meta: {
                    // access: Access,
                    icon: 'md-contact',
                    title: '成员列表',
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
        ]
    },
    {
        path: '/block',
        name: 'block',
        meta: {
            icon: 'logo-buffer',
            title: '区块管理',
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
                    title: route => `${route.params.id >= 0 ? '编辑区块' : '添加区块'}`,
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
                    icon: 'md-albums',
                    title: '区块列表',
                    notCache: true,
                },
                component: () => import('@/view/block/block-list'),
            },
            {
                path: 'list/:id',
                name: 'block_detail_list',
                meta: {
                    icon: 'md-flower',
                    title: route => `区块内容管理`,
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
                    title: route => `${route.query.itemId  ? '编辑区块内容' : '添加区块内容'}`,
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
        path: '/permission',
        name: 'permission',
        meta: {
            icon: 'ios-medal',
            title: '权限管理',
            notCache: true,
            // access: Access
            access: getAccess(['*', 'Get:/admin/actions', 'Post:/admin/actions', 'Delete:/admin/actions', 'Post:/admin/actions/route', 'Put:/admin/actions', 'Patch:/admin/actions/sort'])
        },
        component: Main,
        children: [
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
        ]
    },
    {
        path: '/operation',
        name: 'operation',
        meta: {
            icon: 'ios-paper',
            title: '日志管理',
            notCache: true,
            access: getAccess(['*', 'Get:/admin/operation']),
        },
        component: Main,
        children: [
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
