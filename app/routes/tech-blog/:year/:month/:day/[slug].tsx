import { createRoute } from 'honox/factory';
import { extractDateParamsFromMdPath, getAllBlogMdPaths, getBlogMdString } from '../../../../../lib/blogUtil';
import { filterOutYaml, getBlogDescription, getBlogMetadata, mdParser } from '../../../../../lib/astUtil';
import { ssgParams } from 'hono/ssg';
import { BlogContent } from '../../../../../component/ui-parts/blogContent';
import { BlogHeader } from '../../../../../component/ui-parts/blogHeader';
import { getCanonicalUrl } from '../../../../../lib/utile';


export default createRoute(
  ssgParams(async () => {
    // ブログコンテンツのファイルパス一覧を取得
    const paths = await getAllBlogMdPaths(); // この関数は全てのブログ記事のパスを返すと仮定

    // 各パスからパラメータを抽出
    const params = paths
      .map(extractDateParamsFromMdPath)
      .filter((param): param is { year: string; month: string; day: string; slug: string } => param !== null);
    
    return params;
  }),
  async (c) => {
    const { year, month, day, slug } = c.req.param();

    const mdString = await getBlogMdString({ year, month, day, slug });
    const postAst = mdString ? await mdParser(mdString) : undefined;
    const metadata = postAst ? getBlogMetadata(postAst) : undefined;
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
          canonical: getCanonicalUrl(c),
        }
      )
    } else {
      return c.notFound();
    }
  }
);