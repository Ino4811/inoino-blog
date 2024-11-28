import { createRoute } from 'honox/factory';
import { getBlogContent } from '../../../../../lib/getBlogContent';
import { mdParser } from '../../../../../lib/mdParser';
import { MdastRenderer } from '../../../../../component/ui-elements/mdastRenderer';

  

export default createRoute(async (c) => {
  const { year, month, day, slug } = c.req.param();
  
  const blogContent = await getBlogContent({ year, month, day, slug });
    
  const postAst = blogContent ? await mdParser(blogContent) : undefined;

  return c.render(
    <>
      {postAst ? 
        <MdastRenderer nodes={postAst.children} />
        :
        <p>404 Error</p>
      }
    </>
  );
});