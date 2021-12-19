export enum Topics {
  AjaxStart = 'AJAX_START',
  AjaxStop = 'AJAX_STOP',
  ToastEvent = 'TOAST_EVENT',
  MultiToastEvent = 'MULTI_TOAST_EVENT',
  UserLogout = 'USER_LOGOUT',
  GoToUserSettings = 'USER_PROFILE',
  UpdateBreadcrumb = 'UPDATE_BREADCRUMB',
  WorkbookViewChanged = 'WORKBOOK_VIEW_CHANGED',
  WorkbookPropertyChanged = 'WORKBOOK_PROPERTY_CHANGED',
  RefreshRowLog = 'REFRESH_ROW_LOG',
  CloseDropdown = 'CLOSE_DROP_DOWN',
  CloseDropdownExceptSelf = 'CLOSE_DROP_DOWN_EXCEPT_SELF',
  ClosePropertyDropdown = 'CLOSE_PROPERTY_DROPDOWN',
  HideLeftPanel = 'HIDE_LEFT_PANEL',
  GoTo404Page = 'GO_TO_404_PAGE'
}

export enum HotKeysTopics {
  Save = 'HotKey_Save',
  Delete = 'HotKey_Delete',
  OpenAsPage = 'HotKey_OpenAsPage'
}

export enum ToastSeverity {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warn = 'warn',
}

export enum ResponseStatus {
  Error = 0,
  Success = 1,
  Info = 2,
  Warn = 3,
}

export enum HeaderColumnType {
  None,
  ShowRemoveIcon,
  ShowAddAndRemoveIcon,
}
