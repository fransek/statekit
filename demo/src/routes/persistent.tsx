import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "../components/CodeBlock";
import { Persistent } from "../examples/Persistent";
import code from "../examples/Persistent?raw";

export const Route = createFileRoute("/persistent")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Persistent />
      <CodeBlock>{code}</CodeBlock>
    </>
  );
}
