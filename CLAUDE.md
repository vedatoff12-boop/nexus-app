# NEXUS-APP — карта проекта для агента

## Что это
Репозиторий Telegram Mini App воронок. Каждая папка верхнего уровня (mn, ph, tr, my, es, id ...) — отдельное гео/вариант. Бэкенд живёт в n8n на https://n8nnexusai.uk, данные — в Supabase. В этом репо только фронтенд (index.html на гео).

## Стандартная воронка
Типичный файл: XX/index.html, ~1000-1300 строк, Telegram Mini App.
Внутри есть блок GEO_CONFIG (name, flag, lang, currency, sym, profitRange), webhook-URL'ы и namespace APP_NS.
Подключает https://telegram.org/js/telegram-web-app.js.

## ВАЖНО: две разные webhook-конвенции
Не все воронки именуют webhook одинаково. Перед любой правкой ОБЯЗАТЕЛЬНО прочитай реальные webhook-пути в файле-источнике, не угадывай.
- Тип A (как mn, my, vn): nexusai-<geo>-chat, nexusai-<geo>-history
- Тип B (как es, id, kr, sg-v3): miniapp-chat-<geo>, miniapp-history-<geo>
- Проверка доступа обычно: check-access-<geo>
- Общий сброс у всех: miniapp-reset-self-v1 (НЕ менять при клоне)

## Нестандартные папки — не равняться на них
- signals/ — НЕ мини-апп (58 строк, нет GEO_CONFIG). Особый случай.
- kr2/ — урезанная версия (~607 строк).
- bd/, ma/ — имеют дополнительно app.html и папку proof/.
- lat2c/ — вариант-копия lat2 (те же webhook latam2).
- uz/ — фронтенд есть, но webhook НЕ подключены (бэкенд не готов).

## Правила работы
- Перед правкой воронки сначала прочитай её index.html целиком.
- Файлы .bak / .bak2 / .before_fix — это бэкапы, НЕ трогать и не использовать как образец.
- При клоне гео менять: GEO_CONFIG (name/lang/currency/sym), webhook-суффикс гео, APP_NS, тексты. НЕ менять: miniapp-reset-self-v1, структуру разметки.
- Тексты переводить на язык целевого гео, не оставлять язык источника.
- Секреты (токены, ключи) в этих файлах не хранятся и не должны добавляться.

## Чек-лист "готово" для воронки
1. GEO_CONFIG соответствует целевому гео (валюта, язык, символ).
2. Все webhook-пути указывают на правильный гео-суффикс и существуют в n8n.
3. APP_NS уникальный для гео.
4. Все тексты на языке гео.
5. Нет остатков языка/суффикса источника.
## Архитектура бэкенда (n8n) — ВАЖНО для аудита

### Воронка = связка из нескольких workflow, НЕ один
Одно гео обслуживается группой workflow в n8n, а не одним:
- основной бот: "NexusAI <страна>"
- проверка доступа: "Check Access <страна>"
- поддержка: "<страна> Support Chat"
- пуши: "Push Engine <страна>"
- чекеры депозита: "Deposit Cheker / Nexus Cheker <страна>"
При аудите/правке гео надо смотреть ВСЮ связку, а не только бота.

### Два поколения воронок
- СТАРОЕ поколение (кнопки): пользователь идёт по скриптованным кнопкам. Вход — Telegram Trigger напрямую, без настраиваемого path. Примеры: Turkey, MY, PH, Indonesia.
- НОВОЕ поколение (proxy-entry, ИИ-обработка): заходит ИИ-обработчик, ведёт пользователя живым диалогом, цель — выше конверсия. Вход — generic Webhook нода "Proxy Entry" с path вида "<geo>-proxy-entry". Примеры: MN, LATAM2, MY CRM.

### Целевая архитектура и эталон
- ЦЕЛЕВОЕ направление = новое поколение (proxy-entry с ИИ-обработкой). Идёт постепенная миграция со старого на новое ради конверсии.
- ЭТАЛОН чистой новой воронки = "NexusAI MY CRM" (у неё старый Telegram Trigger уже отключён, живёт только mycrm-proxy-entry). Равняться на неё.

### Состояние миграции — НЕ баг
У части гео (MN, LATAM2) временно активны ОБА входа (Telegram Trigger + proxy-entry) — это нормальное состояние теста, чтобы можно было откатиться. НЕ считать это ошибкой и не "чинить" отключением одного входа без спроса.

### Перед любой работой с гео
1. Определи, на каком поколении гео (есть ли у бота proxy-entry нода).
2. Найди всю связку workflow этого гео.
3. Только потом предлагай правки. Если поколение неясно — спроси, не угадывай.

