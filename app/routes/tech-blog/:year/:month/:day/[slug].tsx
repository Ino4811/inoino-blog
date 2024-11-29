import { createRoute } from 'honox/factory';
import { extractParamsFromPath, getAllBlogPaths, getBlogContent } from '../../../../../lib/blogUtil';
import { mdParser } from '../../../../../lib/mdParser';
import { MdastRenderer } from '../../../../../component/ui-elements/mdastRenderer';
import { ssgParams } from 'hono/ssg';
import { TECH_BLOG_PATH } from '../../../../../lib/const';


export default createRoute(
  ssgParams(async () => {
    // ブログコンテンツのファイルパス一覧を取得
    const paths = await getAllBlogPaths(TECH_BLOG_PATH); // この関数は全てのブログ記事のパスを返すと仮定
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