import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "../components/CodeBlock";
import { Todo } from "../examples/Todo";
import code from "../examples/Todo?raw";

export const Route = createFileRoute("/todo")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Todo />
      <CodeBlock>{code}</CodeBlock>
    </>
  );
}
