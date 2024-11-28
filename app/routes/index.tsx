import { css } from 'hono/css'
import { createRoute } from 'honox/factory'

  
export default createRoute((c) => {

  return c.render(
    <h1>Comming Soon!</h1>
  )
})
