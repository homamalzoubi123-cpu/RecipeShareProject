export interface Recipe {
  userId: number;
  userName?: string;
  id: number;
  title: string;
  description: string;
  instructions: string;
  prepTimeMinutes: number;
  difficulty: string;
  imageUrl: string | null;
}

export interface UserProfile {
  id?: number;
  imageUrl: string | null;
  username: string;
}

export type GetImageUrl = (imagePath: string | null) => string;
