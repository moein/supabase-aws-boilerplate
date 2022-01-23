import {Role} from "./organization-member";

export type OrganizationInvitation = {
  id: string
  email: string
  role: Role
  organizationId: string
  inviterId: string
}

export type OrganizationInvitationToken = {
  id: string
  token: string
}