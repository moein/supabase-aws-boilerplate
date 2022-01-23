import {OrganizationInvitation} from "../../models/organization-invitation";
import {inject, injectable} from "inversify";
import {OrganizationMembersRepository} from "../../repositories/organization-members-repository";
import {UserProfilesRepository} from '../../repositories/user-profiles-repository'
import {EmailNotifier} from '../notifications/email-notifier'
import {TYPES} from '../../ioc/types'
import {OrganizationsRepository} from '../../repositories/organization-repository'
import logger from '../../logger'

export interface OrganizationInvitationHandler {
  handleInvitation(organizationInvitation: OrganizationInvitation): Promise<void>
}

@injectable()
export class SimpleOrganizationInvitationHandler implements OrganizationInvitationHandler {
  constructor(
    @inject(TYPES.emailNotifier) private emailNotifier: EmailNotifier,
    @inject(TYPES.userProfilesRepository) private userProfilesRepository: UserProfilesRepository,
    @inject(TYPES.organizationsRepository) private organizationsRepository: OrganizationsRepository,
  ) {}

  public async handleInvitation(invitation: OrganizationInvitation): Promise<void> {
    const organization = await this.organizationsRepository.findOneById(invitation.organizationId)
    const inviter = await this.userProfilesRepository.findOneById(invitation.inviterId)
    if (!inviter) {
      logger.error('missing_user', {
        'user_id': invitation.inviterId
      })
      return
    }
    if (!organization) {
      logger.error('missing_organization', {
        'organization_id': invitation.organizationId
      })
      return
    }
    const emailContent = `You have been invited to organization ${organization.name} By ${inviter.firstName}`
    await this.emailNotifier.sendEmail(invitation.email, {
      html: emailContent,
      text: emailContent,
    })
  }

}