### Внимание: в n8n много мусора
В инстансе ~267 workflow, среди них много дубликатов, TEMP, BACKUP, archived и сломанных (напр. несколько "Korea", "MA", "Singapore Сломан"). НЕ ориентироваться на workflow с пометками TEMP/BACKUP/archived/Сломан/v1 как на образец. При сомнении какой из дубликатов рабочий — спросить.

## Действующие уроки-ПРИНЦИПЫ

- n8n PUT/save on workflows with Telegram Trigger can re-register Telegram webhook and drop `chat_join_request`; after approved PUT verify/restore exact router webhook and allowed updates.
- `$env.*` is unavailable/unreliable inside production n8n Code nodes; prepare payload in Code, write via HTTP Request node using existing n8n credentials.
- `onError=continueRegularOutput` can hide provider/API failures as vague syntax/output errors; for one approved diagnostic set `stopWorkflow` + temporary execution logs, then restore.
- n8n clone/import can lose or duplicate `webhookId`; after clone/readback verify unique webhook IDs and internal Code-node references like `$('Webhook ...')`.
- For new-generation funnels, assemble against the MY CRM proxy-entry reference, not from random active/TEMP/BACKUP duplicates.
- Money/deposit logic changes require backup → mocks/boundaries → readback → rollback plan; no blind live math edits.
- Browser/frontend changes must preserve exact endpoint convention, `APP_NS`, geo suffixes, and run local JS/browser smoke before deploy.
- Telegram CTA/WebApp button proof must be visual/client-side, not only JSON/readback.
- Ad landing CTA preference: open Telegram app directly through `tg://resolve` without automatic `t.me` prelanding fallback, unless Omir says otherwise.
- Report to Omir/Kai in short format; full technical evidence goes to `/Users/omir/Jarvis/logs/`.

## Active funnel map / source of truth

| Воронка | Main workflow ID | Bot / frontend | Статус | Открытые TODO |
|---|---:|---|---|---|
| MY CRM | `AFdSGFs3ipz0mQID` | `@nexusaimycrm_bot`, `my-crm/index.html` | эталон proxy-entry; AI-led | security cleanup for inline relay/track secrets; keep router/chat_join_request invariant after PUT; verify direct landing uploads if touched |
| MY2 / NexusAI MY | `58p4EKvLlMZFrH5p` | MY2 bot, `my/index.html` | separate Malaysia; vision/model fixes done | opener fix through AI Agent; sendVideoNote circle; test reset target user `930309275` only when scoped |
| LATAM2 | `e1KPmuaHot6wn4Kz` | `nexusailat_bot`, `lat2/index.html` | proxy/direct-entry work mostly done | final direct landing upload/retry; remove stale invite-link creation if still present; monitor CAPI/Subscribe event IDs |
| TR CRM | `pRYOqrsRV6GrFtsf` | `@nexusaiturkey_bot`, `tr-crm/index.html` | MaltCasino Mini App + push engine live | verify push success/resume live; inspect transient webhook 502; validate CAPI on real traffic; hardening/security |
| TR CRM Push Engine | `nEOGkCuiKN4pEWm4` | schedule push workflow | active, logs none, Istanbul windows | check clean-wave success rate and first live `push_resume` clicks |
| TR CRM Support Chat | `oA6EDhwCQsJuYIk8` | `nexusai-trcrm-chat/history` | active clone, localized | monitor chat history; keep separate from main bot dialog log |
| CA-WC | `VI5QQWsqU73zNnjh` | CA-WC bot, `ca-wc/index.html` | near-ready / prediction stack live | upload/check landing if launched; log group; execution logs none; E2E before traffic |
| CA-WC prediction | `JfxHevEzDMC3KoST` | `match-prediction-cawc` | 72 prediction rows | keep access gating and CORS contract stable |
| WC26ES / FIFA MX+AR | `o51ea5qjYv2esBJi` | `@nexusaififa_bot`, `wc26es/index.html`, AR/MX landings | AR launched; MX prepared | upload MX landing; Support Chat backend; prediction icon cosmetics; keep `mx_`/`ar_` attribution |
| WC26ES access | `6dJ8FChbu8ytl47d` | `check-access-wc26es` | active | locked/preview + ACCESS-positive checks after edits |
| WC26ES prediction | `jTH08f8Zpbg6qRlM` | `match-prediction-wc26es` | active; ES cards | keep `user_id + match_id` access contract |
| UZ | `kIRC04gY5stu8LPs` | UZ bot, `uz/index.html` | screenshot-first legacy; Mini App localization deployed | optional check-access retry; Uzbek copy review; do not assume chat backend exists |
| KG | `meBBI25s68N6alDM` | `@nexusaikg_bot`, `kg/index.html` | UZ screenshot clone live | menu button, final E2E Mini App, Kyrgyz copy review, cosmetic `normalizeUzAccess` rename |
| KG access | `WXepu7t5sY0aCyQM` | `check-access-kg` | active | verify Bronze/Gold/none before traffic |
| TR COMBO | `qAzHWe6X1nLSRc7T` | `@nexusaiturkey26_bot`, TR COMBO Mini App | launched via TRWC credential swap | restore vision `onError`, set logs back to `none`, clean debug tail `FILE_OK_BUT_VISION_`, remove `[KG DONOR COPY]` with approval, verify menu button |

