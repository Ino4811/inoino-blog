import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { TECH_BLOG_PATH } from './const';

type Param = {
  year: string;
  month: string;
  day: string;
  slug: string;
}

export const getBlogContent = async ({year, month, day, slug}: Param): Promise<string | undefined> => {
  try {
    const data: string = await readFile(`${TECH_BLOG_PATH}/${year}/${month}/${day}/${slug}.md`, "utf8")
    return data;
  } catch {
    return undefined
  }
}

export const getAllBlogPaths = async (dir: string): Promise<string[]> => {
  let results: string[] = [];
  const list = await readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      // ディレクトリの場合、再帰的に探索
      const res = await getAllBlogPaths(filePath);
      results = results.concat(res);
    } else if (file.isFile() && path.extname(file.name) === '.md') {
      // Markdownファイルの場合、結果に追加
      results.push(filePath);
    }
  }
  return results;
};

// ブログコンテンツのパスからパラメータを抽出する関数
export const extractParamsFromPath = (path: string) => {
  const match = path.match(/public\/static\/post\/tech-blog\/(\d{4})\/(\d{1,2})\/(\d{1,2})\/(.+)\.md$/);
  if (match) {
    const [, year, month, day, slug] = match;
    return { year, month, day, slug };
  }
  return null;
};