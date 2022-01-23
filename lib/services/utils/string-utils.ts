import { nanoid } from 'nanoid/async'

export class StringUtils {
  public static generateId() {
    return nanoid(10)
  }
  
  public static generateToken() {
    return nanoid(50)
  }
}