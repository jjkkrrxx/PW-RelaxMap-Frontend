export interface UserProfile {
  name: string;
  avatar?: string | null;
  articlesAmount: number;
}

export interface CurrentUserIdentity {
  _id: string;
}
