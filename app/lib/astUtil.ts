import { Root } from "mdast";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import yaml from 'js-yaml';

export type BlogMetadata = {
  title: string;
  date: string;
  tags: string[];
};

// TODO: 現状remark-frontmatterの構文は使用する予定がないため、remark-gfmのみを使用する想定
const parseMarkdown = remark().use(remarkFrontmatter).use(remarkGfm);
  
export const mdParser = async(markdown: string) => {

  const parsed = parseMarkdown.parse(markdown);
  const mdastRoot = await parseMarkdown.run(parsed);
  return mdastRoot as Root;
}


export const filterOutYaml = (ast: Root): Root => {
  // YAML ノードをフィルタで除外
  const filteredChildren = ast.children.filter((node) => node.type !== 'yaml');

  // 新しい AST を作成
  return {
    ...ast,
    children: filteredChildren, // YAML を除外した子ノード
  };
};

export const getMetadata = (ast: Root): BlogMetadata | undefined => {
  // YAML ノードを取得
  const metadataString = ast.children.find((node) => node.type === 'yaml')?.value;

  // YAML ノードをパース
  return metadataString ? (yaml.load(metadataString) as BlogMetadata) : undefined;
}

export const getBlogDescription = (ast: Root): string => {
  const description: string[] = [];
  // ASTを走査して最初の段落を見つける
  for (const node of ast.children) {
    if (node.type === 'paragraph') {
      // 段落のテキストを返す
      description.push(node.children.map(child => 'value' in child ? child.value : '').join('')); 
    }
  }
  return description.join('').slice(0, 200);
}