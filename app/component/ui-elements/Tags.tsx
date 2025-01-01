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
`;


const tagsStyle = css`
  color: #666;
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  display: flex;
  gap: 10px;
`

type Props = {
  tags: string[] | undefined;
};

const BlogTag = ({ tag }: { tag: string }) => {
  return <div class={tagStyle}>{tag}</div>;
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