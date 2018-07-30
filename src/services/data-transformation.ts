export class DataTransformationService {
  public transformTrueFalse(canEdit: boolean) {
    return (canEdit ? 1 : 0);
  }

  public createDateTime(date: string, time: string): Date {
    let dateTime: string | Date = date + ' ' + time;
    dateTime = new Date(dateTime);
    return dateTime
  }
}