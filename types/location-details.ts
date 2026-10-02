import type { Location } from './location';

export interface LocationDetails
  extends Omit<Location, 'ownerId' | 'feedbacksId'> {
  ownerId: {
    _id: string;
    name: string;
    avatar: string;
  } | null;
  feedbacksId: {
    _id: string;
    rate: number;
    description: string;
    userName: string;
  }[];
}
