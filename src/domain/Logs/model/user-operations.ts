export type UserOperation = {
  time: string;
  user: {
    id: number;
    name: string;
  };
  resource: string;
  operation: string;
  description: string;
};

export function toDomain(data: any): UserOperation {
  const { Name, Id, Time, Resource, Operation, Description } = data;

  return {
    time: Time,
    user: {
      id: Id,
      name: Name,
    },
    description: Description,
    operation: Operation,
    resource: Resource,
  };
}
