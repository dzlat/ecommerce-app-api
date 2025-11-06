import { Review } from '@generated/prisma';

export class ReviewEntity implements Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  shouldSee: boolean | null;
  userId: string;
  movieId: string;
}
