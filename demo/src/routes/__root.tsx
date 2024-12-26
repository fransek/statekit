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
  { path: "/global", title: "Global store" },
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
      <div className="flex flex-col gap-2 text-lg border-r min-h-screen p-4">
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
      </div>
      <main className="p-4">
        <h1 className="font-bold text-lg mb-4">
          {routes.find(({ path }) => path === pathname)?.title}
        </h1>
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
