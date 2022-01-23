export type WebhookEvent<T> = {
  detail: T
}

export enum SupabaseSingleRecordEventType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export type SupabaseSingleRecordEvent<T> = {
  type: SupabaseSingleRecordEventType
  table: string
  record: T
  old_record: T
}