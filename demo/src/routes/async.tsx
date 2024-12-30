import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "../components/CodeBlock";
import { Async } from "../examples/Async";
import code from "../examples/Async?raw";

export const Route = createFileRoute("/async")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Async />
      <CodeBlock>{code}</CodeBlock>
    </>
  );
}
