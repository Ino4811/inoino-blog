import { css } from 'hono/css';
import { BlogMetadata } from '../../lib/astUtil';

const card = css`
  text-decoration: none;
`;

const content = css`
  background-color: #f5f5f5;
  padding: 12px min(24px, 2vw);
  border-radius: min(6px, 2vw);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
      <a class={card} href={url}>
        <div class={content}>
          <div class={title}>{metadata.title}</div>
          <div class={date}>{metadata.date}</div>
        </div>
      </a>
  );
}