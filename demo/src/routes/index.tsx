import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "../components/CodeBlock";
import { Counter } from "../examples/Counter";
import code from "../examples/Counter?raw";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Counter />
      <CodeBlock>{code}</CodeBlock>
    </>
  );
}
