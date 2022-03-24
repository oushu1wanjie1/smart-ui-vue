import {
  Action,
  ActionTag,
  ApiGetAuthList, ApiGetAuthListOfDst, ApiGetAuthListOfDstReq, ApiGetAuthListOfDstResItem,
  ApiGetAuthListReq,
  ApiGetAuthListRes, ApiGetAuthOfUserOrRole, ApiGetAuthOfUserOrRoleOfDst, ApiGetAuthOfUserOrRoleOfDstReq, ApiGetAuthOfUserOrRoleReq, ApiGetAuthOfUserOrRoleRes,
  ApiGetAuthSourceRoles, ApiGetAuthSourceRolesOfDst, ApiGetAuthSourceRolesOfDstReq, ApiSetAuth, ApiSetAuthOfDst, ApiSetAuthOfDstReq, ApiSetAuthReq,
  AuthListItem, AVATAR_NUM, RS_SCHEMA, RS_TABLE, SOURCE_INHERIT, SOURCE_SELF, SOURCE_SELF_INHERIT,
  USER,
} from './type'

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
      if (inheritAction) {
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
      }
    })
  } catch (err) {
    console.error('format action tag catch error: ', err)
  }
  return actionTags
}

export interface Strategy {
  rsType: string;
  getAuthList(userOrRole: string, name: string): Promise<AuthListItem[]>;
  getAuthOfUserOrRole(userOrRole: string, id: number): Promise<any>;
  getAuthSourceRoles(userId: number, actionFlag: string | number): Promise<any>;
  setAuth(userOrRole: string, id: number, privileges: { actionFlag: string | number, checked: boolean }[]): Promise<any>;
  formatAuthOfUserOrRole(data: ApiGetAuthOfUserOrRoleRes | ApiGetAuthListOfDstResItem[]): {
    options: { label: string, value: number }[],
    value: number[]
  };
}

export class StrategyCommon implements Strategy {
  public constructor(
    public readonly rsType: string,
    private readonly rsTypeId: number,
    private readonly objectId: number,
    private apiGetAuthList: ApiGetAuthList,
    private apiGetAuthOfUserOrRole: ApiGetAuthOfUserOrRole,
    private apiGetAuthSourceRoles: ApiGetAuthSourceRoles,
    private apiSetAuth: ApiSetAuth
  ) {
    this.rsType = rsType
    this.rsTypeId = rsTypeId
    this.objectId = objectId
    this.apiGetAuthList = apiGetAuthList
    this.apiGetAuthOfUserOrRole = apiGetAuthOfUserOrRole
    this.apiGetAuthSourceRoles = apiGetAuthSourceRoles
    this.apiSetAuth = apiSetAuth
  }

  public getAuthList(userOrRole: string, name: string) {
    const params: ApiGetAuthListReq = {
      resource_type_id: this.rsTypeId,
      object_id: this.objectId,
      user_type: userOrRole,
      user_or_role_name: name
    }
    return this.apiGetAuthList(params).then(({ meta, data }) => {
      if (meta.success) {
        return this.formatAuthList(userOrRole, data)
      } else {
        throw new Error(meta.message || meta.status_code)
      }
    })
  }

