export interface ParishionerEntity {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  baptized: boolean;
  createdAt: Date;
  updatedAt: Date;
}
