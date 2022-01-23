import {SupabaseClient} from '@supabase/supabase-js'
import {inject, injectable} from 'inversify'
import {TYPES} from '../ioc/types'
import {runQueryOrFail} from './supabase'
import {OrganizationMember} from "../models/organization-member";
import {organizationMemberRowToModel, userProfileRowToModel} from "../database/mapping";
import {join} from 'lodash'
import {Maybe} from '../models/base'
import {UserProfile} from '../models/user'

export interface UserProfilesRepository {
  findOneById(id: string): Promise<Maybe<UserProfile>>
  findOneByEmail(email: string): Promise<Maybe<UserProfile>>
}

@injectable()
export class SupbaseUserProfilesRepository implements UserProfilesRepository {
  constructor(@inject(TYPES.supabaseClient) private supabase: SupabaseClient) {}

  public async findOneByEmail(email: string): Promise<Maybe<UserProfile>> {
    return await this.findOneBy({email})
  }

  public async findOneById(id: string): Promise<Maybe<UserProfile>> {
    return await this.findOneBy({id})
  }

  private async findOneBy(filter: Record<string, string>): Promise<Maybe<UserProfile>> {
    const data = await runQueryOrFail(
      this.supabase
        .from('user_profiles')
        .select()
        .match(filter)
    )

    return data.length > 0 ? userProfileRowToModel(data[0]) : null
  }
}