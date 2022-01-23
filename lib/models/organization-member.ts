import {UserProfile} from './user'

export enum Role {
  MEMBER = 1,
  ADMIN = 2,
  SUPER_ADMIN = 3,
}

export type OrganizationMember = {
  id: string
  role: Role
  user: UserProfile
  organizationId: string
  createdAt: Date
}
