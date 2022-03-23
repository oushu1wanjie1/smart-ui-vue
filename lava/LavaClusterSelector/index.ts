export interface ClusterInfo{
  id: number,
  image?: string,
  name: string,
  product: string,
  status: ClusterStatus,
  version: Version
}

const ICON_PATH_PREFIX = 'ui-cluster-selector'

export enum ClusterStatus {
  Starting = 'Starting',
  Running = 'Running',
  Stopping = 'Stopping',
  Stopped = 'Stopped',
  Terminating = 'Terminating',
  WaitingToStart = 'WaitingToStart',
  Idle = 'Idle'
}

export enum Version {
  Standard = 'standard',
  Enterprise = 'enterprise'
}

export interface StatusMapItem {
  description: string,
  loadingStatus: boolean,
  iconName: string,
  style: {
    color: string,
  },
}

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export const COMMON_STATUS_MAP: PartialRecord<ClusterStatus, StatusMapItem> = {
  [ClusterStatus.Starting]: {
    description: '启动中',
    loadingStatus: true,
    iconName: `${ICON_PATH_PREFIX}/starting`,
    style: {
      color: '#C2D744',
    },
  },
  [ClusterStatus.Running]: {
    description: '运行中',
    loadingStatus: false,
    iconName: `${ICON_PATH_PREFIX}/running`,
    style: {
      color: '#4BCAAD',
    },
  },
  [ClusterStatus.Stopping]: {
    description: '停止中',
    loadingStatus: true,
    iconName: `${ICON_PATH_PREFIX}/stopping`,
    style: {
      color: '#CCA236',
    },
  },
  [ClusterStatus.Stopped]: {
    description: '停止',
    loadingStatus: false,
    iconName: `${ICON_PATH_PREFIX}/stopped`,
    style: {
      color: '#D74472',
    },
  },
}

export const MASTER_STATUS_MAP: PartialRecord<ClusterStatus, StatusMapItem> = {
  ...COMMON_STATUS_MAP,
  [ClusterStatus.Terminating]: {
    description: '删除中',
    loadingStatus: true,
    iconName: `${ICON_PATH_PREFIX}/stopped`,
    style: {
      color: '#D74472'
    },
  },
}

export const VC_STATUS_MAP: PartialRecord<ClusterStatus, StatusMapItem> = {
  [ClusterStatus.WaitingToStart]: {
    description: '待启动',
    loadingStatus: false,
    iconName: `${ICON_PATH_PREFIX}/creating`,
    style: {
      color: '#336CFF',
    },
  },
  ...COMMON_STATUS_MAP,
  [ClusterStatus.Idle]: {
    description: '闲置',
    loadingStatus: false,
    iconName: `${ICON_PATH_PREFIX}/creating`,
    style: {
      color: '#336CFF',
    },
  },
}