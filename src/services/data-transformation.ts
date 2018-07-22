export class DataTransformationService {
  public transformTrueFalse(canEdit: boolean) {
    return (canEdit ? 1 : 0);
  }
}