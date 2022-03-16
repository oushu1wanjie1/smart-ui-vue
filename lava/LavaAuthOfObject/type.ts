export const RS_DB = 'rs_db'
export const RS_COMMON = 'rs_common'

export const USER = 'user'
export const ROLE = 'role'

export const ADD = 'add'
export const EDIT = 'edit'

export const SOURCE_SELF = 'self'
export const SOURCE_INHERIT = 'inherit'
export const SOURCE_SELF_INHERIT = 'self_inherit'

export interface Meta {
  success: boolean;
  message: string;
  status_code: string;
  params: any;
}

export interface Response<T> {
  meta: Meta;
  data: T;
}

export interface Role {
  id: number;
  name: string;
}

export interface ActionTag {
  id: string | number;
  name: string;
  type: string;
  roles: Role[];
}

export interface AuthListItem {
  id?: string | number;
  name: string;
  type: string;
  remark?: string;
  icon?: string;
  actions: ActionTag[];
  isOwner?: boolean;
}

// API 规范定义（函数、返回值）
export interface ApiAuthAction {
  rs_type_action_id: number;
  action_name: string;
  checked: boolean;
}

export interface ApiAuthListItem {
  user_or_role_id?: number;
  name: string;
  remark?: string;
  actions: ApiAuthAction[];
  inherit_actions: ApiAuthAction[];
  is_owner?: boolean;
}

// 通用资源
export interface Action {
  rs_type_action_id: number;
  action_name: string;
  checked: boolean;
}

export interface ApiGetAuthListReq {
  resource_type_id: number;
  object_id: number;
  user_type: string;
  user_or_role_name?: string;
}

export interface ApiGetAuthListRes {
  user_or_role_privileges: {
    user_or_role_id: number;
    user_or_role_name: string;
    comment: string;
    is_owner: boolean;
    role_type: number; // 角色类型, 0:系统角色 1:自定义角色
    actions: Action[];
    inheritActions: Action[];
  }[];
}

export interface ApiGetAuthList {
  (params: ApiGetAuthListReq): Promise<Response<ApiGetAuthListRes>>;
}

export interface ApiGetAuthOfUserOrRoleReq {
  user_type: string;
  user_or_role_id: number;
  resource_type_id: number;
  object_id: number;
}

export interface ApiGetAuthOfUserOrRoleRes {
  user_or_role_privileges: {
    user_or_role_id: number;
    user_or_role_name: string;
    is_owner: boolean;
    actions: Action[];
    inheritActions: Action[];
  }[];
}

export interface ApiGetAuthOfUserOrRole {
  (params: ApiGetAuthOfUserOrRoleReq): Promise<Response<ApiGetAuthOfUserOrRoleRes>>;
}

export interface ApiSetAuthReq {
  resource_type_id: number;
  object_id: number;
  user_type: string;
  user_or_role_id: number;
  privileges: {
    rs_type_action_id: number;
    checked: boolean;
  }[];
}
