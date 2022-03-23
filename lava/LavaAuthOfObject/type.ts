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
  // db 相关的资源没有 ID，那就用它们的名称做 ID
  // 同一父级下应该不会有同名的吧
  id: string | number;
  name: string;
  type: string;
  roles: Role[];
}

export interface AuthListItem {
  id: number;
  name: string;
  type: string;
  remark?: string;
  icon?: string;
  actions: ActionTag[];
  isOwner?: boolean;
  roleType?: number; // 0: 系统角色，1：自定义角色
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

export interface UserOrRoleSelectorOption {
  label: string;
  value: number;
  type: string;
  remark: string;
}

// 通用资源
export interface Action {
  rs_type_action_id: number;
  action_name: string;
  checked: boolean;
}

export interface UserListItem {
  id: number;
  name: string;
  name_remark: string;
  user_type: number;
}

export interface RoleListItem {
  id: number;
  name: string;
  description: string;
}

// 通用接口定义

export interface ApiGetUserList {
  (): Promise<Response<UserListItem[]>>
}

export interface ApiGetRoleList {
  (): Promise<Response<RoleListItem[]>>
}

// common 资源专属的接口定义

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
    inherit_actions: Action[];
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
    inherit_actions: Action[];
  }[];
}

export interface ApiGetAuthOfUserOrRole {
  (params: ApiGetAuthOfUserOrRoleReq): Promise<Response<ApiGetAuthOfUserOrRoleRes>>;
}

export interface ApiGetAuthSourceRolesReq {
  user_id: number;
  object_id: number;
  rs_type_action_id: number;
}

export interface ApiGetAuthSourceRoles {
  (params: ApiGetAuthSourceRolesReq): Promise<Response<{ id: number, name: string, description: string }[]>>;
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

export interface ApiSetAuth {
  (params: ApiSetAuthReq): Promise<Response<void>>;
}

// database、schema、table 资源专属的接口定义
