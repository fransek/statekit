import { ReactNode } from "@tanstack/react-router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const CodeBlock = ({ children }: { children: ReactNode }) => (
  <div className="overflow-auto w-full max-w-5xl">
    <SyntaxHighlighter language="tsx" style={oneDark}>
      {children}
    </SyntaxHighlighter>
  </div>
);
