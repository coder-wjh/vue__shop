import {request} from '../request'

export function addParams(id,attr_name,attr_sel,attr_vals) {
  return request({
    url:'/categories/'+id+'/attributes',
    method:'post',
    data:{
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}