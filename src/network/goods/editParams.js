import {request} from '../request'

export function editParams(id,attrId,attr_name,attr_sel,attr_vals) {
  return request({
    url:'/categories/'+id+'/attributes/'+attrId,
    method:'put',
    data:{
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}