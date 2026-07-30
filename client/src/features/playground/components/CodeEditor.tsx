import { useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { useAppSelector } from "@/app/hooks";
import { PlaygroundTab } from "../playground.types";

const languageMap: Record<PlaygroundTab, string> = {
  html: "html",
  css: "css",
  js: "javascript",
};

interface CodeEditorProps {
  activeTab: PlaygroundTab;
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({
  activeTab,
  value,
  onChange,
}: CodeEditorProps) => {
  const themeMode = useAppSelector(
    (state) => state.ui.themeMode
  );

  const editorRef =
    useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [fontSize, setFontSize] = useState(14);

  const [wordWrap, setWordWrap] = useState(true);

  const [minimap, setMinimap] = useState(false);

  const [cursor, setCursor] = useState({
    line: 1,
    column: 1,
  });

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e) => {
      setCursor({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });
  };

  return (
    <div className="flex flex-col h-full">
            {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: "var(--mui-palette-divider)" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFontSize((s) => Math.max(10, s - 1))}
            className="px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            A-
          </button>

          <span className="text-sm font-medium">
            {fontSize}px
          </span>

          <button
            onClick={() => setFontSize((s) => Math.min(24, s + 1))}
            className="px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            A+
          </button>

          <button
            onClick={() => setWordWrap((v) => !v)}
            className="px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {wordWrap ? "Wrap On" : "Wrap Off"}
          </button>

          <button
            onClick={() => setMinimap((v) => !v)}
            className="px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {minimap ? "Minimap On" : "Minimap Off"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() =>
              navigator.clipboard.writeText(value)
            }
          >
            Copy
          </button>

          <button
            className="px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() =>
              editorRef.current
                ?.getAction("editor.action.formatDocument")
                ?.run()
            }
          >
            Format
          </button>

          <button
            className="px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => {
              const extension =
                activeTab === "html"
                  ? "html"
                  : activeTab === "css"
                  ? "css"
                  : "js";

              const blob = new Blob([value], {
                type: "text/plain",
              });

              const url = URL.createObjectURL(blob);

              const a = document.createElement("a");

              a.href = url;
              a.download = `code.${extension}`;

              a.click();

              URL.revokeObjectURL(url);
            }}
          >
            Download
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={languageMap[activeTab]}
          value={value}
          onMount={handleEditorDidMount}
          onChange={(val) => onChange(val ?? "")}
          theme={themeMode === "dark" ? "vs-dark" : "light"}
          options={{
            fontSize,

            fontFamily: '"JetBrains Mono", monospace',

            fontLigatures: true,

            lineHeight: 24,

            minimap: {
              enabled: minimap,
            },

            wordWrap: wordWrap ? "on" : "off",

            automaticLayout: true,

            smoothScrolling: true,

            mouseWheelZoom: true,

            scrollBeyondLastLine: false,

            tabSize: 2,

            insertSpaces: true,

            formatOnPaste: true,

            formatOnType: true,

            folding: true,

            glyphMargin: true,

            quickSuggestions: true,

            parameterHints: {
              enabled: true,
            },

            guides: {
              indentation: true,
              bracketPairs: true,
            },

            bracketPairColorization: {
              enabled: true,
            },

            renderWhitespace: "selection",

            cursorBlinking: "smooth",

            cursorSmoothCaretAnimation: "on",

            padding: {
              top: 16,
              bottom: 16,
            },
          }}
        />
      </div>
            {/* Status Bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t text-xs"
        style={{
          borderColor: "var(--mui-palette-divider)",
          background:
            themeMode === "dark"
              ? "#1E1E1E"
              : "#F8F9FA",
        }}
      >
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <span className="font-medium uppercase">
            {languageMap[activeTab]}
          </span>

          <span>
            Ln {cursor.line}, Col {cursor.column}
          </span>

          <span>
            {value.split("\n").length} Lines
          </span>

          <span>
            {value.length} Characters
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <span>
            UTF-8
          </span>

          <span>
            Spaces: 2
          </span>

          <span>
            {themeMode === "dark"
              ? "VS Dark"
              : "VS Light"}
          </span>

          <span
            style={{
              color: "#22C55E",
              fontWeight: 600,
            }}
          >
            ● Ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
   