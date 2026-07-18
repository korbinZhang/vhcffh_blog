import { NoSSR } from '@rspress/core/runtime';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const frontmatter = {
  date: '2026-04-29',
  description: '基于cloudflare Work AI博客对话助手',
  title: '对话助手',
  footer: false,
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
};

const parseInlineFormatting = (text: string): React.ReactNode => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
};

const MessageContent = ({ content }: { content: string }) => {
  if (!content) return null;

  const rawParts = content.split(/```/g);
  const parts = rawParts.map((part, index) => ({
    id: `block-${index}-${part.length}`,
    index,
    part,
  }));

  return (
    <div className="space-y-3 text-sm md:text-base leading-relaxed break-words">
      {parts.map((item) => {
        if (item.index % 2 === 1) {
          const lines = item.part.split('\n');
          let language = '';
          let code = item.part;

          if (
            lines[0] &&
            lines[0].trim().length > 0 &&
            !lines[0].includes(' ') &&
            lines[0].length < 15
          ) {
            language = lines[0].trim();
            code = lines.slice(1).join('\n');
          }

          return (
            <div
              key={item.id}
              className="my-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {language && (
                <div className="bg-gray-100 dark:bg-gray-850 px-4 py-1.5 text-xs font-mono text-gray-500 dark:text-gray-400 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 select-none">
                  <span>{language}</span>
                </div>
              )}
              <pre className="p-4 bg-gray-50 dark:bg-gray-950 overflow-x-auto text-xs md:text-sm font-mono text-gray-800 dark:text-gray-200">
                <code>{code.trim()}</code>
              </pre>
            </div>
          );
        }

        const rawParagraphs = item.part.split(/\n\n+/g);
        const paragraphs = rawParagraphs.map((paragraph, pIdx) => ({
          id: `p-${item.index}-${pIdx}`,
          paragraph,
        }));

        return paragraphs.map((pItem) => {
          if (!pItem.paragraph.trim()) return null;

          const lines = pItem.paragraph.split('\n');
          const isBulletList = lines.every(
            (line) =>
              line.trim().startsWith('- ') || line.trim().startsWith('* '),
          );
          const isNumberedList = lines.every((line) =>
            /^\d+\.\s/.test(line.trim()),
          );

          if (isBulletList) {
            const listItems = lines.map((line, lIdx) => ({
              id: `bullet-${pItem.id}-${lIdx}`,
              cleaned: line.trim().replace(/^[-*]\s+/, ''),
            }));

            return (
              <ul
                key={pItem.id}
                className="list-disc list-inside space-y-1.5 my-2 pl-2"
              >
                {listItems.map((lItem) => (
                  <li
                    key={lItem.id}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {parseInlineFormatting(lItem.cleaned)}
                  </li>
                ))}
              </ul>
            );
          }

          if (isNumberedList) {
            const listItems = lines.map((line, lIdx) => ({
              id: `num-${pItem.id}-${lIdx}`,
              cleaned: line.trim().replace(/^\d+\.\s+/, ''),
            }));

            return (
              <ol
                key={pItem.id}
                className="list-decimal list-inside space-y-1.5 my-2 pl-2"
              >
                {listItems.map((lItem) => (
                  <li
                    key={lItem.id}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {parseInlineFormatting(lItem.cleaned)}
                  </li>
                ))}
              </ol>
            );
          }

          return (
            <p
              key={pItem.id}
              className="text-gray-700 dark:text-gray-300"
              style={{
                marginTop: '0px',
                marginBottom: '0px',
              }}
            >
              {parseInlineFormatting(pItem.paragraph)}
            </p>
          );
        });
      })}
    </div>
  );
};

const AssistantComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messages.length;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => {
          setCopiedIndex(null);
        }, 2000);
      })
      .catch((err) => {
        console.error('复制失败: ', err);
      });
  };

  async function sendMessage(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: text,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('https://api.vhcffh.com/api/v1/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          newMessages
            .filter(({ error }) => !error)
            .map(({ role, content }) => ({ role, content })),
        ),
      });
      if (res.status !== 200) {
        throw new Error('error');
      }
      const data = await res.json();
      console.log(data);
      if (data.code !== 200) {
        throw new Error('error');
      }
      setMessages((prev) => {
        return [...prev.slice(0, prev.length - 1), data.data.messages.message];
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        return [
          ...prev.slice(0, prev.length - 2),
          {
            ...prev[prev.length - 2],
            error: true,
          },
          {
            role: 'assistant',
            content:
              '⚠️抱歉，获取 AI 回答时发生错误。请检查网络连接或稍后重试。',
            error: true,
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-4 border border-gray-200 dark:border-gray-800 md:rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-900 flex flex-col h-[calc(100vh-160px)] md:h-[680px]">
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-xl text-blue-500">
            🤖
          </div>
          <div>
            <div className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
              Korbin
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 bg-gray-100 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-950/30 rounded-lg transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
          onClick={() => {
            if (confirm('确定要清空对话历史吗？')) {
              setMessages([]);
            }
          }}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>清空对话</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          清空
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 dark:bg-gray-900/10">
        {messages.map((m, i) => {
          const actualIndex = i + 1;
          const msgId = `msg-${actualIndex}`;
          return (
            <div
              key={msgId}
              className={`flex gap-3 items-start ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {m.role === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm shadow-sm flex-shrink-0 font-bold border border-blue-200/50 dark:border-blue-500/20 select-none">
                  👤
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm shadow-sm flex-shrink-0 select-none">
                  🤖
                </div>
              )}

              <div
                className={`flex flex-col max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none font-medium'
                      : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800/80 text-gray-800 dark:text-gray-100 rounded-tl-none'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    m.content ? (
                      <MessageContent content={m.content} />
                    ) : (
                      <div className="flex gap-1 py-1.5 px-2 select-none">
                        <span
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    )
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>

                {m.role === 'assistant' && m.content && (
                  <div className="flex items-center gap-3 mt-1.5 px-1 text-xs text-gray-400 dark:text-gray-500 select-none">
                    <span>Korbin</span>
                    <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <button
                      type="button"
                      onClick={() => handleCopy(m.content, actualIndex)}
                      className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 flex items-center gap-1 cursor-pointer"
                      title="复制回答"
                    >
                      {copiedIndex === actualIndex ? (
                        <>
                          <svg
                            className="w-3.5 h-3.5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <title>已复制</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-green-500 font-medium">
                            已复制!
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <title>复制回答</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                          <span>复制</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-55/50 dark:bg-gray-900/50">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200">
            <textarea
              className="w-full bg-transparent border-0 outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm py-3 px-4 resize-none max-h-32 min-h-[44px] block focus:ring-0 focus:border-transparent"
              placeholder="输入问题... (Enter 发送，Shift + Enter 换行)"
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0 ${
              loading || !input.trim()
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-450 dark:text-gray-650 cursor-not-allowed select-none'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 cursor-pointer hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <title>发送中</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 transform rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>发送</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Assistant = () => {
  return (
    <NoSSR>
      <AssistantComponent />
    </NoSSR>
  );
};

export default Assistant;
