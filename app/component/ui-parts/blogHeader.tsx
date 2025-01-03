import { css } from 'hono/css';
import { BlogMetadata } from '../../lib/astUtil';
import { BlogTags } from '../ui-elements/Tags';

const blogHeaderContainer = css`
  display: flex;
  flex-direction: column;
  margin: min(52px, 4vw) 0;
  align-items: center;
  gap: 8px;
`;

const title = css`
  font-size: 32px;
  font-weight: 600;
`;

const date = css`
  display: flex;
  gap: 4px;
  color: #666;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
`;

type Props = {
  metadata: BlogMetadata;
};

export const BlogHeader = ({ metadata }: Props) => {
  return (
    <div class={blogHeaderContainer}>
      <div class={title}>
        {metadata?.title}
      </div>
      <div class={date}>
        <img height={'14px'} src='/static/images/pen.svg' />
        <div>{metadata?.date}</div>
      </div>
      <BlogTags tags={metadata?.tags} />
    </div>
  );
}