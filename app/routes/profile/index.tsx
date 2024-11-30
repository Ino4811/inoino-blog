import { css } from 'hono/css'
import { createRoute } from 'honox/factory'

  
export default createRoute( async(c) => {

  return c.render(
    <>
    </>
    ,
    {
      title: "inoino-blog",
    }
  )
})
