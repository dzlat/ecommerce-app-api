import { Review } from '@prisma/generated';

export class ReviewEntity implements Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  shouldSee: boolean | null;
  userId: string;
  movieId: string;
}
