import { Title } from '@solidjs/meta';
import logo from '../logo.svg';

export default function Home() {
  return (
    <main>
      <Title>Home - Solid Fullstack</Title>
      <img src={logo} class="logo" alt="Solid logo" />
      <h1>Solid Fullstack</h1>
      <p>A lean fullstack foundation powered by Solid 2 and Solid Router.</p>
      <a
        href="https://v2.solidjs.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </main>
  );
}