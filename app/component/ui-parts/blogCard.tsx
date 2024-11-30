import { css } from 'hono/css';
import { MdastRenderer } from '../ui-elements/mdastRenderer';

const content = css`
  background-color: #eeeeee;
  padding: 24px min(48px, 4vw);
  border-radius: min(12px, 1vw);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  margin: 24px 0;
`;

type Props = {
};

export const BlogContent = ({  }: Props) => {
  return (
    <div class={content}>
    </div>
  );
}