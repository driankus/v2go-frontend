import { ElectricVehicle } from './electric-vehicle';

export interface UserInfo {
    first_name?: string;
    id: number;
    last_name?: string;
    user_name: string;
}

export interface UserAccountData {
    evs: ElectricVehicle[];
    reservations: any[];    // TODO replace this with reservation interphace (PR #6)
    user: UserInfo;
}
