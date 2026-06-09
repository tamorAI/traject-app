"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Unplug } from "lucide-react";
import { Button } from "@base-ui/react";

type TokenKind = "keyword" | "string" | "muted" | "normal";

interface Token {
  text: string;
  kind: TokenKind;
}

interface SnippetLine {
  tokens: Token[];
  diff?: boolean;
}

interface TabDef {
  id: string;
  label: string;
  caption: string;
  lines: SnippetLine[];
  routesThrough: string;
}

const kw = (text: string): Token => ({ text, kind: "keyword" });
const str = (text: string): Token => ({ text, kind: "string" });
const mut = (text: string): Token => ({ text, kind: "muted" });
const n = (text: string): Token => ({ text, kind: "normal" });

const sl = (...tokens: Token[]): SnippetLine => ({ tokens });
const dl = (...tokens: Token[]): SnippetLine => ({ tokens, diff: true });

const TOKEN_CLASS: Record<TokenKind, string> = {
  keyword: "font-semibold text-muted-foreground",
  string: "text-muted-foreground/70",
  muted: "text-muted-foreground/40",
  normal: "",
};

const TABS: TabDef[] = [
  {
    id: "mcp",
    label: "MCP",
    caption: "Any MCP client. The highlighted line is the server URL — the only change.",
    routesThrough: "MCP traffic",
    lines: [
      sl(mut("{")),
      sl(n("  "), str('"mcpServers"'), n(": {")),
      sl(n("    "), str('"trajeckt"'), n(": {")),
      sl(n("      "), str('"type"'), n(": "), str('"streamable-http"'), n(",")),
      dl(n("      "), str('"url"'), n(": "), str('"https://gateway.trajeckt.com/mcp"'), n(",")),
      sl(n("      "), str('"headers"'), n(": {")),
      sl(n("        "), str('"Authorization"'), n(": "), str('"Bearer <api-key>"')),
      sl(mut("      }")),
      sl(mut("    }")),
      sl(mut("  }")),
      sl(mut("}")),
    ],
  },
  {
    id: "claude-agent-sdk",
    label: "CLAUDE AGENT SDK",
    caption: "Register Trajeckt as an MCP server. The highlighted line is the server URL.",
    routesThrough: "MCP traffic",
    lines: [
      sl(kw("import"), n(" anthropic")),
      sl(n("")),
      sl(n("client = anthropic.Anthropic()")),
      sl(n("")),
      sl(n("agent = client.beta.agents.create(")),
      sl(n("    name="), str('"my-agent"'), n(",")),
      sl(n("    model="), str('"claude-opus-4-8"'), n(",")),
      sl(mut("    mcp_servers=[{")),
      sl(n("        "), str('"type"'), n(": "), str('"url"'), n(",")),
      sl(n("        "), str('"name"'), n(": "), str('"trajeckt"'), n(",")),
      dl(n("        "), str('"url"'), n(": "), str('"https://gateway.trajeckt.com/mcp"')),
      sl(mut("    }],")),
      sl(mut("    tools=[")),
      sl(n("        {"), str('"type"'), n(": "), str('"agent_toolset_20260401"'), mut("},")),
      sl(n("        {"), str('"type"'), n(": "), str('"mcp_toolset"'), n(", "), str('"mcp_server_name"'), n(": "), str('"trajeckt"'), mut("}")),
      sl(mut("    ]")),
      sl(mut(")")),
    ],
  },
  {
    id: "langchain",
    label: "LANGCHAIN",
    caption: "Drop-in. The highlighted line is the only change.",
    routesThrough: "all tool calls",
    lines: [
      sl(kw("from"), n(" langchain_openai "), kw("import"), n(" ChatOpenAI")),
      sl(n("")),
      sl(n("llm = ChatOpenAI(")),
      sl(n("    model="), str('"your-model"'), n(",")),
      dl(n("    base_url="), str('"https://gateway.trajeckt.com/v1"'), n(",")),
      sl(n("    api_key="), str('"your-api-key"')),
      sl(mut(")")),
    ],
  },
  {
    id: "langgraph",
    label: "LANGGRAPH",
    caption: "Same base_url in a graph node. The highlighted line is the only change.",
    routesThrough: "all tool calls",
    lines: [
      sl(kw("from"), n(" langchain_openai "), kw("import"), n(" ChatOpenAI")),
      sl(kw("from"), n(" langgraph.graph "), kw("import"), n(" MessagesState, StateGraph")),
      sl(n("")),
      sl(n("llm = ChatOpenAI(")),
      dl(n("    base_url="), str('"https://gateway.trajeckt.com/v1"'), n(",")),
      sl(n("    api_key="), str('"your-api-key"')),
      sl(mut(")")),
      sl(n("")),
      sl(kw("def"), n(" agent_node(state: MessagesState):")),
      sl(n("    "), kw("return"), n(' {"messages": [llm.invoke(state["messages"])]}')),
      sl(n("")),
      sl(n("graph = StateGraph(MessagesState)")),
      sl(n("graph.add_node("), str('"agent"'), n(", agent_node)")),
      sl(n("graph.set_entry_point("), str('"agent"'), n(")")),
    ],
  },
  {
    id: "openai-sdk",
    label: "OPENAI SDK",
    caption: "Drop-in. The highlighted line is the only change.",
    routesThrough: "all tool calls",
    lines: [
      sl(kw("from"), n(" openai "), kw("import"), n(" OpenAI")),
      sl(n("")),
      sl(n("client = OpenAI(")),
      dl(n("    base_url="), str('"https://gateway.trajeckt.com/v1"'), n(",")),
      sl(n("    api_key="), str('"your-api-key"')),
      sl(mut(")")),
    ],
  },
];