## Рабочие quick refs

### Таблицы / данные
- MY CRM: `users_my_crm`, `miniapp_chat_my_crm`, `my_crm_funnel_events`, `tr_crm_dialog_log` only for TR CRM bot-dialog pattern reference.
- LATAM2: `users_latam2`, `miniapp_chat_latam2`; verify `message` vs `content` history contract before chat edits.
- TR CRM: `users_tr_crm`, `miniapp_chat_tr_crm`, `tr_crm_dialog_log`; do not mix support chat history with main bot warmup.
- WC26ES: `users_wc26es`, `miniapp_chat_wc26es`, `wc2026_predictions_es`; access from `stage === 'ACCESS'` plus real `user_id`.
- KG/UZ: `users_kg` / `users_uz`; screenshot status and tier constraints must be checked before Vision/status writes.

### Deploy / proof gates
- Frontend deploy: backup → syntax check → browser smoke → git status → stage exact file(s) only → commit/push after approval/request.
- n8n live update: backup workflow JSON → patch smallest node/field → readback diff → webhook/menu invariant if Telegram involved.
- Supabase write: exact table/query/risk → approval → readback count/state; never print service-role, anon key, DB password, or JWT.
- Telegram client proof: verify actual bot/client button/menu visually where possible; Bot API JSON alone is not enough for CTA claims.

## ОТКРЫТЫЕ TODO — consolidated

### Global / repo / ops
- Keep this file slim. Full history: `docs/SESSIONS_ARCHIVE.md` — read targeted sections only when needed.
- Do not stage existing unrelated dirty files: `eg/index.html`, `my-crm/index.html`, `sg/index.html`, `.claude/`, backup files, or other untracked artifacts unless explicitly scoped.
- Security hardening remains separate: RLS-OFF table audit and inline service-role/token migrations require dedicated plan + approval.
- Reports to Omir/Kai: `STATUS` + exact IDs/paths + 5-7 essence lines + full report path in `/Users/omir/Jarvis/logs/`; always include workflow IDs / tables / file paths.

### MY CRM / MY2 / LATAM2
- MY CRM: keep `mycrm-tg-router` + `chat_join_request` invariant after every main workflow PUT; migrate/rotate inline relay/track secrets only under separate security approval.
- MY2: opener fix (`/start` through AI Agent, no wrong persona/country); `sendVideoNote` circle item if still desired.
- LATAM2: finish direct-entry/landing cleanup if not uploaded; remove obsolete `createChatInviteLink` branch only after readback/approval; monitor fbp/fbc and Subscribe event_id consistency.

### TR CRM
- Confirm Push Engine clean-wave delivery metrics and live `push_resume` callback behavior.
- Recheck transient main webhook HTTP 502 and whether it repeats.
- Validate CAPI/match quality on real traffic; IP quality issue is separate from user flow.
- Keep `tr_crm_dialog_log` separate from `miniapp_chat_tr_crm` support history.

### CA-WC / WC26ES / landings
- CA-WC before traffic: landing upload/domain check, log group `-5066303738`, execution logs back to `none`, E2E.
- WC26ES: upload MX landing when MX launches; AR landing live uses `ar_` attribution; preserve `mx_`/`ar_` server-side mapping.
- WC26ES Support Chat backend (`nexusai-wc26es-chat/history`) is still optional/open.
- Prediction access contracts: keep locked/preview and ACCESS-positive tests after endpoint/frontend changes.

### UZ / KG
- UZ: optional retry for transient check-access fetch failure; Uzbek copy review for Chicken Road/QADAM.
- KG: set/verify Telegram Menu Button to `https://vedatoff12-boop.github.io/nexus-app/kg/?v=477d18e`; final E2E Mini App with bronze access; Kyrgyz copy review; cosmetic frontend rename only if scoped.

### TR COMBO tails
- Return Vision `onError` from diagnostic mode to safe production mode after root-cause proof.
- Restore execution logs to `none` when debug window closes.
- Remove or quarantine debug tail markers like `FILE_OK_BUT_VISION_` after verification.
- Remove `[KG DONOR COPY]` labels only with explicit approval and scoped readback.
- Verify Telegram menu button/client entry visually, not only workflow JSON.

## Полная история

Полная история сессий: `docs/SESSIONS_ARCHIVE.md` — читать точечно при необходимости.
