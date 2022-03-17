import { Action, ActionTag, ApiGetAuthList, ApiGetAuthListReq, ApiGetAuthListRes, AuthListItem, USER } from '@/smart-ui-vue/lava/LavaAuthOfObject/type'

const AVATAR_NUM = 6
export const RS_DATABASE = 'database'
export const RS_SCHEMA = 'schema'
export const RS_TABLE = 'table'
export const RS_COMMON = 'common'

const formatActionTag = (actions: Action[], type: string): ActionTag[] => {
  return actions.map(act => ({
    type,
    id: act.rs_type_action_id,
    name: act.action_name,
    roles: []
  }))
}

export function selectStrategy(
  type: string,
  apiGetAuthList: ApiGetAuthList
) {
  let strategy = null
  if (type === '') {
    //
  } else {
    strategy = new StrategyCommon(apiGetAuthList)
  }
  return strategy
}

export class StrategyCommon {
  private apiGetAuthList: ApiGetAuthList

  public constructor(apiGetAuthList: ApiGetAuthList) {
    this.apiGetAuthList = apiGetAuthList
  }

  public getAuthList(type: string, name: string) {
    const params: ApiGetAuthListReq = {
      resource_type_id: 0,
      object_id: 0,
      user_type: type,
      user_or_role_name: name
    }
    return this.apiGetAuthList(params).then(({ meta, data }) => {
      if (meta.success) {
        return data
      } else {
        throw new Error(meta.message || meta.status_code)
      }
    })
  }

  // eslint-disable-next-line class-methods-use-this
  public formatAuthList(data: ApiGetAuthListRes, type: string): AuthListItem[] {
    const _data = data.user_or_role_privileges
    return _data.map(item => ({
      type,
      id: item.user_or_role_id,
      name: item.user_or_role_name,
      remark: item.comment,
      icon: `/images/avatar/${ Math.abs(item.user_or_role_id) % AVATAR_NUM }.svg`,
      actions: formatActionTag(item.actions, type),
      isOwner: type === USER && item.is_owner
    }))
  }
}