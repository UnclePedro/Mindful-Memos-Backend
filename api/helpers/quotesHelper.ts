import { prisma } from "./prismaClient";

export const getRandomQuote = async () => {
  const allQuotes = await prisma.quote.findMany();
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[randomIndex];
};

export const getUserQuotes = async () => {
  return await prisma.quote.findMany({
    where: {
      isUserQuote: true,
    },
    include: {
      user: {
        select: {
          profilePictureUrl: true, // Only fetch the profile picture URL
        },
      },
    },
  });
};

export const addQuote = async (
  quote: string,
  author: string,
  userId: string,
  isUserQuote: boolean = true
) => {
  const newQuote = await prisma.quote.create({
    data: {
      quote,
      author,
      isUserQuote,
      user: {
        connect: { id: userId },
      },
    },
  });
  return newQuote;
};

export const deleteQuote = async (quoteId: number) => {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { userId: true }, // Select the userId based on the quoteId
  });

  if (!quote) {
    throw new Error("Quote not found");
  }

  await prisma.quote.delete({
    where: {
      id: quoteId,
    },
  });
};

export const loadQuotes = async (
  quotes: { quote: string; author: string }[]
) => {
  for (const { quote, author } of quotes) {
    await addQuote(quote, author, "1", false); // Set isUserQuote to false for predefined quotes
  }
  console.log("Inspirational quotes loaded successfully!");
};
