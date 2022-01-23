import {PostgrestResponse} from '@supabase/postgrest-js/src/lib/types'
import {PostgrestError} from '@supabase/supabase-js'

export enum ErrorCode {
  UniqueViolation = '23505'
}

export class SupabaseError extends Error {
  public readonly code
  public readonly details
  public readonly hint
  
  constructor(supabaseError: PostgrestError) {
    super(supabaseError.message)
    this.code = supabaseError.code
    this.details = supabaseError.details
    this.hint = supabaseError.hint
  }

  public isUniqueViolation() {
    return this.code === ErrorCode.UniqueViolation
  }
}

export const runQueryOrFail = async <T>(query: PromiseLike<PostgrestResponse<T>>): Promise<T[]> => {
  const { data, error } = await query
  
  if (error) throw new SupabaseError(error)

  return data as T[]
}