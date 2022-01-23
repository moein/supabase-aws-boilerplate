import {SupabaseClient} from '@supabase/supabase-js'
import {inject, injectable} from 'inversify'
import {TYPES} from '../ioc/types'
import {runQueryOrFail} from './supabase'
import {OrganizationMember} from "../models/organization-member";
import {organizationMemberRowToModel} from "../database/mapping";
import {join} from 'lodash'

export interface OrganizationMembersRepository {
  findByOrganizationId(organizationId: string): Promise<OrganizationMember[]>
}

@injectable()
export class SupbaseOrganizationMembersRepository implements OrganizationMembersRepository {
  constructor(@inject(TYPES.supabaseClient) private supabase: SupabaseClient) {}

  public async findByOrganizationId(organizationId: string): Promise<OrganizationMember[]> {
    const data = await runQueryOrFail(
      this.supabase
        .from('organization_members')
        .select('id,organization_id,role,created_at,user_profiles(id,email,first_name,full_name)')
        .match({
          organization_id: organizationId
        })
    )

    return data.map(organizationMemberRowToModel)
  }
}