import { UserId } from "./common";

export interface DelegateUser {
    userId: UserId,
    startDate: string,
    endDate: string,
    reason: string,
    byUserName?:string,
    byUser?: UserId
}

export enum DelegateFilterByType {
    myDelegate = 'myDelegate',
    myResponsibilities = 'myResponsibilities',
    admin = 'admin'
  }
  
