import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import readme from "../README.md?raw";

function App() {
  const date = new Date(__BUILD_DATE__);

  console.log("Last build:", date);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = formatter.format(date).replace(",", " -");

  return (
    <div className="app">
      <span className="build-info">{`Last build: ${formattedDate}`}</span>
      <main className="markdown">
        <Markdown
          children={readme}
          remarkPlugins={[remarkGfm]}
          components={{
            p(props) {
              const { children, node, ...rest } = props;
              return node.children.some(
                (child) => child.tagName === "a"
              ) ? null : (
                <p {...rest}>{children}</p>
              );
            },
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  language={match[1] === "jsonc" ? "json" : match[1]}
                  style={vscDarkPlus}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        />
      </main>
      <footer className="footer">&copy; 2025 &ndash; Kasper Kouhia</footer>
    </div>
  );
}

export default App;
