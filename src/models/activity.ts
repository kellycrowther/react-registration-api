import { IDateTimes } from './date-times';

export interface IActivity {
  activity_id: number;
  activityName: string;
  ageRestriction: string;
  canEdit: boolean;
  dateTimes: IDateTimes;
  location: string;
  price: string;
  quantity: string;
}
