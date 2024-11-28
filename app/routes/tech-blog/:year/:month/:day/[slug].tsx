import { createRoute } from 'honox/factory';
import { getBlogContent } from '../../../../../lib/getBlogContent';
import { mdParser } from '../../../../../lib/mdParser';
import { MdastRenderer } from '../../../../../component/ui-elements/mdastRenderer';
import { ssgParams } from 'hono/ssg';
import { readdir } from 'fs/promises';
import path from 'path';

const getAllBlogPaths = async (dir: string): Promise<string[]> => {
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
const extractParamsFromPath = (path: string) => {
  const match = path.match(/public\/post\/tech-blog\/(\d{4})\/(\d{1,2})\/(\d{1,2})\/(.+)\.md$/);
  if (match) {
    const [, year, month, day, slug] = match;
    return { year, month, day, slug };
  }
  return null;
};

export default createRoute(
  ssgParams(async () => {
    // ブログコンテンツのファイルパス一覧を取得
    const paths = await getAllBlogPaths("public/post/tech-blog"); // この関数は全てのブログ記事のパスを返すと仮定
    console.log(paths)

    // 各パスからパラメータを抽出
    const params = paths
      .map(extractParamsFromPath)
      .filter((param): param is { year: string; month: string; day: string; slug: string } => param !== null);

    console.log(params)
    return params;
  }),
  async (c) => {
    const { year, month, day, slug } = c.req.param();
    
    const blogContent = await getBlogContent({ year, month, day, slug });
      
    const postAst = blogContent ? await mdParser(blogContent) : undefined;

    if (postAst) {
      return c.render(
          <MdastRenderer nodes={postAst.children} />
      )
    } else {
      return c.notFound();
    }
  }
);