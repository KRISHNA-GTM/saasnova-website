# AI assistant ("Ask SaaSNova")

## Where it stands today

The legacy chatbot (`chatbot.js`, ~31 keyword intents, answers hard-coded in JavaScript, history in
localStorage) is retired. Its answers had drifted from the site (for example the expired PRM
deadline and program durations that contradict the AWS listings).

The new assistant is one widget with two modes:

| Mode | When | How it answers |
|---|---|---|
| **Guided** (live now) | `PUBLIC_CHAT_ENDPOINT` is empty | Scores the question against `/assistant-kb.json`, built from the same data as the pages (`src/data/knowledge.ts`). Always offers the strategy session and contact page. No network calls beyond the site. |
| **Live** | `PUBLIC_CHAT_ENDPOINT=/api/chat` at build time | Streams answers from Claude on Amazon Bedrock through `api/chat`. Falls back to guided answers if the API is unreachable or rate-limited. |

Because the knowledge base is generated from `offerings.ts`, the assistant can never describe a
program differently from its page.

## Target architecture

```
Browser (widget) ──POST /api/chat──► CloudFront ──(WAF rate rule)──► Lambda function URL (IAM, OAC)
                                                                        │  Node 22, response streaming
                                                                        │  validates input, per-IP limit
                                                                        ▼
                                                   Amazon Bedrock (Messages-API endpoint)
                                                   model anthropic.claude-opus-5, role-based SigV4
```

- **Same origin**: `/api/*` is a CloudFront behavior, so there is no CORS exposure and the CSP stays
  `connect-src 'self'`.
- **No API keys**: the Lambda execution role is granted `bedrock-mantle:CreateInference`. Nothing
  secret exists in the browser, the repo or environment variables.
- **Grounding**: `api/chat/knowledge.txt` is a copy of the built `dist/llms-full.txt` (programs,
  services, scope, listing links, verbatim testimonials, company facts). The system prompt
  restricts answers to that material, forbids prices and invented claims, and caps length. The
  prompt is marked with an explicit cache breakpoint (Bedrock supports explicit breakpoints, not
  top-level automatic caching), so repeat questions reuse the cached prefix.
- **Model**: `anthropic.claude-opus-5` with `effort: low` (short chat answers). Both are template
  parameters. Model access on Bedrock varies by account; confirm Opus 5 access in the Bedrock console
  (Claude Sonnet 5 and Opus 4.8 are open to all Bedrock customers if you need an alternative).
- **Refusals**: Bedrock does not support server-side refusal fallbacks; the Lambda detects
  `stop_reason: "refusal"` and replies with a short redirect to the booking and contact pages.

## Security and abuse controls

| Control | Where |
|---|---|
| Function URL `AuthType: AWS_IAM`, invoked only by CloudFront via Origin Access Control | `api/template.yaml` |
| AWS WAF rate-based rule: 20 requests per IP per minute on `/api/*`, returns 429 | `api/waf-rate-limit-rule.json` |
| Per-instance limiter: 8 questions per IP per minute | `api/chat/index.mjs` |
| Reserved concurrency (default 10) caps simultaneous conversations and so the spend rate | template parameter `MaxConcurrency` |
| Input validation: user/assistant roles only, 12 turns max, 2,000-character question limit, 40 KB body limit, JSON only | `index.mjs` |
| Origin allowlist (`https://www.saasnova.ai`) | template parameter `AllowedOrigins` |
| No tools, no retrieval of arbitrary URLs, no personal data collection in chat | system prompt and code |
| Logs: token counts and stop reasons, not message text; 30-day retention | CloudWatch |

Add an AWS Budgets alert on Bedrock spend when you launch.

## Rollout steps

1. **Enable model access** for Claude in the Bedrock console in your chosen region (for example
   `us-east-1`).
2. **Deploy the API**:
   ```bash
   cd website && npm run build
   cp dist/llms-full.txt api/chat/knowledge.txt
   cd api && sam build && sam deploy --guided
   ```
3. **Route `/api/*` in CloudFront**: add the function URL as an origin with a Lambda OAC, create a
   behavior `/api/*` with caching disabled (`CachingDisabled`), origin request policy
   `AllViewerExceptHostHeader`, allowed methods GET/HEAD/OPTIONS/PUT/POST/PATCH/DELETE. Grant
   CloudFront `lambda:InvokeFunctionUrl` (the console offers the policy when you pick OAC).
4. **Attach the WAF web ACL** with `api/waf-rate-limit-rule.json` to the distribution.
5. **Test** with curl through CloudFront:
   `curl -N -X POST https://www.saasnova.ai/api/chat -H 'content-type: application/json' -H 'origin: https://www.saasnova.ai' -d '{"messages":[{"role":"user","content":"What is Ignite?"}]}'`
6. **Switch the site to live mode**: set `PUBLIC_CHAT_ENDPOINT=/api/chat` in `.env` (or the build
   environment) and redeploy the site.
7. **Evaluate before announcing**: run the questions in `scripts/test-assistant-kb.mjs` plus real
   questions from sales calls, and check answers against the pages. Keep a small set of
   question/expected-fact pairs and rerun them whenever the prompt, model or knowledge changes.

Keep `knowledge.txt` in step with the site: copy it on every API deploy after content changes.

## Tested so far

- `api/test-handler.mjs`: preflight, method, origin, JSON, role, length and rate-limit paths (9/9 pass).
- The SDK package exports `AnthropicBedrockMantle` with `messages.stream`.
- **Not yet tested**: a real Bedrock call. It needs your AWS account with model access.

## Next steps once live

- Lead capture: when a visitor asks to be contacted, show the contact form inline rather than
  collecting details in chat.
- Hand-off: include the conversation in the `message` field when the visitor submits that form.
- Conversation analytics: log question categories (not text) to see what buyers ask.
