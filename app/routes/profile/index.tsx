import { css } from 'hono/css'
import { createRoute } from 'honox/factory'
import { ProfileCard } from '../../component/ui-parts/profileCard'
import { getCanonicalUrl, getProfileContentString, getProfileMetadata } from '../../lib/utile'
import { filterOutYaml, mdParser } from '../../lib/astUtil'

  
export default createRoute(async (c) => {

  const contentString = await getProfileContentString();
  if (!contentString) {
    return c.notFound();
  }

  const profileAst = await mdParser(contentString);
  const metadata = getProfileMetadata(profileAst);
  const contentAst = filterOutYaml(profileAst);

  return c.render(
    <>
      <ProfileCard metadata={metadata} contentAst={contentAst} />
    </>
    ,
    {
      title: "inoino-blog",
      description: "inoinoのProfileページです",
      canonical: getCanonicalUrl(c),
    }
  )
})
