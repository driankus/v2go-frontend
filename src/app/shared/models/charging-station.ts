export interface ChargingStation {
    id: number;
    nk: string;
    name?: string;
    address: string;
    lat: number;
    lng: number;
    charge_level: string;
    tarif_text: string;
}
