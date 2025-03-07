import { css, Style } from 'hono/css';

const headerClass = css`
  background-color: #444444;
  color: #fff;
  padding: 20px 30px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const linkClass = css`
  color: #cdd0ff;
  text-decoration: none;
  margin: 0 5px;
  &:hover {
    color: #f4f5ff;
  }
`;

const log = css`
  font-size: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
`

export const Header = () => {
  return (
    <header class={headerClass}>
      <div class={log}>
        <img height="36px" src="/favicon.ico" />
        <b> inoino-blog</b>
      </div>
      <nav>
        <a href="/profile" class={linkClass}> Profile </a>
        <a href="/" class={linkClass}> Home </a>
      </nav>
    </header>
  );
}