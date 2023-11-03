export interface EquipmentEntity {
  Id?: number;
  Code: number;
  Name: string;
  Type: {
    Id: number;
    Name: string;
  };
  Location: {
    Id: number;
    Altitude: number;
    Position: string;
    Name: string;
  };
  Organ: {
    IdOrgan: number;
    Organ: string;
  };
  CreatedAt: string;
  UpdatedAt: string;
}
