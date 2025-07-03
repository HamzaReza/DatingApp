import { LocationObject } from "expo-location";

export interface UserState {
  user: any | null;
  token: string | null;
  deviceLocation: LocationObject | null;
  locationPermissionGranted: boolean;
}
