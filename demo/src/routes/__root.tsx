import {
  Link,
  Outlet,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { FileRouteTypes } from "../routeTree.gen";

export const Route = createRootRoute({
  component: RootComponent,
});

const routes: {
  path: FileRouteTypes["to"];
  title: string;
}[] = [
  { path: "/counter", title: "Counter" },
  { path: "/context", title: "Counter with context" },
  { path: "/persistent", title: "Counter with persistent state" },
  { path: "/todo", title: "Todo app" },
  { path: "/async", title: "Async" },
  { path: "/shared", title: "Shared store" },
];

function RootComponent() {
  const activeProps = {
    className: "text-blue-500",
  };

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <div className="flex">
      <nav className="flex flex-col gap-2 text-lg border-r min-h-screen p-4">
        <Link
          to="/"
          className="font-bold"
          activeProps={activeProps}
          activeOptions={{ exact: true }}
        >
          <h1>Demo</h1>
        </Link>
        {routes.map(({ path, title }) => (
          <Link key={path} to={path} activeProps={activeProps}>
            {title}
          </Link>
        ))}
      </nav>
      <div className="w-full">
        <header className="p-4 w-full">
          <h1 className="font-bold text-lg">
            {routes.find(({ path }) => path === pathname)?.title || "Demo"}
          </h1>
        </header>
        <hr />
        <main className="p-4 w-full">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
