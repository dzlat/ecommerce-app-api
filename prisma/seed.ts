import { PrismaClient, Genre, MovieFormat } from './generated';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Movie data with real information
  const moviesData = [
    {
      title: 'The Shawshank Redemption',
      description:
        'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      genre: Genre.DRAMA,
      rating: 9.3,
      year: 1994,
      featured: true,
    },
    {
      title: 'The Godfather',
      description:
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      genre: Genre.DRAMA,
      rating: 9.2,
      year: 1972,
      featured: true,
    },
    {
      title: 'The Dark Knight',
      description:
        'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      genre: Genre.ACTION,
      rating: 9.0,
      year: 2008,
      featured: true,
    },
    {
      title: 'Pulp Fiction',
      description:
        'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      genre: Genre.THRILLER,
      rating: 8.9,
      year: 1994,
      featured: false,
    },
    {
      title: 'Inception',
      description:
        'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      genre: Genre.SCI_FI,
      rating: 8.8,
      year: 2010,
      featured: true,
    },
    {
      title: 'The Matrix',
      description:
        'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
      genre: Genre.SCI_FI,
      rating: 8.7,
      year: 1999,
      featured: false,
    },
    {
      title: 'Goodfellas',
      description:
        'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
      genre: Genre.DRAMA,
      rating: 8.7,
      year: 1990,
      featured: false,
    },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      description:
        'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
      genre: Genre.FANTASY,
      rating: 8.8,
      year: 2001,
      featured: true,
    },
    {
      title: 'Fight Club',
      description:
        'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much bigger.',
      genre: Genre.DRAMA,
      rating: 8.8,
      year: 1999,
      featured: false,
    },
    {
      title: 'Forrest Gump',
      description:
        'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
      genre: Genre.DRAMA,
      rating: 8.8,
      year: 1994,
      featured: false,
    },
    {
      title: 'The Silence of the Lambs',
      description:
        'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
      genre: Genre.HORROR,
      rating: 8.6,
      year: 1991,
      featured: false,
    },
    {
      title: 'Interstellar',
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      genre: Genre.SCI_FI,
      rating: 8.6,
      year: 2014,
      featured: false,
    },
    {
      title: 'The Lion King',
      description:
        'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
      genre: Genre.ANIMATION,
      rating: 8.5,
      year: 1994,
      featured: false,
    },
    {
      title: 'Gladiator',
      description:
        'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      genre: Genre.ACTION,
      rating: 8.5,
      year: 2000,
      featured: false,
    },
    {
      title: 'The Departed',
      description:
        'An undercover cop and a mole in the police force attempt to identify each other while infiltrating an Irish gang in South Boston.',
      genre: Genre.THRILLER,
      rating: 8.5,
      year: 2006,
      featured: false,
    },
  ];

  // Upsert movies
  const movies = await Promise.all(
    moviesData.map((movie) => {
      const slug = slugify(movie.title, { lower: true, strict: true });
      return prisma.movie.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          title: movie.title,
          description: movie.description,
          genre: movie.genre,
          rating: movie.rating,
          year: movie.year,
          featured: movie.featured,
        },
      });
    }),
  );

  console.log(`Upserted ${movies.length} movies`);

  // Product data - 20 products across different formats
  const productsData = [
    // The Shawshank Redemption - 2 products
    {
      movieIndex: 0,
      format: MovieFormat.DVD,
      quantity: 50,
      originalPrice: 19.99,
      price: 14.99,
    },
    {
      movieIndex: 0,
      format: MovieFormat.BLU_RAY,
      quantity: 30,
      originalPrice: 24.99,
      price: 19.99,
    },

    // The Godfather - 2 products
    {
      movieIndex: 1,
      format: MovieFormat.DVD,
      quantity: 45,
      originalPrice: 18.99,
      price: 13.99,
    },
    {
      movieIndex: 1,
      format: MovieFormat.ULTRA_HD_BLU_RAY,
      quantity: 25,
      originalPrice: 29.99,
      price: 24.99,
    },

    // The Dark Knight - 3 products
    {
      movieIndex: 2,
      format: MovieFormat.DVD,
      quantity: 60,
      originalPrice: 19.99,
      price: 15.99,
    },
    {
      movieIndex: 2,
      format: MovieFormat.BLU_RAY,
      quantity: 40,
      originalPrice: 24.99,
      price: 19.99,
    },
    {
      movieIndex: 2,
      format: MovieFormat.ULTRA_HD_BLU_RAY,
      quantity: 20,
      originalPrice: 34.99,
      price: 29.99,
    },

    // Pulp Fiction - 2 products
    {
      movieIndex: 3,
      format: MovieFormat.DVD,
      quantity: 55,
      originalPrice: 17.99,
      price: 12.99,
    },
    {
      movieIndex: 3,
      format: MovieFormat.BLU_RAY,
      quantity: 35,
      originalPrice: 22.99,
      price: 17.99,
    },

    // Inception - 2 products
    {
      movieIndex: 4,
      format: MovieFormat.BLU_RAY,
      quantity: 50,
      originalPrice: 24.99,
      price: 19.99,
    },
    {
      movieIndex: 4,
      format: MovieFormat.ULTRA_HD_BLU_RAY,
      quantity: 30,
      originalPrice: 32.99,
      price: 27.99,
    },

    // The Matrix - 2 products
    {
      movieIndex: 5,
      format: MovieFormat.DVD,
      quantity: 40,
      originalPrice: 16.99,
      price: 11.99,
    },
    {
      movieIndex: 5,
      format: MovieFormat.BLU_RAY,
      quantity: 45,
      originalPrice: 23.99,
      price: 18.99,
    },

    // Goodfellas - 1 product
    {
      movieIndex: 6,
      format: MovieFormat.DVD,
      quantity: 35,
      originalPrice: 15.99,
      price: 10.99,
    },

    // The Lord of the Rings - 2 products
    {
      movieIndex: 7,
      format: MovieFormat.BLU_RAY,
      quantity: 40,
      originalPrice: 26.99,
      price: 21.99,
    },
    {
      movieIndex: 7,
      format: MovieFormat.ULTRA_HD_BLU_RAY,
      quantity: 25,
      originalPrice: 35.99,
      price: 30.99,
    },

    // Fight Club - 1 product
    {
      movieIndex: 8,
      format: MovieFormat.DVD,
      quantity: 30,
      originalPrice: 14.99,
      price: 9.99,
    },

    // Forrest Gump - 1 product
    {
      movieIndex: 9,
      format: MovieFormat.DVD,
      quantity: 50,
      originalPrice: 18.99,
      price: 13.99,
    },

    // The Silence of the Lambs - 1 product
    {
      movieIndex: 10,
      format: MovieFormat.BLU_RAY,
      quantity: 30,
      originalPrice: 21.99,
      price: 16.99,
    },

    // Interstellar - 1 product
    {
      movieIndex: 11,
      format: MovieFormat.ULTRA_HD_BLU_RAY,
      quantity: 35,
      originalPrice: 33.99,
      price: 28.99,
    },
  ];

  // Upsert products
  const products = await Promise.all(
    productsData.map((product) => {
      const movieId = movies[product.movieIndex].id;
      return prisma.product.upsert({
        where: {
          movieId_format: {
            movieId,
            format: product.format,
          },
        },
        update: {},
        create: {
          movieId,
          format: product.format,
          quantity: product.quantity,
          originalPrice: product.originalPrice,
          price: product.price,
        },
      });
    }),
  );

  console.log(`Upserted ${products.length} products`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
