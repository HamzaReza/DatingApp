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

export interface HeightValues {
  height: string;
}

export interface AlcoholValues {
  alcohol: "drink" | "dont_drink" | "occasionally" | "socially" | "";
}

export interface SmokingValues {
  smoking: "smoke" | "dont_smoke" | "occasionally" | "socially" | "";
}

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
  country: string;
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

export type AboutValues = {
  bio: string;
  aboutMe: string;
};
