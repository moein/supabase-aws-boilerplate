import {SupabaseClient} from '@supabase/supabase-js'
import {inject, injectable} from 'inversify'
import {TYPES} from '../ioc/types'
import {runQueryOrFail} from './supabase'
import {OrganizationMember} from "../models/organization-member";
import {organizationMemberRowToModel, organizationRowToModel} from "../database/mapping";
import {join} from 'lodash'
import {Organization} from '../models/organization'
import {Maybe} from '../models/base'

export interface OrganizationsRepository {
  findOneById(id: string): Promise<Maybe<Organization>>
}

@injectable()
export class SupbaseOrganizationsRepository implements OrganizationsRepository {
  constructor(@inject(TYPES.supabaseClient) private supabase: SupabaseClient) {}

  public async findOneById(id: string): Promise<Maybe<Organization>> {
    const data = await runQueryOrFail(
      this.supabase
        .from('organizations')
        .select()
        .match({
          id: id
        })
    )

    return data.length > 0 ? organizationRowToModel(data[0]) : null
  }
}