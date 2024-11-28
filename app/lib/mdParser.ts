import { Root } from "mdast";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";


// TODO: 現状remark-frontmatterの構文は使用する予定がないため、remark-gfmのみを使用する想定
const parseMarkdown = remark().use(remarkFrontmatter).use(remarkGfm);
  
export const mdParser = async(markdown: string) => {

  const parsed = parseMarkdown.parse(markdown);
  const mdastRoot = await parseMarkdown.run(parsed);
  return mdastRoot as Root;
}