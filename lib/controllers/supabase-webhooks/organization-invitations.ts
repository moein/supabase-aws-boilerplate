import {container} from '../../ioc/inversify.config'
import {TYPES} from '../../ioc/types'
import {SupabaseSingleRecordEvent, SupabaseSingleRecordEventType, WebhookEvent} from './types'
import {SimpleObject} from "../../database/field-convertor";
import {OrganizationInvitationRow, organizationInvitationRowToModel} from "../../database/mapping";
import {OrganizationInvitationHandler} from '../../services/organization-members/organization-invitation-handler'
import logger from '../../logger'

export const handleInsert = async (event: WebhookEvent<SupabaseSingleRecordEvent<SimpleObject>>) => {
  if (event.detail.type !== SupabaseSingleRecordEventType.INSERT) {
    logger.warn('invalid supabase event', {
      event,
      'expected': 'insert'
    })
    return
  }
  const invitation = organizationInvitationRowToModel(event.detail.record as OrganizationInvitationRow)
  
  await container.get<OrganizationInvitationHandler>(TYPES.organizationInvitationHandler)
    .handleInvitation(invitation)
}