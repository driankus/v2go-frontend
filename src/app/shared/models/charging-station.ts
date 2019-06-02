export class ChargingStation {
    constructor(
      public id?: number,
      public nk?: string,
      public name?: string,
      public address?: string,
      public lat?: number,
      public lng?: number,
    ) {}

    static create(data: any): ChargingStation {
        return new ChargingStation(
          data.id,
          data.nk,
          data.name,
          data.address,
          data.lat,
          data.lng,
        );
      }
  }