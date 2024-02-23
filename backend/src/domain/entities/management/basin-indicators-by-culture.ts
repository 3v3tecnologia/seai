import { Producer } from "./producer";

export type BasinIndicatorsByCultureProps = {
  id: number;
  producers: Array<Producer>;
};

export class BasinIndicatorsByCulture {
  private readonly _id;
  // private _producers: Array<Producer>;

  private _indicatorsPerBasin: Map<
    string,
    {
      Social: number;
      Economic: number;
      Consumption: number;
      Productivity: number;
    }
  > | null;

  private _groupedByCulture: Map<
    string,
    Array<{
      Producer: number;
      Percentage: number;
      Social: number | null;
      Economic: number | null;
      Consumption: number | null;
      Productivity: number | null;
    }>
  >;

  constructor(props: BasinIndicatorsByCultureProps) {
    this._id = props.id;

    console.log(props);

    props.producers.forEach((data) => {
      console.log(data);
    });

    this._groupedByCulture = this.groupCultureIndicatorsByCultureName(
      props.producers
    );

    this._indicatorsPerBasin = this.calcAverageOfCultureIndicators();
  }

  public get Id() {
    return this._id;
  }

  public get Cultures() {
    return this._indicatorsPerBasin;
  }

  public get GroupedCulturesByName() {
    return this._groupedByCulture;
  }

  private calcAverage(values: Array<number>, total: number) {
    return values.reduce((prev, current) => prev + current, 0) / total;
  }

  private calcAverageOfCultureIndicators(): Map<
    string,
    {
      Social: number;
      Economic: number;
      Consumption: number;
      Productivity: number;
    }
  > {
    const culturesIndicatorsByBasin: Map<
      string,
      {
        Social: number;
        Economic: number;
        Consumption: number;
        Productivity: number;
      }
    > = new Map();

    for (const culture of this._groupedByCulture) {
      const name = culture[0];
      const indicators = culture[1];

      const profitability = [];
      const social = [];
      const consumption = [];
      const productivity = [];

      let totalProportionalArea = 0;

      for (const indicator of indicators) {
        const proportionalArea = indicator.Percentage * 100;

        if (indicator.Economic) {
          profitability.push(proportionalArea * indicator.Economic);
        }

        if (indicator.Social) {
          social.push(proportionalArea * indicator.Social);
        }

        if (indicator.Consumption) {
          consumption.push(proportionalArea * indicator.Consumption);
        }

        if (indicator.Productivity) {
          productivity.push(proportionalArea * indicator.Productivity);
        }

        totalProportionalArea += proportionalArea;
      }

      culturesIndicatorsByBasin.set(name, {
        Social: this.calcAverage(social, totalProportionalArea),
        Consumption: this.calcAverage(consumption, totalProportionalArea),
        Economic: this.calcAverage(profitability, totalProportionalArea),
        Productivity: this.calcAverage(productivity, totalProportionalArea),
      });
    }

    return culturesIndicatorsByBasin;
  }

  private groupCultureIndicatorsByCultureName(producers: Array<Producer>): Map<
    string,
    Array<{
      Producer: number;
      Percentage: number;
      Social: number | null;
      Economic: number | null;
      Consumption: number | null;
      Productivity: number | null;
    }>
  > {
    // Group culture indicators
    const cultures = new Map();
    // Loop for each producer
    producers.forEach((producer) => {
      producer.Cultures.forEach((culture) => {
        const data = {
          Producer: producer.Id,
          Social: culture.SocialSecurity,
          Percentage: culture.PercentageArea,
          Consumption: culture.ConsumptionSecurity,
          Economic: culture.EconomicSecurity,
          Productivity: culture.ProductivitySecurity,
        };

        if (cultures.has(culture.Name)) {
          cultures.get(culture.Name)?.push(data);

          return;
        }

        cultures.set(culture.Name, [data]);
      });
    });

    return cultures;
  }
}