const PANEL_BG = "#232321";

export default function IntegrationsSection() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <section id="integrate" className="py-u4">
      <div className="mx-auto max-w-7xl px-u1">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
              
     <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground"
        >
          <Unplug className="w-3.5 h-3.5" />
          Integration
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl font-heading"
        >
          Integration.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base mb-u2"
        >
          A gateway, not a library: if your stack speaks MCP or OpenAI-compatible tool calls, enforcement is one config change.
        </motion.p>


          {/* Tabbed code panel — full content width */}
          <div>
            {/* Tab row — chips seated on the panel's top edge */}
            <div
              role="tablist"
              aria-label="Integration examples"
              className="flex overflow-x-auto"
            >
              {TABS.map((t, i) => (
                <Button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  aria-selected={i === active}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      setActive((a) => (a + 1) % TABS.length);
                    }
                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      setActive((a) => (a - 1 + TABS.length) % TABS.length);
                    }
                  }}
                  style={i === active ? { borderBottomColor: PANEL_BG } : undefined}
                  className={[
                    "shrink-0 font-mono text-small px-u1 h-u2 inline-flex items-center border whitespace-nowrap",
                    "transition-colors duration-150 select-none relative",
                    i === 0 ? "" : "-ml-px",
                    i === active
                      ? "bg-primary text-background -mb-px z-10"
                      : "bg-transparent",
                  ].join(" ")}
                >
                  {t.label}
                </Button>
              ))}
            </div>

            {/* Panel — dark raised surface, height driven by tallest snippet */}
            <div className="bg-background border border-border lg:grid lg:grid-cols-12">
              {/* Code block — col-span-8 */}
              <div className="lg:col-span-8 overflow-x-auto">
                {/* Stacked grid: all tabs occupy the same cell so panel height = tallest snippet */}
                <div className="grid">
                  {TABS.map((t, i) => (
                    <div
                      key={t.id}
                      id={`panel-${t.id}`}
                      role="tabpanel"
                      aria-labelledby={`tab-${t.id}`}
                      aria-hidden={i !== active}
                      className={[
                        "[grid-area:1/1] pt-u1 px-u1 font-mono text-mono",
                        i !== active ? "opacity-0 pointer-events-none select-none" : "",
                      ].join(" ")}
                    >
                      {t.lines.map((ln, li) => (
                        <div
                          key={li}
                          className={[
                            "flex leading-[24px]",
                            ln.diff ? "bg-background/[0.08] -mx-u1 px-u1" : "",
                          ].join(" ")}
                        >
                          {/* Gutter marker */}
                          <span
                            aria-hidden="true"
                            className={[
                              "shrink-0 mr-[0.5ch]",
                              ln.diff ? "" : "invisible",
                            ].join(" ")}
                          >
                            +
                          </span>
                          <span className="whitespace-pre">
                            {ln.tokens.map((tok, ti) => (
                              <span key={ti} className={TOKEN_CLASS[tok.kind]}>
                                {tok.text}
                              </span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Caption — directly under the last code line */}
                <div className="px-u1 pt-u1 pb-u1">
                  <p className="font-mono text-mono">
                    {tab.caption}
                  </p>
                </div>
              </div>

              {/* Right rail — col-span-4 */}
              <div className="lg:col-span-4 border-t border-border lg:border-t-0 lg:border-l p-u1 lg:pl-u2 flex flex-col justify-start gap-u1">
                <div className="font-mono text-mono">
                  <div className=" uppercase tracking-wider text-xs mb-[4px]">
                    WHAT ROUTES THROUGH
                  </div>
                  <div>{tab.routesThrough}</div>
                </div>
                <div className="font-mono text-mono">
                  <div className="uppercase tracking-wider text-xs mb-[4px]">
                    WHAT YOU GET
                  </div>
                  <div>plan enforcement · audit trail · approvals</div>
                </div>
                <div className="font-mono text-mono">
                  <div className="uppercase tracking-wider text-xs mb-[4px]">
                    LATENCY ADDED
                  </div>
                  <div>&lt;3ms p95</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
