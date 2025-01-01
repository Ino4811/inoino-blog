import { css } from 'hono/css';
import { BlogMetadata } from '../../lib/astUtil';
import { BlogTags } from '../ui-elements/Tags';

const link = css`
  position: absolute;
  inset: 0;
`;

const content = css`
  position: relative;
  background-color: #f5f5f5;
  padding: 12px min(24px, 2vw);
  border-radius: min(6px, 2vw);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  &:hover {
	  cursor: pointer;
    transform: scale(1.01);
  }
`;

const title = css`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  align-items: center;
  text-decoration: none;
`;

const date = css`
  color: #666;
  font-size: 14px;
  font-weight: 700;
  align-items: center;
  text-align: right;
`;


type Props = {
  metadata: BlogMetadata;
  url: string;
};

export const BlogCard = ({ metadata, url }: Props) => {
  return (
      <div class={content}>
        <a class={link} href={url}></a>
        <div class={title}>{metadata.title}</div>
        {metadata.tags &&
          <BlogTags tags={metadata.tags}/>
        }
        <div class={date}>{metadata.date}</div>
      </div>
  );
}