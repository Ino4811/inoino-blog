import { css } from 'hono/css';

const tagStyle = css`
  background-color: #777;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  display: inline-block;
  text-decoration: none;
  z-index: 1;
  vertical-align: text-bottom;
  &:hover {
    background-color: #555;
  }
`;


const tagsStyle = css`
  color: #666;
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  display: flex;
  gap: 10px;
  line-height: 1;
`

type Props = {
  tags: string[] | undefined;
};

const BlogTag = ({ tag }: { tag: string }) => {
  const url = `/tags/${tag}`;
  return (
    <a href={url} class={tagStyle}>
      {tag}
    </a>
  );
}

export const BlogTags = ({ tags }: Props) => {
  return (
    <div class={tagsStyle}>
      {tags?.map((tag) => (
        <BlogTag tag={tag}/>
      ))}
    </div>
  );
}