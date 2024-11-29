import { FC } from "hono/jsx";
import type { RootContent, RootContentMap } from "mdast";

type Props = {
  key?: string;
  nodes: RootContent[];
};

export const MdastRenderer: FC<Props> = ({ nodes }) => {
  const component = nodes.map((node, index) => {
    switch (node.type) {
      case "text": {
        return <TextNode node={node} />;
      }
      case "paragraph": {
        return <ParagraphNode node={node} />;
      }
      case "heading": {
        return <HeadingNode node={node} />;
      }
      case "inlineCode": {
        return <InlineCodeNode node={node} />;
      }
      case "blockquote": {
        return <BlockQuoteNode node={node} />;
      }
      case "link": {
        return <LinkNode node={node} />;
      }
      case "list": {
        return <ListNode node={node} />;
      }
      case "listItem": {
        return <ListItemNode node={node} />;
      }
      case "strong": {
        return <StrongNode node={node} />;
      }
      case "image": {
        return <ImageNode node={node} />;
      }
      case "code": {
        return <CodeNode node={node} />;
      }
      case "delete": {
        return <DeleteNode node={node} />;
      }
      case "table": {
        return <TableNode node={node} />;
      }
      case "html": {
        return <HTMLNode node={node} />;
      }
      case "break": {
        return <br />;
      }
      // TODO: いらないかもしれない
      case "footnoteReference": {
        return <FootnoteReferenceNode node={node} />;
      }
      case "footnoteDefinition": {
        return <FootnoteDefinitionNode node={node} />;
      }
      default: {
        return <div key={index}>node: {node.type}</div>;
      }
    }
  });

  return <>{component}</>;
};

const TextNode: FC<{ node: RootContentMap["text"] }> = ({ node }) => {
  return <>{node.value}</>;
};

const ParagraphNode: FC<{ node: RootContentMap["paragraph"] }> = ({ node }) => {
  return (
    <p>
      <MdastRenderer nodes={node.children} />
    </p>
  );
};

const HeadingNode: FC<{ node: RootContentMap["heading"] }> = ({ node }) => {
  const Component = (
    {
      1: "h1",
      2: "h2",
      3: "h3",
      4: "h4",
      5: "h5",
      6: "h6",
    } as const
  )[node.depth];

  // TODO: idを設定する(目次等のリンクに必要)

  return (
    <Component>
      <MdastRenderer nodes={node.children} />
    </Component>
  );
};

const InlineCodeNode: FC<{ node: RootContentMap["inlineCode"] }> = ({
  node,
}) => {
  return <code>{node.value}</code>;
};

const BlockQuoteNode: FC<{ node: RootContentMap["blockquote"] }> = ({
  node,
}) => {
  return (
    <blockquote>
      <MdastRenderer nodes={node.children} />
    </blockquote>
  );
};

const LinkNode: FC<{ node: RootContentMap["link"] }> = ({ node }) => {
  return (
    <a href={node.url} target="_blank" rel="noreferrer">
      <MdastRenderer nodes={node.children} />
    </a>
  );
};

const ListNode: FC<{ node: RootContentMap["list"] }> = ({ node }) => {
  return node.ordered ? (
    <ol>
      <MdastRenderer nodes={node.children} />
    </ol>
  ) : (
    <ul>
      <MdastRenderer nodes={node.children} />
    </ul>
  );
};

const ListItemNode: FC<{ node: RootContentMap["listItem"] }> = ({ node }) => {
  if (node.children.length === 1 && node.children[0].type === "paragraph") {
    return (
      <li>
        {node.checked !== null && (
          <input type="checkbox" checked={node.checked} />
        )}
        <MdastRenderer nodes={node.children[0].children} />
      </li>
    );
  }

  return (
    <li>
      {node.checked !== null && (
        <input type="checkbox" checked={node.checked} />
      )}
      <MdastRenderer nodes={node.children} />
    </li>
  );
};

const StrongNode: FC<{ node: RootContentMap["strong"] }> = ({ node }) => {
  return (
    <strong>
      <MdastRenderer nodes={node.children} />
    </strong>
  );
};

const ImageNode: FC<{ node: RootContentMap["image"] }> = ({ node }) => {
  // TODO srcの設定はどうするか考える
  // return <img src={`${ASSETS_PREFIX_PATH}${node.url}`} alt={node.alt ?? ""} />;
  return <img src={`${node.url}`} alt={node.alt ?? ""} />;
};

const CodeNode: FC<{ node: RootContentMap["code"] }> = async ({ node }) => {
  return (
    <pre>
      <code>{node.value}</code>
    </pre>
  );
};

const DeleteNode: FC<{ node: RootContentMap["delete"] }> = ({ node }) => {
  return (
    <del>
      <MdastRenderer nodes={node.children} />
    </del>
  );
};

const TableNode: FC<{ node: RootContentMap["table"] }> = ({ node }) => {
  const [headRow, ...bodyRows] = node.children;
  return (
    <table>
      <thead>
        <tr>
          {headRow.children.map((cell, index) => (
            <th
              key={index}
              style={{ textAlign: node.align?.[index] ?? undefined }}
            >
              <MdastRenderer nodes={cell.children} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, index) => (
          <tr key={index}>
            {row.children.map((cell, index) => (
              <td
                key={index}
                style={{ textAlign: node.align?.[index] ?? undefined }}
              >
                <MdastRenderer nodes={cell.children} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const HTMLNode: FC<{ node: RootContentMap["html"] }> = ({ node }) => {
  return <div dangerouslySetInnerHTML={{ __html: node.value }} />;
};

const FootnoteReferenceNode: FC<{
  node: RootContentMap["footnoteReference"];
}> = ({ node }) => {
  return (
    <sup>
      <a
        id={`ref-${encodeURIComponent(node.identifier)}`}
        href={`#${encodeURIComponent(node.identifier)}`}
      >
        [{node.identifier}]
      </a>
    </sup>
  );
};

const FootnoteDefinitionNode: FC<{
  node: RootContentMap["footnoteDefinition"];
}> = ({ node }) => {
  return (
    <li id={encodeURIComponent(node.identifier)}>
      <MdastRenderer nodes={node.children} />
    </li>
  );
};