// TODO convert class to interphase
export class Marker {
    constructor(
      public lat: number,
      public lng: number,
      public label?: string,
      public icon?: any
    ) {}
}
// export interface Marker {
//     lat: number;
//     lng: number;
//     label?: string;
//     icon?: any;
// }

// Map Icons and images
const driverIconImage = 'assets/images/map/CarIcon_top_sm.png';
export let iconDriver = {
      url: driverIconImage,
      scaledSize: {
          width: 60,
          height: 30
      }
};
const poiIconImage = 'assets/images/map/iconPoi.png';
export let iconPoi = {
      url: poiIconImage,
      scaledSize: {
          width: 30,
          height: 40
      }
  };

