import { ReactNode } from "@tanstack/react-router";
import { FC, useState } from "react";
import { CodeBlock } from "./CodeBlock";

interface Props {
  children: ReactNode;
  code: ReactNode;
}

export const CodeToggle: FC<Props> = ({ code, children: children }) => {
  const [showCode, setShowCode] = useState(false);
  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={() => setShowCode(false)}
          className={`border-0 hover:underline p-0 ${!showCode ? "text-sky-500" : "text-gray-400"}`}
        >
          Preview
        </button>
        <button
          onClick={() => setShowCode(true)}
          className={`border-0 hover:underline p-0 ${showCode ? "text-sky-500" : "text-gray-400"}`}
        >
          Code
        </button>
      </div>
      {showCode ? <CodeBlock>{code}</CodeBlock> : children}
    </>
  );
};
