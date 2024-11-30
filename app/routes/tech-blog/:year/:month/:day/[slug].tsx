import { createRoute } from 'honox/factory';
import { extractDateParamsFromPath, getAllBlogMdPaths, getBlogContent } from '../../../../../lib/blogUtil';
import { filterOutYaml, getBlogDescription, getMetadata, mdParser } from '../../../../../lib/astUtil';
import { ssgParams } from 'hono/ssg';
import { TECH_BLOG_PATH } from '../../../../../lib/const';
import { BlogContent } from '../../../../../component/ui-parts/blogContent';
import { BlogHeader } from '../../../../../component/ui-parts/blogHeader';


export default createRoute(
  ssgParams(async () => {
    // ブログコンテンツのファイルパス一覧を取得
    const paths = await getAllBlogMdPaths(TECH_BLOG_PATH); // この関数は全てのブログ記事のパスを返すと仮定

    // 各パスからパラメータを抽出
    const params = paths
      .map(extractDateParamsFromPath)
      .filter((param): param is { year: string; month: string; day: string; slug: string } => param !== null);
    
    return params;
  }),
  async (c) => {
    const { year, month, day, slug } = c.req.param();

    const blogContent = await getBlogContent({ year, month, day, slug });
    const postAst = blogContent ? await mdParser(blogContent) : undefined;
    const metadata = postAst ? getMetadata(postAst) : undefined;
    const contentAst = postAst ? filterOutYaml(postAst) : undefined;
    const description = contentAst ? getBlogDescription(contentAst) : '';

    if (contentAst && metadata) {
      return c.render(
        <>
          <BlogHeader metadata={metadata} />
          <BlogContent contentAst={contentAst} />
        </>
        ,
        {
          title: metadata.title,
          description: description,
        }
      )
    } else {
      return c.notFound();
    }
  }
);