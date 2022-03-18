import {
  Action,
  ActionTag,
  ApiGetAuthList,
  ApiGetAuthListReq,
  ApiGetAuthListRes, ApiGetAuthOfUserOrRole, ApiGetAuthOfUserOrRoleReq, ApiGetAuthOfUserOrRoleRes,
  ApiGetAuthSourceRoles, ApiSetAuth, ApiSetAuthReq,
  AuthListItem, Role, SOURCE_INHERIT, SOURCE_SELF, SOURCE_SELF_INHERIT,
  USER,
} from './type'

const AVATAR_NUM = 6
export const RS_DATABASE = 'database'
export const RS_SCHEMA = 'schema'
export const RS_TABLE = 'table'
export const RS_COMMON = 'common'

const formatActionTag = (actions: Action[], inheritActions: Action[]): ActionTag[] => {
  // if (!actions) return []
  const actionTags: ActionTag[] = []
  try {
    actions.forEach((action, index) => {
      const _action = {
        type: SOURCE_SELF,
        id: action.rs_type_action_id,
        name: action.action_name,
        roles: []
      }
      // if (!inheritActions) {
      //   if (action.checked) {
      //     _action.type = SOURCE_SELF
      //   }
      // } else {
      //   const inheritAction = inheritActions.find(act => act.rs_type_action_id === action.rs_type_action_id)
      //   if (inheritAction) {
      //     if (action.checked) {
      //       if (inheritAction.checked) {
      //         _action.type = SOURCE_SELF_INHERIT
      //       } else {
      //         _action.type = SOURCE_SELF
      //       }
      //     } else {
      //       if (inheritAction.checked) {
      //         _action.type = SOURCE_INHERIT
      //       }
      //     }
      //   } else {
      //     if (action.checked) {
      //       _action.type = SOURCE_SELF
      //     }
      //   }
      // }
      const inheritAction = inheritActions[index]
      if (action.checked) {
        if (inheritAction.checked) {
          _action.type = SOURCE_SELF_INHERIT
        } else {
          _action.type = SOURCE_SELF
        }
      } else {
        if (inheritAction.checked) {
          _action.type = SOURCE_INHERIT
        }
      }
      actionTags.push(_action)
    })
  } catch (err) {
    console.error('format action tag catch error: ', err)
  }
  return actionTags
}

export interface StrategyOptions {
  type: string;
  rsTypeId: number;
  objectId?: number;
  apiGetAuthList?: ApiGetAuthList;
  apiGetAuthOfUserOrRole?: ApiGetAuthOfUserOrRole;
  apiGetAuthSourceRoles?: ApiGetAuthSourceRoles;
  apiSetAuth?: ApiSetAuth;
}

export function selectStrategy(options: StrategyOptions) {
  let strategy = null
  if (options.type === '') {
    //
  } else {
    strategy = new StrategyCommon(
      options.rsTypeId,
      options.objectId!,
      options.apiGetAuthList!,
      options.apiGetAuthSourceRoles!,
      options.apiGetAuthOfUserOrRole!,
      options.apiSetAuth!
    )
  }
  return strategy
}

export class StrategyCommon {
  private readonly rsTypeId: number
  private readonly objectId: number
  private apiGetAuthList: ApiGetAuthList
  private apiGetAuthSourceRoles: ApiGetAuthSourceRoles
  private apiGetAuthOfUserOrRole: ApiGetAuthOfUserOrRole
  private apiSetAuth: ApiSetAuth

  public constructor(
    rsTypeId: number,
    objectId: number,
    apiGetAuthList: ApiGetAuthList,
    apiGetAuthSourceRoles: ApiGetAuthSourceRoles,
    apiGetAuthOfUserOrRole: ApiGetAuthOfUserOrRole,
    apiSetAuth: ApiSetAuth
  ) {
    this.rsTypeId = rsTypeId
    this.objectId = objectId
    this.apiGetAuthList = apiGetAuthList
    this.apiGetAuthSourceRoles = apiGetAuthSourceRoles
    this.apiGetAuthOfUserOrRole = apiGetAuthOfUserOrRole
    this.apiSetAuth = apiSetAuth
  }

  public getAuthList(type: string, name: string) {
    const params: ApiGetAuthListReq = {
      resource_type_id: this.rsTypeId,
      object_id: this.objectId,
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

  public getAuthSourceRoles(userId: number, actionFlag: string | number) {
    const params = { user_id: userId, object_id: this.objectId, rs_type_action_id: actionFlag as number }
    return this.apiGetAuthSourceRoles(params).then(({ meta, data }) => {
      if (meta.success) {
        return data
      } else {
        throw new Error(meta.message || meta.status_code)
      }
    })
  }

  public getAuthOfUserOrRole(type: string, id: number) {
    const params: ApiGetAuthOfUserOrRoleReq = {
      resource_type_id: this.rsTypeId,
      object_id: this.objectId,
      user_type: type,
      user_or_role_id: id
    }
    return this.apiGetAuthOfUserOrRole(params).then(({ meta, data }) => {
      if (meta.success) {
        return data
      } else {
        throw new Error(meta.message || meta.status_code)
      }
    })
  }

  public setAuth(type: string, id: number, privileges: { rs_type_action_id: number, checked: boolean }[]) {
    const params: ApiSetAuthReq = {
      resource_type_id: this.rsTypeId,
      object_id: this.objectId,
      user_type: type,
      user_or_role_id: id,
      privileges
    }
    return this.apiSetAuth(params).then(({ meta, data }) => {
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
      actions: formatActionTag(item.actions, item.inherit_actions),
      isOwner: type === USER && item.is_owner
    }))
  }

  // eslint-disable-next-line class-methods-use-this
  public formatAuthOfUserOrRole(data: ApiGetAuthOfUserOrRoleRes, type: string) {
    const _data = data.user_or_role_privileges
    const result = {
      options: [] as { label: string, value: number }[],
      value: [] as number[]
    }
    try {
      if (_data.length > 0) {
        const item = _data[0]
        item.actions.forEach((action, index) => {
          result.options.push({
            label: action.action_name,
            value: action.rs_type_action_id
          })
          const inheritAction = item.inheritActions[index]
          if (action.checked || (inheritAction && inheritAction.checked)) {
            result.value.push(action.rs_type_action_id)
          }
        })
      }
    } catch (err) {
      console.error('format auth of user or role catch error: ', err)
    }
    return result
  }
}

export type Strategy = StrategyCommon
