import 'reflect-metadata'
import {Container} from 'inversify'
import {TYPES} from './types'
import {createClient} from '@supabase/supabase-js'
import env from '../env'
import {SupabaseAuth} from '../services/auth/supabase'
import {SupbaseUserProfilesRepository} from '../repositories/user-profiles-repository'
import {NullEmailNotifier} from '../services/notifications/email-notifier'
import {SimpleOrganizationInvitationHandler} from '../services/organization-members/organization-invitation-handler'
import {SupbaseOrganizationsRepository} from '../repositories/organization-repository'

const container = new Container({ defaultScope: 'Singleton', autoBindInjectable: true })

// Services
container.bind(TYPES.supabaseAuth).to(SupabaseAuth)
container.bind(TYPES.emailNotifier).to(NullEmailNotifier)
container.bind(TYPES.organizationInvitationHandler).to(SimpleOrganizationInvitationHandler)

// Vendors
const supabase = createClient(env.supabase.url, env.supabase.apiSecret)
container.bind(TYPES.supabaseClient).toConstantValue(supabase)

// Repositories
container.bind(TYPES.userProfilesRepository).to(SupbaseUserProfilesRepository)
container.bind(TYPES.organizationsRepository).to(SupbaseOrganizationsRepository)

export { container }