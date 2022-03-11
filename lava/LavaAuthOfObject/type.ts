export const USER = 'user'
export const ROLE = 'role'

export const SOURCE_SELF = 'self'
export const SOURCE_INHERIT = 'inherit'
export const SOURCE_SELF_INHERIT = 'self_inherit'

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
  id: string | number;
  name: string;
  type: string;
  remark?: string;
  avatar?: string;
  actions: [];
}
