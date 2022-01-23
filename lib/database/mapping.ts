import {OrganizationMember, Role} from "../models/organization-member";
import {OrganizationInvitation, OrganizationInvitationToken} from "../models/organization-invitation";
import {databaseRowToModel} from "./field-convertor";
import {UserProfile} from '../models/user'
import {Organization} from '../models/organization'

export type OrganizationInvitationRow = {
  id: string
  email: string
  role: Role
  organization_id: string
}

export type OrganizationMemberRow = {
  id: string
  organization_id: string
  role: number
  user_profiles: UserProfileRow
  created_at: string
}

export type UserProfileRow = {
  id: string
  email: string
  first_name: string
  full_name: string
}

export type OrganizationRow = {
  id: string
  name: string
}

export const organizationInvitationRowToModel = (row: OrganizationInvitationRow): OrganizationInvitation => {
  return databaseRowToModel(row, [])
}

export const organizationRowToModel = (row: OrganizationRow): Organization => {
  return databaseRowToModel(row, [])
}

export const userProfileRowToModel = (row: UserProfileRow): UserProfile => {
  return {
    id: row.id,
    firstName: row.first_name,
    fullName: row.full_name,
    email: row.email,
  }
}

export const organizationMemberRowToModel = (row: OrganizationMemberRow): OrganizationMember => {
  return {
    id: row.id,
    organizationId: row.organization_id,
    role: row.role as Role,
    user: userProfileRowToModel(row.user_profiles),
    createdAt: new Date(row.created_at)
  }
}