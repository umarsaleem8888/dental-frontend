export type PermissionAction =
  | "read"
  | "create"
  | "update"
  | "delete";

export interface ModulePermission {
  module: string;
  visibility: boolean;

  permissions: {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}


// Check module visibility
export const hasModuleVisibility = (
  permissions: ModulePermission[],
  module: string
): boolean => {
  const modulePermission = permissions.find(
    (item) => item.module === module
  );

  return modulePermission?.visibility === true;
};


// Check specific action permission
export const hasPermission = (
  permissions: ModulePermission[],
  module: string,
  action: PermissionAction
): boolean => {
  const modulePermission = permissions.find(
    (item) => item.module === module
  );

  if (!modulePermission) {
    return false;
  }

  // Module itself must be visible
  if (!modulePermission.visibility) {
    return false;
  }

  return modulePermission.permissions?.[action] === true;
};