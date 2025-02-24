import { FC } from "hono/jsx";
import type { RootContent, RootContentMap } from "mdast";
import { css } from "hono/css";
import { createHighlighter } from "shiki"
import { JSDOM } from 'jsdom';
import { TECH_BLOG_IMAGE_PATH } from "../../lib/const";
import { chromium } from "playwright";

const gray = "rgba(33, 90, 160, 0.07)";

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

const code = css`
  display: inline-block;
  padding: 0 0.4em;
  background: ${gray}; // $c-contrast と同じ色
  font-size: 0.85em;
  border-radius: 0.4em;
  vertical-align: 0.08em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
`;

const InlineCodeNode: FC<{ node: RootContentMap["inlineCode"] }> = ({
  node,
}) => {
  return <code class={code}>{node.value}</code>;
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

const linkCard = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background: #f5f5f5;
  margin: 8px 0;
  border: 1px solid #dddddd;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  &:hover {
    background: #f0f0f0;
  }
  &:active {
    color: #4b4b4b;
  }
`;

const linkCardImage = css`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const cardTitle = css`
  font-size: 14px;
  font-weight: 600;
  flex: 1 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #333333;
`;


const getIconByJsdom = async ( nodeUrl: string ) => {
  const htmlRes = await fetch(nodeUrl);
  if (!htmlRes.ok) {
    throw new Error(`Failed to fetch ${nodeUrl}`);
  }
  const text = await htmlRes.text();
  const doc = new JSDOM(text).window;
  const title = doc.document.title;
  const favicon =
    doc.document.querySelector('link[rel="icon"]')?.getAttribute('href') ||
    doc.document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
    '';
  return { title, faviconAbsoluteUrl: favicon ? new URL(favicon, nodeUrl).toString() : '' };
}

const getIconByPlaywright = async (url: string) => {

  console.log(`getIconByPlaywright...${url}`);
  
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log(`goto...${url}`);

  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 6000000,
  });

  console.log(`getting data...${url}`);

  const title = await page.title();

  const faviconElement =
    (await page.$('link[rel="icon"]')) ||
    (await page.$('link[rel="shortcut icon"]'));
  const favicon = faviconElement ? ((await faviconElement.getAttribute('href')) ?? '') : '';

  console.log(`getting data...${url}`);
  
  await browser.close();
  
  console.log(`got data and close browser...${url}`);

  return { title, faviconAbsoluteUrl: favicon ? new URL(favicon, url).toString() : '' };
}

const fetchIcon = async (url: string) => {
  const jsdomResult = await getIconByJsdom(url);
  if (jsdomResult.title && jsdomResult.faviconAbsoluteUrl) return jsdomResult;

  const playwrightResult = await getIconByPlaywright(url);
  if (playwrightResult.title && playwrightResult.faviconAbsoluteUrl) return playwrightResult;

  return {
    title: url,
    faviconAbsoluteUrl: `/static/images/defaultIcon.svg`,
  };
};


const LinkNode: FC<{ node: RootContentMap["link"] }> = async ({ node }) => {
  console.log(`creating linkcard...${node.url}`);

  const { title, faviconAbsoluteUrl } = await fetchIcon(node.url);

  return (
    <a href={node.url} target="_blank" rel="noopener noreferrer" className={linkCard}>
      <img className={linkCardImage} src={faviconAbsoluteUrl} alt="icon" />
      <span className={cardTitle}>{title}</span>
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
  return <img width={'auto'} height={'auto'} style={{ display: 'block', margin: '0 auto', maxHeight: '600px', maxWidth: '100%'}} src={`${TECH_BLOG_IMAGE_PATH}${node.url}`} alt={node.alt ?? ""} />;
};


// preタグのbackground-colorはstyleで指定されるため、!importantをつける
const shiki = css`
  :-hono-global {
    pre {
      margin: 1.3rem 0;
      background: ${gray} !important;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 0.25rem;
        background-color: rgba(0, 0, 0, 0.2);
      }
      border-radius: 0.4rem;
      word-break: normal; // iOSで折り返されるのを防ぐ
      word-wrap: normal; // iOSで折り返されるのを防ぐ
      /* flex + codeの隣に疑似要素を配置することで横スクロール時の右端の余白を作る */
      display: flex;
      &::after {
        content: '';
        width: 8px;
        flex-shrink: 0;
      }
    } 
    code {
      margin: 0;
      padding: 0;
      background: transparent;
      font-size: 0.9rem;
      color: #333;
      display: block;
      padding: 1.1rem; // このようにしないとpreのスクロールバーがコードに重なってしまう
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      -webkit-font-smoothing: antialiased;
    }
  }
`;


const CodeNode: FC<{ node: RootContentMap["code"] }> = async ({ node }) => {

  const highlighter = await createHighlighter({
    themes: ['github-light'],
    langs: [node.lang || 'txt'],
  })

  const code = highlighter.codeToHtml(node.value, {
    theme: 'github-light',
    lang: node.lang || 'txt',
  })

  return (
    <div class={shiki} dangerouslySetInnerHTML={{ __html: code }} />
  );
};

const DeleteNode: FC<{ node: RootContentMap["delete"] }> = ({ node }) => {
  return (
    <del>
      <MdastRenderer nodes={node.children} />
    </del>
  );
};


const table = css`
  :-hono-global {
    table {
      margin: 1.2rem auto;
      width: auto;
      border-collapse: collapse;
      font-size: 0.95em;
      line-height: 1.5;
      word-break: normal; // Layout will break without this.
      display: block;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    th,
    td {
      padding: 0.5rem;
      background: #f7f7f7;
    }
    th {
      font-weight: 700;
      background: #e9e4e3;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
    }
  }
`;

const TableNode: FC<{ node: RootContentMap["table"] }> = ({ node }) => {
  const [headRow, ...bodyRows] = node.children;
  return (
    <table class={table}>
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
