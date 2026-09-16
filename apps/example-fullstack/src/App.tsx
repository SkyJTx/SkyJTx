import { Title } from '@solidjs/meta';
import { Loading, type ParentProps } from 'solid-js';
import { paths, Router } from './router';
import './App.css';

export default function App() {
  return (
    <Router>
      {(props: ParentProps) => (
        <>
          <Title>Solid Fullstack</Title>
          <nav class="site-nav">
            <a href={paths()}>Home</a>
          </nav>
          <Loading fallback={<main>Loading…</main>}>{props.children}</Loading>
        </>
      )}
    </Router>
  );
}