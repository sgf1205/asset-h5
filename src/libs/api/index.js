
import axios from 'axios'
import router from '@/router'

import { MessageBox } from 'element-ui'

let apiHost = process.env.NODE_ENV == 'development' ? "http://localhost:8081" : "";

//请求目标地址
const Ajax = axios.create({
  baseURL: apiHost + '/api',
  timeout: 5000,
  params: {},
  data: {},
  withCredentials: true,
  transformRequest: [function (data) {
    // Do whatever you want to transform the data
    let ret = '';
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + ((data[it] != null && data[it] != undefined) ? encodeURIComponent(data[it]) : '') + '&'
    }
    return ret
  }],
});
// 超时时间
Ajax.defaults.timeout = 80000;
// http请求拦截器

Ajax.interceptors.request.use(config => {

  config.headers = {
    'token': sessionStorage.token,
    'Content-Type':'application/x-www-form-urlencoded'
  }
  return config
}, error => {
  return Promise.reject(error)
})
// http响应拦截器
Ajax.interceptors.response.use(response => {

  if (response.status == 200) {
    return response.data;
  }
  return response;
}, error => {
  if(error.response.status==401){
    router.push({ path: "/" });
  }
  return Promise.reject(error)
})


/**
 * @function api 统一请求接口封装类， web端和ide端通用
 * @example
 *  import api from '@/utils/api/'
 *
 *  api.get(url).then((response)=>{
 *      console.log(response);
 *  }).catch((err)=>{
 *      throw new Error('请求报错');
 *  });
 *
 */
export default {
  /**
   * 获取表单全部数据
   *
   */
  get(...params) {
    return Ajax.get(params[0], { params: params[1] });
  },
  /**
   * 测试POST请求
   *
   * @param {any} json
   */
  post(...params) {
    return Ajax.post(params[0], params[1]);
  },
  download(...params) {
    return Ajax.post(params[0], params[1],{responseType:'blob'});
  },
  getV1(...params) {
    return Ajax.get('/v1' + params[0], { params: params[1] });
  },
  postV1(...params) {
    return Ajax.post('/v1' + params[0], params[1]);
  },
  /**
   * 所有接口完成回调
   * @example
   * api.getAll(api.getDesigner(),api.getSqlTable(),api.getUsers())
   * .then((res)=>{
   *    res[0]		getDesigner的响应信息
   *    res[1]		getSqlTable的响应信息
   *    res[2]		getUsers   的响应信息
   * })
   *
   */
  getAll(...params) {
    return axios.all(params);
  }
}
