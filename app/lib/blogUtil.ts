import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { TECH_BLOG_PATH } from './const';
import { getMetadata, mdParser } from './astUtil';

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

export const getAllBlogMdPaths = async (dir: string): Promise<string[]> => {
  let results: string[] = [];
  const list = await readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      // ディレクトリの場合、再帰的に探索
      const res = await getAllBlogMdPaths(filePath);
      results = results.concat(res);
    } else if (file.isFile() && path.extname(file.name) === '.md') {
      // Markdownファイルの場合、結果に追加
      results.push(filePath);
    }
  }
  return results;
};

// ブログコンテンツのパスからパラメータを抽出する関数
export const extractDateParamsFromPath = (path: string) => {
  const match = path.match(/content\/post\/tech-blog\/(\d{4})\/(\d{1,2})\/(\d{1,2})\/(.+)\.md$/);
  if (match) {
    const [, year, month, day, slug] = match;
    return { year, month, day, slug };
  }
  return null;
};

export const getAllBlogUrlList = async () => {
  const paths = await getAllBlogMdPaths(TECH_BLOG_PATH);
  const urls = paths.map((path) => {
    const params = extractDateParamsFromPath(path);
    if (params) {
      const { year, month, day, slug } = params;
      return `/tech-blog/${year}/${month}/${day}/${slug}`;
    }
  });
  return urls;
};

export const getBlogMetadataFromUrl = async (url: string) => {
  const match = url.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})\/(.+)$/);
  if (match) {
    const [, year, month, day, slug] = match;
    const blogContent = await getBlogContent({ year, month, day, slug });
    const postAst = blogContent ? await mdParser(blogContent) : undefined;
    const metadata = postAst ? getMetadata(postAst) : undefined;
    return metadata;
  }
  return undefined;
}


export const sortUrlByDate = (filePaths: string[]): string[] => {
  // DateParts型を定義
  type DateParts = {
    year: number;
    month: number;
    day: number;
  } | undefined;

  const tempFilePaths = [...filePaths];

  // 日付を抽出する関数
  const extractDateFromPath = (path: string): DateParts => {
    const match = path.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
    if (match) {
      const [, year, month, day] = match;
      return { year: parseInt(year, 10), month: parseInt(month, 10), day: parseInt(day, 10) };
    }
    return undefined;
  };

  // ソート処理
  return tempFilePaths.sort((a, b) => {
    const dateA = extractDateFromPath(a);
    const dateB = extractDateFromPath(b);

    if (!dateA || !dateB) {
      return 0;
    }

    // 年を比較
    if (dateA.year !== dateB.year) {
      return dateA.year - dateB.year;
    }

    // 月を比較
    if (dateA.month !== dateB.month) {
      return dateA.month - dateB.month;
    }

    // 日を比較
    return dateA.day - dateB.day;
  });
};