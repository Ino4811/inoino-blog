import { css, Style } from 'hono/css';

const footerClass = css`
  background-color: #444444;;
  color: #fff;
  text-align: center;
  padding: 15px 20px;
  position: relative;
  bottom: 0;
`;


export const Footer = () => {
  return (
    <footer class={footerClass}>
      <p> This site uses HonoX.</p>
      <p>&copy; 2024 @inoino-tech-blog</p>
    </footer>
  );
}