import { prisma } from "../..";

export const getRandomQuote = async () => {
  const allQuotes = await prisma.quote.findMany();
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[randomIndex];
};

export async function getUserQuotes() {
  return await prisma.quote.findMany({
    where: {
      isUserQuote: true,
    },
  });
}

export async function addQuote(
  quote: string,
  author: string,
  authorId: number,
  isUserQuote: boolean = true
) {
  await prisma.quote.create({
    data: {
      quote,
      author,
      isUserQuote,
      user: {
        connect: { id: authorId }, // Connect the quote to the user using their ID
      },
    },
  });
}

export async function deleteQuote(quoteId: number, apiKey: string) {
  // Retrieve the quote to check the associated authorId
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { authorId: true }, // Select the authorId based on the quoteId
  });

  // If the quote doesn't exist, throw an error
  if (!quote) {
    throw new Error("Quote not found");
  }

  // Retrieve the user to check the apiKey
  const user = await prisma.user.findUnique({
    where: { id: quote.authorId },
    select: { apiKey: true },
  });

  // If the user doesn't exist or the apiKey does not match, throw an error
  if (!user) {
    throw new Error("User not found");
  }
  if (user.apiKey !== apiKey) {
    throw new Error("Unauthorized: API key does not match");
  }

  // Proceed with deletion if the apiKey matches
  await prisma.quote.delete({
    where: {
      id: quoteId,
    },
  });
}

export async function loadQuotes(quotes: []) {
  for (const { quote, author } of quotes) {
    await addQuote(quote, author, 1, false); // Set isUserQuote to false for predefined quotes
  }
  console.log("Inspirational quotes loaded successfully!");
}

// Function to delete all quotes from the database
export async function deleteAllQuotes() {
  try {
    const deletedQuotes = await prisma.quote.deleteMany({});
    console.log(`Deleted ${deletedQuotes.count} quotes from the database.`);
  } catch (error) {
    console.error("Error deleting quotes:", error);
  }
}
