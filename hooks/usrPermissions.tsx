import {
  hasModuleVisibility,
  hasPermission,
  PermissionAction,
  ModulePermission,
} from "../utilz/permissions";

export const usePermission = () => {

  const loginData = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const permissions: ModulePermission[] =
    loginData?.permissions || [];

  const canView = (module: string) => {
    return hasModuleVisibility(
      permissions,
      module
    );
  };

  const can = (
    module: string,
    action: PermissionAction
  ) => {
    return hasPermission(
      permissions,
      module,
      action
    );
  };

  return {
    permissions,
    canView,
    can,
  };
};