import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "../components/CodeBlock";
import { Shared } from "../examples/Shared";
import code from "../examples/Shared?raw";

export const Route = createFileRoute("/shared")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Shared />
      <CodeBlock>{code}</CodeBlock>
    </>
  );
}
