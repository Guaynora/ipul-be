export const PARISHIONER_READER = 'PARISHIONER_READER';

export interface ParishionerReaderPort {
  existsById(id: string): Promise<boolean>;
}
