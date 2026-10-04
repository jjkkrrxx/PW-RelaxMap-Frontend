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
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationWithOwner extends Omit<Location, 'ownerId'> {
  ownerId: {
    _id: string;
    name: string;
    avatar: string;
  };
}