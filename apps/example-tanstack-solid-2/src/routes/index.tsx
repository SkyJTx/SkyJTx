import { createFileRoute } from '@tanstack/solid-router';
import logo from '../logo.svg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Home - SkyJT' }] }),
  component: Home,
});

function Home() {
  return (
    <main>
      <img src={logo} class="logo" alt="Solid logo" />
      <h1>SkyJT</h1>
      <p>SolidJS fullstack application powered by TanStack Router.</p>
    </main>
  );
}