  // 获取用户或角色对某个资源的权限
  public getAuthOfUserOrRole(userOrRole: string, id: number) {
    const params: ApiGetAuthOfUserOrRoleReq = {
      resource_type_id: this.rsTypeId,
      object_id: this.objectId,
      user_type: userOrRole,
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

  // 获取权限的来源角色
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

  public setAuth(userOrRole: string, id: number, privileges: { actionFlag: string | number, checked: boolean }[]) {
    const params: ApiSetAuthReq = {
      resource_type_id: this.rsTypeId,
      object_id: this.objectId,
      user_type: userOrRole,
      user_or_role_id: id,
      privileges: privileges.map(priv => ({
        rs_type_action_id: priv.actionFlag as number,
        checked: priv.checked
      }))
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
  public formatAuthList(userOrRole: string, data: ApiGetAuthListRes): AuthListItem[] {
    const _data = data.user_or_role_privileges
    return _data.map(item => ({
      rsType: this.rsType,
      userOrRole,
      id: item.user_or_role_id,
      name: item.user_or_role_name,
      remark: item.comment,
      icon: `/images/avatar/${ Math.abs(item.user_or_role_id) % AVATAR_NUM }.svg`,
      actions: formatActionTag(item.actions, item.inherit_actions),
      isOwner: userOrRole === USER && item.is_owner
    }))
  }

  // eslint-disable-next-line class-methods-use-this
  public formatAuthOfUserOrRole(data: ApiGetAuthOfUserOrRoleRes) {
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
          const inheritAction = item.inherit_actions[index]
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

export class StrategyDb implements Strategy {
  public constructor(
    public readonly rsType: string,
    private readonly clusterId: number,
    private readonly databaseName: string,
    private readonly schemaName: string,
    private readonly tableName: string,
    private apiGetAuthListOfDst: ApiGetAuthListOfDst,
    private apiGetAuthOfUserOrRoleOfDst: ApiGetAuthOfUserOrRoleOfDst,
    private apiGetAuthSourceRolesOfDst: ApiGetAuthSourceRolesOfDst,
    private apiSetAuthOfDst: ApiSetAuthOfDst,
  ) {
    this.rsType = rsType
    this.clusterId = clusterId
    this.databaseName = databaseName
    this.schemaName = schemaName
    this.tableName = tableName
    this.apiGetAuthListOfDst = apiGetAuthListOfDst
    this.apiGetAuthOfUserOrRoleOfDst = apiGetAuthOfUserOrRoleOfDst
    this.apiGetAuthSourceRolesOfDst = apiGetAuthSourceRolesOfDst
    this.apiSetAuthOfDst = apiSetAuthOfDst
  }

  public getAuthList(userOrRole: string, name: string) {
    const params: ApiGetAuthListOfDstReq = {
      cluster_id: this.clusterId,
      user_type: userOrRole,
      database_name: this.databaseName,
      user_or_role_name: name
    }
    if (this.rsType === RS_SCHEMA) {
      params.schema_name = this.schemaName
    }
    if (this.rsType === RS_TABLE) {
      params.table_name = this.tableName
    }

    return this.apiGetAuthListOfDst(this.rsType, params).then(({ meta, data }) => {
      if (meta.success) {
        return this.formatAuthList(userOrRole, data)
      } else {
        throw new Error(meta.message || meta.status_code)
      }
    })
  }

  // 获取用户或角色对某个资源的权限
  public getAuthOfUserOrRole(userOrRole: string, id: number) {
    const params: ApiGetAuthOfUserOrRoleOfDstReq = {
      cluster_id: this.clusterId,
      user_type: userOrRole,
      user_or_role_id: id,
      database_name: this.databaseName
    }
    if (this.rsType === RS_SCHEMA) {
      params.schema_name = this.schemaName
    }
    if (this.rsType === RS_TABLE) {
      params.table_name = this.tableName
    }

    return this.apiGetAuthOfUserOrRoleOfDst(this.rsType, params).then(({ meta, data }) => {
      if (meta.success) {
        return data
      } else {
        throw new Error(meta.message || meta.status_code)
      }
    })
  }

  public getAuthSourceRoles(userId: number, actionFlag: string | number) {
    const params: ApiGetAuthSourceRolesOfDstReq = {
      clusterId: this.clusterId,
      resourceType: this.rsType,
      userId,
      databaseName: this.databaseName,
      actionName: actionFlag as string
    }
    if (this.rsType === RS_SCHEMA) {
      params.schemaName = this.schemaName
    }
    if (this.rsType === RS_TABLE) {
      params.tableName = this.tableName
    }
    return this.apiGetAuthSourceRolesOfDst(params).then(({ meta, data }) => {
      if (meta.success) {
        return data.inherit_roles
      } else {
        throw new Error(meta.message || meta.status_code)
      }
    })
  }

  public setAuth(userOrRole: string, id: number, privileges: { actionFlag: string | number, checked: boolean }[]) {
    const params: ApiSetAuthOfDstReq = {
      cluster_id: this.clusterId,
      user_or_role_type: userOrRole,
      user_or_role_id: id,
      database_name: this.databaseName,
      privileges: privileges.map(priv => ({
        action_name: priv.actionFlag as string,
        checked: priv.checked
      }))
    }
    if (this.rsType === RS_SCHEMA) {
      params.schema_name = this.schemaName
    }
    if (this.rsType === RS_TABLE) {
      params.table_name = this.tableName
    }

    return this.apiSetAuthOfDst(this.rsType, params).then(({ meta, data }) => {
      if (meta.success) {
        return data
      } else {
        throw new Error(meta.message || meta.status_code)
      }
    })
  }

  // eslint-disable-next-line class-methods-use-this
  public formatAuthList(userOrRole: string, data: ApiGetAuthListOfDstResItem[]): AuthListItem[] {
    return data.map(item => ({
      rsType: this.rsType,
      userOrRole,
      id: item.user_or_role_id,
      name: item.user_or_role_name,
      remark: item.comment,
      icon: `/images/avatar/${ Math.abs(item.user_or_role_id) % AVATAR_NUM }.svg`,
      actions: formatActionTag(item.actions, item.inherit_actions),
      isOwner: userOrRole === USER && item.is_owner
    }))
  }

  // eslint-disable-next-line class-methods-use-this
  public formatAuthOfUserOrRole(data: ApiGetAuthListOfDstResItem[]) {
    const result = {
      options: [] as { label: string, value: number }[],
      value: [] as number[]
    }
    try {
      const item = data[0]
      item.actions.forEach((action, index) => {
        result.options.push({
          label: action.action_name,
          value: action.rs_type_action_id
        })
        const inheritAction = item.inherit_actions[index]
        if (action.checked || (inheritAction && inheritAction.checked)) {
          result.value.push(action.rs_type_action_id)
        }
      })
    } catch (err) {
      console.error('format auth of user or role catch error: ', err)
    }
    return result
  }
}
