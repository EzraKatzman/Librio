const CANONICAL_GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Thriller",
  "Crime",
  "Romance",
  "Historical",
  "Science Fiction",
  "Fantasy",
  "Horror",
  "Young Adult",
  "Children’s",
  "Biography",
  "Memoir",
  "Self-Help",
  "Personal Development",
  "Travel",
  "Adventure",
  "Poetry",
  "Drama",
  "Graphic Novel",
  "Classic Literature",
  "Religion / Spirituality",
  "Philosophy",
  "Science / Technology",
  "Art / Photography",
  "Cookbooks / Food",
  "True Crime",
  "Health & Fitness",
  "Humor / Satire",
];

export function parseGenres(rawCategories: string[] = [], rawSubjects: string[] = []): string[] {
  const combined = [...(rawCategories || []), ...(rawSubjects || [])];
  const normalizedGenres: Set<string> = new Set();

  combined.forEach(str => {
    const s = str.toLowerCase();

    if (s.includes("science fiction") || s.includes("sci-fi")) normalizedGenres.add("Science Fiction");
    else if (s.includes("fantasy")) normalizedGenres.add("Fantasy");
    else if (s.includes("mystery") || s.includes("detective")) normalizedGenres.add("Mystery");
    else if (s.includes("thriller")) normalizedGenres.add("Thriller");
    else if (s.includes("crime") || s.includes("true crime")) normalizedGenres.add("Crime");
    else if (s.includes("romance")) normalizedGenres.add("Romance");
    else if (s.includes("historical")) normalizedGenres.add("Historical");
    else if (s.includes("biography")) normalizedGenres.add("Biography");
    else if (s.includes("memoir")) normalizedGenres.add("Memoir");
    else if (s.includes("self-help") || s.includes("personal development")) normalizedGenres.add("Self-Help");
    else if (s.includes("children") || s.includes("kids")) normalizedGenres.add("Children’s");
    else if (s.includes("young adult") || s.includes("ya")) normalizedGenres.add("Young Adult");
    else if (s.includes("horror")) normalizedGenres.add("Horror");
    else if (s.includes("poetry")) normalizedGenres.add("Poetry");
    else if (s.includes("drama")) normalizedGenres.add("Drama");
    else if (s.includes("graphic") || s.includes("comic")) normalizedGenres.add("Graphic Novel");
    else if (s.includes("classic")) normalizedGenres.add("Classic Literature");
    else if (s.includes("religion") || s.includes("spiritual")) normalizedGenres.add("Religion / Spirituality");
    else if (s.includes("philosophy")) normalizedGenres.add("Philosophy");
    else if (s.includes("science") || s.includes("technology")) normalizedGenres.add("Science / Technology");
    else if (s.includes("art") || s.includes("photography")) normalizedGenres.add("Art / Photography");
    else if (s.includes("cook") || s.includes("food") || s.includes("recipe")) normalizedGenres.add("Cookbooks / Food");
    else if (s.includes("travel")) normalizedGenres.add("Travel");
    else if (s.includes("adventure") || s.includes("action")) normalizedGenres.add("Adventure");
    else if (s.includes("humor") || s.includes("satire") || s.includes("funny")) normalizedGenres.add("Humor / Satire");
    else normalizedGenres.add("Fiction"); // fallback
  });

  return Array.from(normalizedGenres);
}
