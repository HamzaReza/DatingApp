export interface LoginValues {
  phone: string;
}

export interface SignupValues {
  phone: string;
}

export interface NameValues {
  name: string;
}

export interface EmailValues {
  email: string;
}

export interface AgeValues {
  age: number;
}

export type GenderValues = {
  gender: "male" | "female" | "other";
};

export type LookingForValues = {
  lookingFor: "relationship" | "casual" | "notSure" | "marriage";
};

export type InterestsValues = {
  interests: string[];
};

export type PhotoValues = {
  photo: string | null;
};

export type LocationValues = {
  location: {
    latitude: number;
    longitude: number;
  } | null;
};

export type ProfessionValues = {
  profession:
    | "it"
    | "healthcare"
    | "engineer"
    | "business"
    | "teacher"
    | "artist"
    | "";
};

export type ReligionValues = {
  religion: "hinduism" | "islam" | "christianity" | "judaism" | "";
};
