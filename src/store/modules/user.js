import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'
import { getRegionTree } from "@/api/common";
import cache from "@/plugins/cache";
const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      refreshToken: getRefreshToken(),
      id: '',
      name: '',
      avatar: '',
      roles: [],
      permissions: []
    }),
    actions: {
      // 登录
      login(data) {
        return new Promise((resolve, reject) => {
          login(data).then(res => {
            setToken(res.data.token)
            setRefreshToken(res.data.refreshToken)
            this.token = res.data.token
            this.refreshToken = res.data.refreshToken
            // 获取省市区列表存储到本地
            getRegionTree().then((res) => {
              cache.local.setJSON("region-tree-data", res.data);
            });
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            let resData = {
              "msg": "操作成功",
              "code": 200,
              "permissions": [
                "*:*:*"
              ],
              "roles": [
                "admin"
              ],
              "user": {
                "userId": res.data.id,
                "userName": res.data.loginName,
              }
            }
            const user = resData.user
            const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
            if (resData.roles && resData.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = resData.roles
              this.permissions = resData.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.id = user.userId
            this.name = user.userName
            this.avatar = avatar
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          this.token = ''
          this.refreshToken = ''
          this.roles = []
          this.permissions = []
          removeToken()
          removeRefreshToken()
          resolve()
        })
      }
    }
  })

export default useUserStore
