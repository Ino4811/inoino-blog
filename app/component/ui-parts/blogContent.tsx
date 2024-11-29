import { css } from 'hono/css';
import { Root } from 'mdast';
import { MdastRenderer } from '../ui-elements/mdastRenderer';

const content = css`
  background-color: #eeeeee;
  padding: 24px min(48px, 4vw);
  border-radius: min(12px, 1vw);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  margin: 24px 0;
`;

type Props = {
  contentAst: Root;
};

export const BlogContent = ({ contentAst }: Props) => {
  return (
    <div class={content}>
      <MdastRenderer nodes={contentAst.children} />
    </div>
  );
}