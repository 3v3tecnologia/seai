import { Either, left, right } from "../../../shared/Either";
import { Culture } from "./culture";

export type ProducerProps = {
  Workers: number | null;
  WaterConsumption: number | null;
  Productivity: number | null;
  Profitability: number | null;
  TotalCulturesArea?: number;
  Cultures: Array<Culture>;
};

export class Producer {
  public static MAX_QUANTITY_OF_CULTURES = 4;

  private _id: number;

  private _workersCount: number | null;
  private _waterConsumption: number | null;
  private _productivity: number | null;
  private _profitability: number | null;
  private _totalCultivatedArea: number;

  private _cultures: Array<Culture>;

  constructor(id: number, props: ProducerProps) {
    this._id = id;

    this._cultures = props.Cultures;

    this._workersCount = props.Workers; // from producer workers query
    // ⚠️ Need to distribute for each culture
    this._profitability = props.Profitability; // from culture profitability

    this._waterConsumption = props.WaterConsumption;

    this._productivity = props.Productivity;

    // If has only one culture then do not need to calculate cultivated area
    this._totalCultivatedArea = this.calcTotalCultivatedArea(this._cultures); // sum(cultures.TotalArea)(ha)

    this.setCulturesPercentageArea();

    Object.freeze(this);
  }

  public get Id() {
    return this._id;
  }

  public get Cultures() {
    return this._cultures;
  }

  public get WorkersCount() {
    return this._workersCount;
  }

  public get Profitability() {
    return this._profitability;
  }

  public get TotalCultivatedArea() {
    return this._totalCultivatedArea;
  }

  public get TotalWaterConsumption() {
    return this._waterConsumption;
  }

  public get TotalProductivity() {
    return this._productivity;
  }

  private calcTotalCultivatedArea(cultures: Array<Culture>): number {
    return cultures.reduce((prev, current) => prev + current.CultivatedArea, 0);
  }

  private setCulturesPercentageArea() {
    this._cultures.forEach((culture) => {
      culture.setPercentageArea(this._totalCultivatedArea);
      culture.setEconomicSecurity();

      if (this._waterConsumption)
        culture.setConsumptionSecurity(this._waterConsumption);
      if (this._productivity)
        culture.setConsumptionSecurity(this._productivity);
      if (this._workersCount) culture.setSocialSecurity(this._workersCount);
    });
  }

  static create() {}
}
