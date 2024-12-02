import { css } from 'hono/css';
import { Root } from 'mdast';
import { MdastRenderer } from '../ui-elements/mdastRenderer';
import { ProfileMetadata } from '../../lib/utile';

const content = css`
  background-color: #f5f5f5;
  padding: 24px min(48px, 4vw);
  border-radius: min(12px, 1vw);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin: 24px 0;
`;

type Props = {
  contentAst: Root;
  metadata: ProfileMetadata | undefined;
};

export const ProfileCard = ({ contentAst, metadata }: Props) => {
  return (
    <div class={content}>
      {/* {metadata && <h1>{metadata.name}</h1>} */}
      <MdastRenderer nodes={contentAst.children} />
    </div>
  );
}