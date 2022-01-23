import {Maybe} from '../models/base'
import logger from '../logger'

export type SimpleObject = object & Record<string, any>

const parseJson = (json: Maybe<string>, field: string): unknown => {
  if (!json) {
    return null
  }
  try {
    return JSON.parse(json)
  } catch (e) {
    logger.error('Failed to parse json', {field, json})
    return null
  }
}

export const databaseRowToModel = <T extends object>(databaseRow: SimpleObject, jsonFields: string[]): T => {
  const model: Record<string, unknown> = {}
  for (const dbField of Object.keys(databaseRow)) {
    const modelField = dbField.split('_').reduce((agg, word, index) => {
      return agg + (index === 0 ? word : (word.slice(0, 1).toUpperCase() + word.slice(1)))
    }, '')
    model[modelField] = jsonFields.includes(dbField) ? parseJson(databaseRow[dbField], dbField) : databaseRow[dbField] as unknown
  }
  
  return model as T
}

export const modelToDatabaseRow = <T extends SimpleObject>(model: SimpleObject): T => {
  const row: SimpleObject = {}
  for (const modelField of Object.keys(model)) {
    const dbField = modelField.split(/(?=[A-Z])/).join('_').toLowerCase()
    row[dbField] = model[modelField]
  }
  
  return row as T
}