type actions = "create" | "delete" | "update";

export type DatabaseOperationOutputLog = {
  action: actions;
  table: string;
  description: string;
};

export class DatabaseOperationOutputLogFactory {
  static insert(
    table: string,
    description?: string
  ): DatabaseOperationOutputLog {
    return {
      action: "create",
      table,
      description: description || "Sucesso ao inserir dados.",
    };
  }

  static delete(
    table: string,
    description?: string
  ): DatabaseOperationOutputLog {
    return {
      action: "delete",
      table,
      description: description || "Sucesso ao apagar dados.",
    };
  }

  static update(
    table: string,
    description?: string
  ): DatabaseOperationOutputLog {
    return {
      action: "update",
      table,
      description: description || "Sucesso ao atualizar dados.",
    };
  }
}
