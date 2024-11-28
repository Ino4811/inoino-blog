import { css } from 'hono/css'
import { createRoute } from 'honox/factory'
import { mdParser } from '../lib/mdParser'
import { MdastRenderer } from '../component/ui-elements/mdastRenderer'

const className = css`
  font-family: sans-serif;
`

  const content = `# Comming Soon`
const postAst = await mdParser(content)
  
export default createRoute((c) => {
  const name = c.req.query('name') ?? 'Hono'
  console.log(postAst)

  return c.render(
    <div class={className}>
      <h1>Hello, {name}!</h1>
      <MdastRenderer nodes={postAst.children} />
    </div>,
    { title: name }
  )
})
