export class CalcIndicators {
  private constructor() {}

  public static profitabilityPerHectare(
    profitability: number,
    hectares: number
  ) {
    return profitability / hectares;
  }

  public static economicSecurity(
    percentage: number,
    profitabilityPerArea: number
  ) {
    return percentage * profitabilityPerArea;
  }

  public static consumptionSecurity(
    percentage: number,
    totalConsume: number,
    area: number
  ) {
    return percentage * (totalConsume / area);
  }

  public static productivitySecurity(
    percentage: number,
    totalProductivity: number,
    area: number
  ) {
    return percentage * (totalProductivity / area);
  }

  public static socialSecurity(
    percentage: number,
    workersCount: number,
    area: number
  ) {
    return percentage * (workersCount / area);
  }
}
