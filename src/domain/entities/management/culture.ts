import { left } from "../../../shared/Either";
import { CalcIndicators } from "./utils/calcIndicators";

export type CultureProps = {
  IrrigatedArea: number;
  CultivationPeriod: number;
  Profitability: number; //(R$ / ha)
};

export class Culture {
  private _name: string;

  private _cultivatedArea: number; // _irrigatedArea * _cultivationPeriod

  private _irrigatedArea: number; //ha
  private _cultivationPeriod: number; // months

  private _percentageArea: number | null;

  // Culture Indicators
  private _profitabilityPerHectare: number;
  private _economicSecurity: number | null;
  private _productivitySecurity: number | null;
  private _consumptionSecurity: number | null;
  private _socialSecurity: number | null;

  constructor(name: string, props: CultureProps) {
    this._name = name;

    this._cultivationPeriod = props.CultivationPeriod;
    this._irrigatedArea = props.IrrigatedArea;

    // R$/ha
    this._profitabilityPerHectare = CalcIndicators.profitabilityPerHectare(
      props.Profitability, // total profitability from producer
      this._irrigatedArea //ha
    );

    this._cultivatedArea = this.calcCultivatedArea(
      props.IrrigatedArea,
      props.CultivationPeriod
    );

    // Calculated when Producer has total cultures area
    this._percentageArea = null;
    this._economicSecurity = null;
    this._consumptionSecurity = null;
    this._productivitySecurity = null;
    this._socialSecurity = null;
  }

  public get Name() {
    return this._name;
  }

  // ha
  public get IrrigatedArea() {
    return this._irrigatedArea;
  }
  // months
  public get CultivationPeriod() {
    return this._cultivationPeriod;
  }

  public get ProfitabilityPerHectare() {
    return this._profitabilityPerHectare;
  }
  //(IrrigatedArea * CultivationPeriod)
  public get CultivatedArea() {
    return this._cultivatedArea;
  }

  public get EconomicSecurity() {
    return this._economicSecurity;
  }

  public get ConsumptionSecurity() {
    return this._consumptionSecurity;
  }

  public get SocialSecurity() {
    return this._socialSecurity;
  }

  public get ProductivitySecurity() {
    return this._productivitySecurity;
  }

  public get PercentageArea() {
    return this._percentageArea;
  }

  public setEconomicSecurity() {
    if (this._percentageArea == null) {
      return left(new Error("Percentage Area is required"));
    }

    this._economicSecurity = CalcIndicators.economicSecurity(
      this._percentageArea,
      this._profitabilityPerHectare
    );
  }

  public setSocialSecurity(workersCount: number) {
    if (this._percentageArea == null) {
      return left(new Error("Percentage Area is required"));
    }

    this._socialSecurity = CalcIndicators.socialSecurity(
      this._percentageArea,
      workersCount,
      this._irrigatedArea
    );
  }

  public setConsumptionSecurity(totalConsume: number) {
    if (this._percentageArea == null) {
      return left(new Error("Percentage Area is required"));
    }

    this._consumptionSecurity = CalcIndicators.consumptionSecurity(
      this._percentageArea,
      totalConsume,
      this._irrigatedArea
    );
  }

  public setProductivitySecurity(totalProductivity: number) {
    if (this._percentageArea == null) {
      return left(new Error("Percentage Area is required"));
    }

    this._productivitySecurity = CalcIndicators.productivitySecurity(
      this._percentageArea,
      totalProductivity,
      this._irrigatedArea
    );
  }

  public setPercentageArea(total: number) {
    this._percentageArea = this.calcPercentageArea(this.CultivatedArea, total);
  }

  // (TotalArea/totalCulturesArea)
  private calcPercentageArea(area: number, total: number) {
    return area / total;
  }

  private calcCultivatedArea(area: number, period: number) {
    return area * period;
  }
}
