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
  { path: "/", title: "Basic counter" },
  { path: "/context", title: "Counter + context" },
  { path: "/persistent", title: "Counter + persistent state" },
  { path: "/todo", title: "Todo app" },
  { path: "/async", title: "Async actions" },
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
      <nav className="flex flex-col gap-2 text-lg border-r min-h-screen p-4 whitespace-nowrap">
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
