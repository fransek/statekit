import { createStore, useStore } from "@fransek/statekit";
import { Link } from "@tanstack/react-router";
import { FC } from "react";

interface Props {
  routes: {
    path: string;
    title: string;
  }[];
}

export const Nav: FC<Props> = ({ routes }) => {
  const activeProps = {
    className: "text-sky-500",
  };

  const {
    state: { isOpen },
    actions: { close },
  } = useStore(navStore);

  return (
    <nav
      className={`flex-col gap-2 text-gray-400 text-lg border-r min-h-screen p-4 whitespace-nowrap bg-gray-900 absolute md:relative w-screen md:w-auto md:flex ${isOpen ? "flex" : "hidden"}`}
    >
      <h1 className="font-bold text-xl text-gray-200">Statekit examples</h1>
      {routes.map(({ path, title }) => (
        <Link key={path} to={path} activeProps={activeProps} onClick={close}>
          {title}
        </Link>
      ))}
    </nav>
  );
};

export const navStore = createStore(
  {
    isOpen: false,
  },
  (set) => ({
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    close: () => set({ isOpen: false }),
  }),
);
