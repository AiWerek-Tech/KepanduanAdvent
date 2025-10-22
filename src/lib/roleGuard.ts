import { JWTPayload } from './auth'

// Permission types
export type Permission = 
  | 'dashboard:view'
  | 'club:manage'
  | 'club:view'
  | 'members:manage'
  | 'members:view'
  | 'members:guide'
  | 'activities:manage'
  | 'activities:view'
  | 'certificates:issue'
  | 'certificates:view'
  | 'certificates:revoke'
  | 'materials:manage'
  | 'materials:view'
  | 'progress:track'
  | 'progress:view'
  | 'progress:validate'
  | 'reflections:view'
  | 'reflections:manage'
  | 'spiritual:manage'
  | 'dues:manage'
  | 'reports:view'
  | 'system:admin'

// Role-based permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [
    'dashboard:view',
    'club:manage',
    'club:view',
    'members:manage',
    'members:view',
    'members:guide',
    'activities:manage',
    'activities:view',
    'certificates:issue',
    'certificates:view',
    'certificates:revoke',
    'materials:manage',
    'materials:view',
    'progress:track',
    'progress:view',
    'progress:validate',
    'reflections:view',
    'reflections:manage',
    'spiritual:manage',
    'dues:manage',
    'reports:view',
    'system:admin'
  ],
  MASTER_GUIDE: [
    'dashboard:view',
    'club:manage',
    'club:view',
    'members:manage',
    'members:view',
    'members:guide',
    'activities:manage',
    'activities:view',
    'certificates:issue',
    'certificates:view',
    'materials:manage',
    'materials:view',
    'progress:track',
    'progress:view',
    'progress:validate',
    'reflections:view',
    'reflections:manage',
    'spiritual:manage',
    'reports:view'
  ],
  CMG: [
    'dashboard:view',
    'club:view',
    'members:view',
    'activities:view',
    'certificates:view',
    'materials:view',
    'progress:track',
    'progress:view',
    'reflections:view'
  ],
  PATHFINDER: [
    'dashboard:view',
    'club:view',
    'materials:view',
    'progress:track',
    'progress:view',
    'reflections:view'
  ],
  ADVENTURER: [
    'dashboard:view',
    'club:view',
    'materials:view',
    'progress:track',
    'progress:view',
    'reflections:view'
  ],
  CONTRIBUTOR: [
    'dashboard:view',
    'materials:manage',
    'materials:view',
    'progress:view'
  ]
}

// Position-based permissions (for club management)
export const POSITION_PERMISSIONS: Record<string, Permission[]> = {
  DIRECTOR: [
    'club:manage',
    'members:manage',
    'members:guide',
    'activities:manage',
    'certificates:issue',
    'certificates:revoke',
    'reports:view'
  ],
  VICE_DIRECTOR: [
    'members:view',
    'members:guide',
    'activities:manage',
    'certificates:view'
  ],
  SECRETARY: [
    'members:view',
    'activities:view',
    'reports:view'
  ],
  TREASURER: [
    'members:view',
    'dues:manage'
  ],
  CHAPLAIN: [
    'members:view',
    'spiritual:manage'
  ],
  INSTRUCTOR: [
    'materials:manage',
    'progress:validate',
    'members:guide'
  ],
  MENTOR: [
    'progress:view',
    'reflections:view',
    'members:guide'
  ],
  STAFF: [
    'members:view',
    'activities:view'
  ],
  MEMBER: [
    'dashboard:view',
    'materials:view',
    'progress:track'
  ]
}

export class RoleGuard {
  private user: JWTPayload | null
  private userPosition: string | null

  constructor(user: JWTPayload | null, userPosition: string | null = null) {
    this.user = user
    this.userPosition = userPosition
  }

  // Check if user has specific permission
  hasPermission(permission: Permission): boolean {
    if (!this.user) return false

    const rolePermissions = ROLE_PERMISSIONS[this.user.role] || []
    const positionPermissions = this.userPosition 
      ? POSITION_PERMISSIONS[this.userPosition] || []
      : []

    return [...rolePermissions, ...positionPermissions].includes(permission)
  }

  // Check if user has any of the specified permissions
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission))
  }

  // Check if user has all of the specified permissions
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission))
  }

  // Check if user can access club management
  canManageClub(): boolean {
    return this.hasPermission('club:manage')
  }

  // Check if user can manage members
  canManageMembers(): boolean {
    return this.hasPermission('members:manage')
  }

  // Check if user can view members
  canViewMembers(): boolean {
    return this.hasPermission('members:view')
  }

  // Check if user can issue certificates
  canIssueCertificates(): boolean {
    return this.hasPermission('certificates:issue')
  }

  // Check if user can manage activities
  canManageActivities(): boolean {
    return this.hasPermission('activities:manage')
  }

  // Check if user can validate progress
  canValidateProgress(): boolean {
    return this.hasPermission('progress:validate')
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.user?.role === 'ADMIN'
  }

  // Check if user is Master Guide or above
  isMasterGuideOrAbove(): boolean {
    return ['ADMIN', 'MASTER_GUIDE'].includes(this.user?.role || '')
  }

  // Check if user is club staff (Director, Secretary, etc.)
  isClubStaff(): boolean {
    if (!this.userPosition) return false
    return ['DIRECTOR', 'VICE_DIRECTOR', 'SECRETARY', 'TREASURER', 'CHAPLAIN'].includes(this.userPosition)
  }

  // Get accessible menu items based on permissions
  getAccessibleMenuItems() {
    const menuItems = []

    if (this.hasPermission('dashboard:view')) {
      menuItems.push({ key: 'dashboard', label: 'Dashboard', href: '/new-dashboard' })
    }

    if (this.hasPermission('club:manage')) {
      menuItems.push({ key: 'club', label: 'Klub', href: '/new-dashboard/club' })
    }

    if (this.hasPermission('members:view')) {
      menuItems.push({ key: 'members', label: 'Anggota', href: '/new-dashboard/members' })
    }

    if (this.hasPermission('activities:view')) {
      menuItems.push({ key: 'activities', label: 'Kegiatan', href: '/new-dashboard/activities' })
    }

    if (this.hasPermission('certificates:view')) {
      menuItems.push({ key: 'certificates', label: 'Sertifikat', href: '/new-dashboard/certificates' })
    }

    if (this.hasPermission('system:admin')) {
      menuItems.push({ key: 'admin', label: 'Admin', href: '/new-dashboard/admin' })
    }

    return menuItems
  }
}

// Hook for using role guard in components
export function useRoleGuard(user: JWTPayload | null, userPosition: string | null = null) {
  return new RoleGuard(user, userPosition)
}

// Server-side permission checker
export function checkServerPermission(
  user: JWTPayload | null,
  permission: Permission,
  userPosition?: string | null
): boolean {
  const guard = new RoleGuard(user, userPosition || null)
  return guard.hasPermission(permission)
}