//types\location.ts

export interface Location {
  _id: string;
  image: string;
  name: string;
  locationType: string;
  region: string;
  rate: number;
  description: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  ownerId: string;
  feedbacksId: string[];
  createdAt: string;
  updatedAt: string;
}
