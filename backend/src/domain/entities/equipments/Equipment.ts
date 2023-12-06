export interface EquipmentEntity {
  Id?: number;
  Code: number;
  Name: string;
  Type: {
    Id: number;
    Name: string;
  };
  Altitude: number| null;
  Location: {
    Id: number | null;
    Coordinates:Array<number> | null;
    Name: string;
  } | null;
  Organ: {
    Id: number;
    Name: string;
  };
  CreatedAt: string;
  UpdatedAt: string;
}
