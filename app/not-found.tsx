import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__grid" aria-hidden="true" />
      <p className="eyebrow">ERROR / ROUTE_NOT_FOUND</p>
      <h1>Nothing is listening on this path.</h1>
      <p>The system is healthy. This route simply does not exist.</p>
      <Link className="button button--primary" href="/">
        Return to system
      </Link>
    </main>
  );
}
