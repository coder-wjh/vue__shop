import {request} from '../request'

export function getReport() {
  return request({
    url:'/reports/type/1',
        method:'GET',
        params:{
        }
  })
}