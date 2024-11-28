import { readFile } from 'fs/promises';

type Param = {
  year: string;
  month: string;
  day: string;
  slug: string;
}

export const getBlogContent = async ({year, month, day, slug}: Param): Promise<string | undefined> => {
  try {
    const data: string = await readFile(`public/post/tech-blog/${year}/${month}/${day}/${slug}.md`, "utf8")
    return data;
  } catch {
    return undefined
  }
}