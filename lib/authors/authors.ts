export type Author = {
  id: string;
  name: string;
  title: string;
  bio: string;
  credentials?: string;
  headshot?: string;
};

const authors = {
  founder: {
    id: "founder",
    name: "Nicholas M.",
    title: "Founder / Product Builder of 401kcalc",
    bio: "Builds transparent retirement planning tools focused on practical assumptions, clear methodology, and conservative scenario analysis.",
    credentials: "Product builder focused on retirement planning calculators and educational content design.",
  },
} as const satisfies Record<string, Author>;

export type AuthorId = keyof typeof authors;

export function getAuthorById(id: AuthorId): Author {
  return authors[id];
}

export function getAllAuthors(): Author[] {
  return Object.values(authors);
}
