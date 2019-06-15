import {login, logout, getUserInfo} from '@/api/user'
import {setToken, delToken, setLocalStorage, delLocalStorage} from '@/libs/util'

export default {
    state: {
        userName: '',
        userId: '',
        avatorImgPath: '',
        token: '',
        access: '',
        hasGetInfo: false
    },
    mutations: {
        setAvator(state, avatorPath) {
            state.avatorImgPath = avatorPath;
            setLocalStorage('avator', avatorPath);
        },
        setUserId(state, id) {
            state.userId = id;
            setLocalStorage('id', id);
        },
        setUserName(state, name) {
            state.userName = name;
            setLocalStorage('name', name);
        },
        setAccess(state, access) {
            state.access = access;
            setLocalStorage('access', access);
        },
        setToken(state, token) {
            state.token = token
            setToken(token)
        },
        setHasGetInfo(state, status) {
            state.hasGetInfo = status
        }
    },
    actions: {
        // 登录
        handleLogin({commit}, {email, password}) {
            return new Promise((resolve, reject) => {
                login({
                    email,
                    password
                }).then(res => {
                    const data = res.data.data;
                    if (res.data.errorCode === 0) {
                        commit('setToken', `${data.meta.tokenType} ${data.meta.accessToken}`);
                        commit('setAvator', 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png');
                        commit('setUserName', data.userInfo.name);
                        commit('setUserId', data.userInfo.id);
                        commit('setAccess', data.access);
                        commit('setHasGetInfo', true);
                    }
                    resolve(res);
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 退出登录
        handleLogOut({state, commit}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('setToken', '');
                    commit('setAccess', []);
                    commit('setAvator', '');
                    commit('setUserName', '');
                    commit('setUserId', 0);
                    commit('setHasGetInfo', false);
                    delLocalStorage('id');
                    delLocalStorage('name');
                    delLocalStorage('avator');
                    delLocalStorage('access');
                    delToken();
                    resolve()
                }).catch(err => {
                    commit('setToken', '');
                    commit('setAccess', []);
                    commit('setAvator', '');
                    commit('setUserName', '');
                    commit('setUserId', 0);
                    commit('setHasGetInfo', false);
                    delLocalStorage('id');
                    delLocalStorage('name');
                    delLocalStorage('avator');
                    delLocalStorage('access');
                    delToken();
                    reject(err)
                })
            })
        }

    }
}
