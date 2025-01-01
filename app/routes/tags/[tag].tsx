import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { getAllBlogTags, getBlogMetadataFromUrl, getBlogUrlListByTag, sortBlogUrlByDate } from "../../lib/blogUtil";
import { getCanonicalUrl } from "../../lib/utile";
import { BlogCard } from "../../component/ui-parts/blogCard";

export default createRoute(
  ssgParams(async () => {
    // 存在するtagの一覧を取得
    const tags = await getAllBlogTags(); // この関数は全てのタグを返すと仮定
    const tagArray = [...tags];
    const params = tagArray.map((tag) => ({ tag }));
    return params;
  }),
  async (c) => {
    const { tag } = c.req.param();

    const urls = await getBlogUrlListByTag(tag);
    const sortedBlogUrlList = sortBlogUrlByDate(urls);

    if (tag) {
      return c.render(
        <div>
          <h1>Tag: { tag }</h1>
          {sortedBlogUrlList.map(async (url) => {
            // urlからブログのメタデータを取得
            const metadata = await getBlogMetadataFromUrl(url);
            if (!metadata) {
              return null;
            }
            return (
              <BlogCard url={url} metadata={metadata} />
            );
          })}
        </div>
        ,
        {
          title: "inoino-blog",
          description: `inoino-blogの${tag}の記事一覧ページです`,
          canonical: getCanonicalUrl(c),
        }
      )
    } else {
      return c.notFound();
    }
  }
);