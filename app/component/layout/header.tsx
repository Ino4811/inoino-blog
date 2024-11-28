import { css, Style } from 'hono/css';

const headerClass = css`
  background-color: #333;
  color: #fff;
  padding: 20px 30px;
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
`

export const Header = () => {
  return (
    <header class={headerClass}>
      <div class={log}><b>@inoino-tech-blog</b></div>
      <nav>
        <a href="/" class={linkClass}>Home</a>
      </nav>
    </header>
  );
}