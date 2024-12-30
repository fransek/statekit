import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "../components/CodeBlock";
import { Context } from "../examples/Context";
import code from "../examples/Context?raw";

export const Route = createFileRoute("/context")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Context />
      <CodeBlock>{code}</CodeBlock>
    </>
  );
}
