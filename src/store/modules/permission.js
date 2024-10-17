import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore(
  'permission',
  {
    state: () => ({
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRouters: [],
      sidebarRouters: []
    }),
    actions: {
      setRoutes(routes) {
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      setDefaultRoutes(routes) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      setTopbarRoutes(routes) {
        this.topbarRouters = routes
      },
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      generateRoutes(roles) {
        // 动态获取路由地址
        return new Promise(resolve => {
          let res = {
            "data": [
              {
                "name": "System",
                "path": "/system",
                "hidden": false,
                "redirect": "noRedirect",
                "component": "Layout",
                "alwaysShow": true,
                "meta": {
                  "title": "组织管理",
                  "icon": "system",
                  "noCache": false,
                  "link": null
                },
                "children": [
                  {
                    "name": "DealerOrg",
                    "path": "dealerOrg",
                    "hidden": false,
                    "component": "system/dealerOrg/index",
                    "meta": {
                      "title": "组织结构",
                      "icon": "",
                      "noCache": false,
                      "link": null
                    }
                  },
                  // {
                  //   "name": "FactoryOrg",
                  //   "path": "factoryOrg",
                  //   "hidden": false,
                  //   "component": "system/factoryOrg/index",
                  //   "meta": {
                  //     "title": "工厂组织结构",
                  //     "icon": "",
                  //     "noCache": false,
                  //     "link": null
                  //   }
                  // },
                  {
                    "name": "Dict",
                    "path": "dict",
                    "hidden": false,
                    "component": "system/dict/index",
                    "meta": {
                      "title": "字典管理",
                      "icon": "",
                      "noCache": false,
                      "link": null
                    },
                  }
                ]
              },
              {
                "name": "Finance",
                "path": "/finance",
                "hidden": false,
                "redirect": "noRedirect",
                "component": "Layout",
                "alwaysShow": true,
                "meta": {
                  "title": "财务管理",
                  "icon": "money",
                  "noCache": false,
                  "link": null
                },
                "children": [
                  {
                    "name": "RetailFinance",
                    "path": "retailFinance",
                    "hidden": false,
                    "component": "system/financeManage/index",
                    "meta": {
                      "title": "零售财务",
                      "icon": "",
                      "noCache": false,
                      "link": null
                    }
                  },
                  {
                    "name": "ProjectFinance",
                    "path": "projectFinance",
                    "hidden": false,
                    "component": "system/financeManage/index",
                    "meta": {
                      "title": "工程财务",
                      "icon": "",
                      "noCache": false,
                      "link": null
                    }
                  },
                  {
                    "name": "BankView",
                    "path": "bankView",
                    "hidden": false,
                    "component": "system/audit/bankView/index",
                    "meta": {
                      "title": "银行视图审批",
                      "icon": "",
                      "noCache": false,
                      "link": null
                    }
                  },
                  {
                    "name": "CutSet",
                    "path": "cutSet",
                    "hidden": false,
                    "component": "ParentView",
                    "alwaysShow": true,
                    "meta": {
                      "title": "扣款设置",
                      "icon": "",
                      "noCache": false,
                      "link": null
                    },
                    "children": [
                      {
                        "name": "FundProportion",
                        "path": "fundProportion",
                        "hidden": false,
                        "component": "system/fundProportion/index",
                        "meta": {
                          "title": "资金池扣款比例",
                          "icon": "",
                          "noCache": false,
                          "link": null
                        }
                      },
                    ]
                  },
                ]
              },
            ]
          }
          // 向后端请求路由数据
          // getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const defaultData = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const defaultRoutes = filterAsyncRouter(defaultData)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          asyncRoutes.forEach(route => { router.addRoute(route) })
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
          // })
        })
      }
    }
  })

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
      if (el.children && el.children.length) {
        children = children.concat(filterChildren(el.children, el))
        return
      }
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
}

export default usePermissionStore
