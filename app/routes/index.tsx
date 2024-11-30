import { css } from 'hono/css'
import { createRoute } from 'honox/factory'
import { getAllBlogUrlList, getBlogMetadataFromUrl, sortUrlByDate } from '../lib/blogUtil';
import { BlogCard } from '../component/ui-parts/blogCard';

  
export default createRoute( async(c) => {

  const blogUrlList: string[] = (await getAllBlogUrlList()).filter((url): url is string => url !== undefined);
  const sortedBlogUrlList = sortUrlByDate(blogUrlList);

  return c.render(
    <>
      <h1>記事一覧</h1>
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
    </>
  )
})
