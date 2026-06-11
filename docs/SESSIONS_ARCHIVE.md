# NEXUS-APP — sessions archive

Generated: 2026-06-11T17:47:48
Source backup: `CLAUDE.md.bak-before_limits_diet-20260611_174748`

This archive preserves the full pre-diet `CLAUDE.md` content without shortening.
Use it for historical/session details only. The slim `CLAUDE.md` keeps current operating rules, active principles, workflow map, and open TODO.

## Moved historical sections

Moved from pre-diet `CLAUDE.md` into this archive, intact inside the full snapshot below:

- `## Накопленные уроки (обновляется каждую сессию)` historical detail blocks.
- All `СЕССИЯ ...` blocks and dated session summaries.
- DONE blocks for closed tasks: UZ vision/screenshot fixes, KG launch, CA-WC, WC26ES, TR CRM build/pushes/dialog logger, LATAM2 currency/rates/history/scoreboard, MY CRM playground/prompt/register/push fixes, MY2 pixel/model fixes, FileZilla landing handoffs, and related closed work.
- Superseded plans, old fix plans, launch notes, and non-current detailed retrospectives.
- Historical workflow IDs, backup paths, mocks, live proof notes, and troubleshooting narratives.

## Full pre-diet CLAUDE.md snapshot

```markdown
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


## Накопленные уроки (обновляется каждую сессию)

### UZ — почему бот не работал (аудит 30.05)
- Фронт uz/index.html зовёт nexusai-uz-chat и nexusai-uz-history, но таких АКТИВНЫХ workflow в n8n НЕТ → главная вкладка мини-аппа не отвечает.
- Фронт = новое chat-поколение, а бэкенд UZ = старый screenshot-first (Telegram Trigger). Архитектуры не совпадают.
- proxy-entry для UZ не существует. Куча TEMP UZ workflow выключены/недоделаны.
- В Supabase users_uz = 1 запись → бот реально никогда не работал.
- CORS check-access-uz жёстко привязан к https://vedatoff12-boop.github.io — при другом URL доступ блокируется.

### MY CRM — баги эталона (аудит 30.05)
- miniapp_chat_my_crm: у всех строк geo='ph' вместо 'my' → ломает аналитику по гео.
- История чата: formatter ждёт поле content, в таблице поле message → nexusai-my-crm-history может отдавать пустую историю.
- Промокод расходится: фронт 777MY777, support-промпт 888MY888 → выбрать один.
- my_crm_funnel_events = 0 строк → события не пишутся, logger не подключён.
- Узкое место конверсии: 145 users → 22 player_id → 15 deposit → 7 access. Главный отвал user→player_id.
- После изменений в n8n проверять mycrm-tg-router и chat_join_request (чувствительны к re-registration вебхуков).

### MY CRM (эталон) — что чинили 30.05
- Промокод во фронте: `777MY777` был от другого продукта (`NexusAI Malaysia`), правильный для MY CRM = `888MY888`. При клоне сверять промокод фронта с ботом.
- `geo` в Support Chat (`Save Chat` node) был хардкод `ph` — поправили на `my`. При клоне проверять хардкод `geo` в `Save Chat`.
- История чата: formatter ждал `d.content`, таблица хранит `message`. Фикс: `const text = d.message ?? d.content`. Тот же баг есть в MN — шаблонный, проверять при клоне.
- `funnel_events` не писались по двум причинам: (1) logger брал `user_id` из обнулённого контекста после Telegram-send узла — фикс: брать `user_id` из надёжного upstream-узла (`01`/`PARSE_VISION`/`CALC_NEW_TOTAL_DEPOSIT`/`START_FAST_PREP`) через `$('node').first().json`; (2) logger использовал `$env.SUPABASE_*` — в n8n Code node `$env` недоступен (`TypeError`) — фикс: писать через отдельный HTTP-узел с n8n credential `Supabase account` как `START_FAST_CREATE`/Daily Counter, не через `$env` и не хардкод.
- При клоне аналитики: logger готовит payload, отдельный HTTP POST пишет через credential. `metadata` без приватных ключей/PII: constraint таблицы запрещает `screenshot`/`file_id`/`username`/`player_id` и т.д.

### MY CRM — карта критического пути и prompt surgery (30.05)
- Main workflow: `NexusAI MY CRM 🇲🇾` / `AFdSGFs3ipz0mQID`, новая proxy-entry архитектура. Основной вход: `Proxy Entry`; legacy `Start Trigger` также есть в графе, поэтому после любого PUT по workflow надо проверять `mycrm-tg-router` и `chat_join_request`.
- Normal AI critical path до ответа: `Proxy Entry → Extract TG Update → NORMALIZE → GET_CRM_MODE → IF_FORUM_RELAY → IF_KNOWN_BUTTON → IS_ADMIN_CLICK → CHECK REPLY → DEBUG_TEXT → IF_START → CHECK_MSG_USER → IF_DIRECT_RELAY_TEXT → If → 00 → If1 → IS_DEPOSIT_PHOTO → IF_PRIVATE_RELAY_STAGE → Simple Memory/OpenAI Chat Model/AI Agent → 01 → Check User Exists → 02/02.1 → IF_WARMUP_CHECK → 04_IF → AI_MEDIA_DISPATCH → 03`.
- Реальные user-send узлы в normal AI path: `AI_MEDIA_DISPATCH` (media tags/video/proof album) и `03` (text send + strip control tags + registration button). `CHECK REPLY`, `CHECK_MSG_USER`, `GET_FILE_INFO` — не user-send, это IF/Supabase/HTTP false positives.
- После `03` уже идёт бухгалтерия/фон: `Filter_Photo`, `Admin_Photo`, `Report to Group`, `LOG_SCOREBOARD_*`, `POST_SCOREBOARD_*`, `Check Registration`, `Meta CAPI Registration`, `MIRROR_USER_TO_TOPIC`. При оптимизации сохранять принцип: CAPI/scoreboard/admin logs не должны блокировать user reply.
- Fast button path: `FAST_GET_USER → FAST_ROUTE → FAST_UPDATE → FAST_SEND_* → FAST_GROUP_LOG`. Scripted ответы идут до group log — порядок правильный.
- Deposit screenshot path до ответа: `GET_FILE_INFO → VISION_BRAIN(OpenRouter/Gemini via openAiApi credential) → PARSE_VISION → IF_AMOUNT_OK → GET_CURRENT_TOTAL_DEPOSIT → CALC_NEW_TOTAL_DEPOSIT → UPDATE_STAGE_SIGNALS → IS_GOLD_ACTIVATED → BRONZE_PROGRESS_MSG/GOLD_ACTIVATED_MSG`. `UPDATE_STAGE_SIGNALS` перед ответом тормозит, но для Gold/access даёт консистентность Mini App; переносить только после отдельного mock/live теста.
- Главный latency bottleneck normal AI: `AI Agent` + `OpenAI Chat Model` (Sonnet via OpenRouter) и большой `AI Agent.options.systemMessage` (~27.6k chars). Prompt surgery должна сначала сжимать systemMessage, не меняя downstream parser contracts.
- Parser contracts, которые нельзя ломать: `[UPDATE_STAGE: WARMUP|REGISTRATION|DEPOSIT|ACCESS]`, `[SEND_VIDEO]`, `[SEND_PROOF_ALBUM]`, `[PLAYER_ID: {number}]`, ID range `1663000000–1750000000`, markers `[USER_SENT_SCREENSHOT]` vs `[USER_SENT_SCREENSHOT_IN_REGISTRATION]`, registration bridge-only rule, old-account/sync-module rule, deposit/access threshold logic, promo `888MY888`.
- В prompt найдены PH/Philippines donor leftovers и повторы media/product/objection/follow-up. Чистить только локальным draft + mock old-vs-new через Claude Code; не PUT в n8n без отдельного approval.
- Для LATAM2 переносить метод, а не мусор: сначала map critical path и реальные send nodes, затем local compact prompt, затем contract mocks, затем MY CRM live полигон, и только потом LATAM2.

### Инфраструктура
- Supabase MCP даёт Unauthorized с ключом sb_secret_; данные берутся через SUPABASE_DB_URL напрямую (SELECT). MCP нужно дочинить (возможно нужен sbp_ PAT).
- Нативную сессию Hermes нельзя перевести на Opus без платного Anthropic API (его нет). Opus работает через Claude Code.

### UZ screenshot-бот: как починили (30.05)
- Все рабочие vision-воронки (MN/LATAM2/MY CRM) идут на OpenRouter (`openrouter.ai`), НЕ на `api.openai.com`. Credential: `Kanat AI` (`yL2poEwhPIu6Mg2X`) или `Estai AI`. Модель `gemini-2.0-flash-001`. UZ был ошибочно настроен на OpenAI с мёртвым ключом → 401.
- При отладке vision/HTTP-узла: `onError=continueRegularOutput` прячет реальную ошибку (показывает `invalid syntax`). Чтобы увидеть правду — временно `onError=stopWorkflow` + `saveDataSuccessExecution=all` на один тест, прочитать ответ, вернуть обратно. Это экономит часы.
- При переключении HTTP-узла `raw` → `json` в n8n остаётся пустой keypair body `[{name:"",value:""}]`, и `jsonBody` игнорируется → шлётся `{"":""}` → 400. Проверять `specifyBody=json` и убирать keypair.
- Parser НЕ должен зависеть от `valid_context` (модель его не возвращает). Доверять `status`/`amount`/`currency`/`confidence` как MY CRM. UZ parser исправлен.
- Supabase `users_uz`: constraint `screenshot_status` расширен до 9 значений (добавлены `too_small`, `processing_error`, `vision_json_parse_fail`).
- Главный метод отладки: смотреть реальные логи ошибок и сверяться с рабочей воронкой (MY CRM), НЕ гадать вслепую.

### MY CRM полигон — уроки (30.05)
- Промокод фронта `777MY777` был от другого продукта; правильный для MY CRM = `888MY888`. При клоне сверять промокод фронт↔бот.
- `geo` в Support Chat `Save Chat` был хардкод `ph` → `my`. Старые строки чистятся отдельным `UPDATE` (guard-транзакция, backup).
- История чата: formatter ждал `d.content`, таблица хранит `message`. Фикс: `d.message ?? d.content`. Тот же баг в MN.
- `funnel_events`: (1) logger терял `user_id` после Telegram-send узла → брать id из надёжного upstream через `$('node').first().json`; (2) `$env` недоступен в n8n Code node (`TypeError`) → писать через HTTP-узел с credential `Supabase account`, не `$env`, не хардкод. `metadata` без приватных ключей (constraint).
- АРХИТЕКТУРА: бухгалтерия (логи/scoreboard/CAPI/mirror) уже стоит ПОСЛЕ ответа юзеру — это правильно, сохранять при клоне. Главный тормоз скорости — большой AI-промпт, не обвязка.
- ПРОМПТ-ХИРУРГИЯ метод: draft → mock LLM → прогон реального parser `01` на old/new → A/B качества текстов глазами владельца → polish → apply только `systemMessage` → ЖИВОЙ тест владельцем (автотесты НЕ ловят раннюю кнопку/самопредставление). Сжали `27.6k→12k` без потери контрактов.
- РАННЯЯ КНОПКА: узлы `03`/`07` добавляют Register по хрупкому regex на текст AI; фраза `signal group for 1xBet` ложно матчит `sign.*up.*1xbet`. ДУРАБЛ-ФИКС (TODO): кнопку сделать stage-driven (`new_stage===REGISTRATION`), не по словам. На LATAM2 проверить тот же regex.
- FLOAT деньги: считать через `roundMoney()` с `Number.EPSILON`, выводить `.toFixed(2)`. Порог `>=80` не трогать. Граница проверяется mock на `80.00/79.99/80.01` перед apply.



### Этап 2 — кнопка Register stage-driven (DONE 30.05)
- Узлы 03 и 07: убран хрупкий keyword-regex (`account id|promo code|register|...|sign.*up.*1xbet`), заменён на детерминированное условие:
  `showButton = has_reg_button===true || new_stage==='REGISTRATION' || new_stage==='OLD_ACCOUNT'`.
- 03 = основной AI-send path (после `AI_MEDIA_DISPATCH`); 07 = registration path (после `06_IF`: `new_stage==='REGISTRATION'`).
- Бонус: 07 раньше мог НЕ дать кнопку на регистрации без ключевых слов — теперь даёт по этапу.
- Живой тест: WARMUP — кнопки нет; REGISTRATION — Register есть (+pin); OLD_ACCOUNT — "Register New Account" есть. Всё ок.
- LATAM2 TODO: тот же keyword-regex почти наверняка есть в узлах отправки LATAM2 — заменить так же на stage-driven. Это первый шаг при работе над LATAM2.
- Backup перед фиксом: `/Users/omir/Jarvis/backups/n8n/mycrm_AFdSGFs3ipz0mQID_20260530_192329.json`

### MY CRM — оставшиеся хвосты (TODO)
- DONE 30.05 — Этап 2: regex кнопки в узлах `03`/`07` заменён на stage-driven (`has_reg_button===true || new_stage===REGISTRATION/OLD_ACCOUNT`), хрупкий keyword-regex убран. Живой тест пройден: WARMUP без кнопки, REGISTRATION/OLD_ACCOUNT с корректной кнопкой. См. урок выше.
- Старая запись `total_deposit=100.259...` в `users_my_crm` — округлить отдельным `UPDATE` (не срочно, Gold всё равно корректный).
- Замерить скорость AI после v2.2 (было ~8.3с total / ~3.3с AI) — насколько ускорилось от сжатия промпта.
- Видео-правило на WARMUP: решить, усиливать ли проактивный показ proof/видео.
- Косметика/чистота: donor-гео во фронте `my-crm/index.html` (India/Canada/Spain/Italy блоки, `trackIndiaEvent`, `777CA777`); чужие незакоммиченные правки (`currency MYR→RM`, `RESET_GEO`) — разобрать нужны или откатить; дубли активных webhook (`miniapp-reset-self-v1`, `check-access-es`); мёртвые узлы (`SEND TO USER`, `MIRROR_BOT_TO_TOPIC` и пр.); баг истории чата в MN (тот же `content/message`).
- DONE 01.06 — LATAM2 `funnel_events` / Daily Counter полностью закрыт: слой данных + слой отображения готовы, закреп LATAM2-группы обновляется workflow `LATAM2 Daily Counter` каждые 15 минут.


### MY CRM — Push Engine ↔ stage drift (частично DONE 01.06)
- DONE: Push Engine `T7k1OCKRS7ZHhCCs`, node `Build Pushes` — добавлен guard: не слать push, если `last_active` свежее 40 минут. Цель: не вторгаться в живой диалог. Mock: user `679809232` активен 2 минуты назад → push не ушёл бы. Применено и verified.
- DONE: MY CRM main workflow `AFdSGFs3ipz0mQID`, node `01`, sub-step A — `/start` больше не двигает stage: `new_stage=null` вместо `new_stage=current_stage`. Это не даёт node `02` сбрасывать `push_sent` на `/start`; текстовые `/start` ветки сохранены. Применено, verified, mock PASS.
- DONE: node `01`, sub-step C — добавлен ID-extraction из user text и AI tag `[PLAYER_ID: ...]`: `playerRegex=/\[PLAYER_ID:\s*(\d{10})\]/`, explicit phrases (`my id is`, `account id:`), fallback `1[6-7]\d{8}`, range `1670000000–1750000000`. Numeric block теперь ловит ID из фразы, не только чистые цифры. Mock PASS: `my number is 1234567890` не ловится как ID.
- Проверено после A/C: node count `137`, workflow active, webhook `mycrm-tg-router` цел, `chat_join_request` в `allowed_updates`, node `02` не тронут. Бэкапы: `before_node01_fix`, `before_substep_C`.
- TODO порядок для свежей сессии: сначала node `02` — сбрасывать `push_sent` только при реальной смене stage: `(new_stage && new_stage !== current_stage) ? 0 : old_push_sent`; это нужно до sub-step B, иначе удержание stage будет сбрасывать push на каждом сообщении.
- TODO затем sub-step B в node `01`: удержание stage для `REGISTRATION` и `DEPOSIT` (`if (!new_stage && current_stage==='REGISTRATION') new_stage='REGISTRATION'`, аналогично `DEPOSIT`). Делать только после фикса `02`.
- TODO последним sub-step D в node `01`: register-intent safety-net строгим английским regex (`ready to register`, `want to register`, `sign up`, `send link`, `promo code`). Не ловить `ok`/`yes`/`sure`/`continue`/`can I start with 40 RM`. Риск раннего перехода как в LATAM2 — обязательны строгие mocks.
- Рабочий порядок: `02 fix → B → D`, по одному шагу, каждый с fresh backup, readback, JS check, webhook invariant, mock. Эталон для осторожности — LATAM2 node `01`.



### LATAM2 NORMALIZE — service-update fix (DONE 31.05)
- Баг: `NORMALIZE` (Code-node, `runOnceForEachItem`) на Telegram service-update (`pinned_message` и др.) делал `return []` → runtime error `A 'json' property isn't an object`. Падало в т.ч. на собственном пине рег-сообщения бота. ~6% входящих executions падали на входе = потеря лидов.
- Фикс Б-2 (выбран по blast radius, не Б-1):
  - `NORMALIZE` на service-update теперь возвращает `{ json: { _drop:true, _drop_reason:'service_update' } }`.
  - Добавлен `IF_NOT_DROP_SERVICE` сразу после `NORMALIZE`: `_drop !== true → IF_KNOWN_BUTTON`; false = unconnected, drop.
  - Почему не Б-1 (фильтр в `Route TG Update`): тот узел роутит ВЕСЬ трафик + содержит inline-секреты + `chat_join_request` → слишком широкий радиус. `NORMALIZE`-фикс локален и защищает оба входа (proxy + Telegram Trigger).
- Живой тест: пин больше не роняет `NORMALIZE`, service-update тихо отбрасывается; обычный путь до регистрации работает.
- Backups: `before_stepA ...160922...`, `before_stepB ...161114...`.

### LATAM2 история чата (#2) — DONE 31.05
- Баг: цепочка поля сообщения была рассинхронизирована (как MY CRM/MN, но шире): storage пишет `message`, fetch/фронт ждали `content`; плюс shape mismatch — фронт ждёт `{ messages: [] }`, n8n отдавал raw row; плюс время `created_at` vs `time`.
- Таблица: `miniapp_chat_latam2` (`role`, `message`, `created_at`). Workflow Support Chat: `pc924v1tdLa8qX7H`. В Support Chat НЕТ Telegram Trigger → Telegram webhook не при делах, но после PUT всё равно проверять router invariant.
- Фикс A (Mini App history API): добавлен Code-узел `Build History Response` (`runOnceForAllItems`) между `Fetch History` и `Return History`; собирает `$input.all()` → `{ messages: [{ role, content, text, time: HH:mm }] }`, порядок ASC (старые→новые). Фронт НЕ трогали. Время = UTC `HH:mm`.
- Фикс B (AI-память): `Fetch Chat History Pin` select `role,content` → `role,message,created_at`; `Build Prompt` уже читал `item.message || item.content`, поэтому начал подхватывать реальный контекст диалога.
- Проверено: endpoint отдаёт правильный контракт; Mini App рисует историю (текст/порядок/время); AI помнит предыдущие сообщения runtime на втором message того же user.
- Backups: `pre_fixB ...173626...`, `pre_fixA ...174655...`.
- Остаток/TODO (не критично): `content/text` в response — дубль `message` для backward compatibility; позже можно добавить defensive fallback `m.message` во фронт.


### LATAM2 scoreboard / Daily Counter — DONE 01.06
- TODO #4 `funnel_events` — ПОЛНОСТЬЮ ЗАКРЫТ: слой данных + слой отображения.
- Слой данных: создана таблица `latam2_funnel_events` (1:1 схема с `my_crm_funnel_events`: UNIQUE `idempotency_key`, CHECK `event_name`, CHECK `no_private_keys`, CHECK `metadata object`, RLS on) и подключены 5 side-branch логгеров (`dialog_started`, `registration_cta_sent`, `player_id_submitted`, `deposit_proof_accepted`, `deposit_access_granted`).
- Слой отображения завершён. Workflow `LATAM2 Daily Counter` (`gy9OoMWO74zQHjRo`, `active=true`) обновляет закреп по Schedule каждые 15 минут.
- Логика НЕ как MY CRM (накопительно), а распределение по текущему `stage` из `users_latam2`: каждый юзер считается в одной строке — своей текущей стадии.
- В закрепе две таблицы: СЕГОДНЯ и ВЧЕРА по `created_at`, день считается в `Asia/Almaty`; UTC-границы дня Almaty: `19:00Z` предыдущего дня → `19:00Z`. Перекат в полночь Almaty автоматический по дате.
- Стадии scoreboard: `NEW` (Нажали Start), `ASK_COUNTRY`, `WARMUP`, `REGISTRATION`, `DEPOSIT` (ждут депозит), `ACCESS` (депозит+доступ), плюс `Всего`.
- State-таблица: `latam2_daily_counter_state` (1:1 с MY CRM), `chat_key='latam2_logs_group'`. Закреп `message_id=167496` в группе `-5120085659`.
- Credential: `Telegram LATAM2 Bot API` — `editMessageText` существующего закрепа. Бот `@nexusailat_bot` — админ с `can_pin`.
- Тест: ручной прогон обновил закреп корректно (сегодня `2`, вчера `23` с разбивкой по стадиям), форматирование чистое, подтверждено скрином.
- Reset тестового аккаунта для повторных тестов: DELETE из `users_latam2` + `miniapp_chat_latam2` + `latam2_funnel_events` по `user_id` (только LATAM2).

### УРОК (важно для всех будущих правок LATAM2): PUT перебивает webhook
- При активном Telegram Trigger в main workflow любой PUT/сохранение workflow заставляет n8n ПЕРЕРЕГИСТРИРОВАТЬ Telegram webhook на URL Telegram Trigger и СБРАСЫВАЕТ `allowed_updates` (теряется `chat_join_request` → заявки в канал не принимаются).
- ПРАВИЛО: после КАЖДОГО сохранения LATAM2 workflow — проверять `getWebhookInfo` и при сбросе делать restore: `setWebhook url=/webhook/latam2-tg-router`, `allowed_updates=[message, callback_query, chat_join_request]`, `drop_pending_updates=false`.
- РЕШЕНО (31.05): Start Trigger (Telegram Trigger) в main LATAM2 ОТКЛЮЧЁН (`disabled=true`). Проверено no-op PUT: webhook устоял на `/webhook/latam2-tg-router` со всеми 3 `allowed_updates` → PUT больше НЕ перерегистрирует webhook. Мина webhook-регрессии устранена. Трафик идёт через proxy/router (`Proxy Entry`). Live smoke ok: `/start`, callback, join request. Откат при необходимости: `Start Trigger.disabled=false` + PUT (вернёт прямой вход, но и конфликт webhook). Backup: `20260531_170949..._before_disable_Start_Trigger.json`.

### LATAM2 TODO — ранний AI-переход в REGISTRATION (НЕ решено, пропущено 31.05)
- Паттерн: AI Agent сам ставит `[UPDATE_STAGE: REGISTRATION]` на короткий ack (`"si"`/`"ok"`/`"listo"`) на 1-2 сообщении WARMUP, проскакивая прогрев. За 250 executions: 16 WARMUP→REGISTRATION, все через AI-тег, 12 из них на короткий ack. Паттерн, не код-баг.
- НЕ виноваты: фикс #5 (`regSignals`), узел `01` logic — код отрабатывает тег корректно. Причина — policy самой модели (промпт).
- Открытый вопрос (решает владелец): баг (рано гонит холодного → режет конверсию) или фича (напористый бот)?
- Если решат чинить БЕЗ трогания промпта: guard в узле `01` — не пускать в REGISTRATION, если WARMUP-обменов < N (держать на прогреве).
- Диагностика: execution `778039` (18:37, PE, `"si"` → REGISTRATION через AI-тег).
- Статус: ПРОПУЩЕНО по решению владельца 31.05, вернуться при желании.

### LATAM2 — диагноз курса валют (подтверждён сверкой 31.05-01.06; фикс — в этой сессии)
- Курсы в `RATE_BY_CURRENCY` устарели для нескольких валют. Проверять и править согласованно в `CLRSE_VISION` и `CALC_NEW_TOTAL_DEPOSIT`, плюс отображаемые пороги в `01` / `FAST_ROUTE` / `FAST_SEND_REG_WAIT`.
- `BO` / `BOB`: hardcoded курс `6.9`, реальный по сверке около `10 BOB/USD`. Бот видит `28 BOB` → считает `$4.06` → `approved Bronze`. Партнёрка 1xBet те же `28 BOB` показывает как `$2.80`.
- Сверка 5 `player_id`: `1677399123` нет в `users_latam2`; `1684598335`, `1685320903`, `1685929183`, `1685996539` есть. По найденным deposit executions `CLRSE_VISION` распознал `28 BOB`, `amount_usd_equivalent=4.06`, `status=approved`, `tier=Bronze`; `IF_AMOUNT_OK` пропустил. Для `1685929183` есть drift: текущий `player_id` в базе уже новый, а execution на момент депозита шёл по старому `player_id` этого же `chat_id`.
- Расчёт: `28 / 2.80 = 10` реальный курс. Текущий курс `6.9` завышает USD примерно на `45%`: минимум `28 BOB` = реально `$2.80`, не `$4`. Это НЕ баг логики проверки суммы, а устаревший курс.
- `VES`: hardcoded `140`, реальный около `555`. `560 VES` = примерно `$1.01`, а бот считает как `$4`; из-за этого проходят депозиты около `$1`. На момент проверки было `73 ACCESS` на `VE`.
- `ARS`: hardcoded `1400`, слегка занижен: `5600 ARS` примерно `$3.97`.
- `PE` / `EC` / `CL` / `CO` и стабильные валюты, если не считать BO-rate issue, задуманы как пороги `$4/$10` и в целом ок.
- Stale `BO:40` в `VISION_BRAIN` prompt не влияет на approval, потому что decision идёт в `CLRSE_VISION`, но его надо почистить заодно, чтобы не путал OCR/аудит.

### LATAM2 — фикс курсов VES + BO — DONE 01.06
- VES: курс `140→550`, пороги Bronze `560→2200 VES`, Gold `1400→5500 VES`. Изменено в 5 узлах: `CLRSE_VISION` (`GEO.VE` + `RATE_BY_CURRENCY.VES`), `CALC_NEW_TOTAL_DEPOSIT` (`GEO.VE`), `01`, `FAST_ROUTE`, `FAST_SEND_REG_WAIT`.
  Курс взят `550` (не рыночный `554`), чтобы круглые пороги дали ровно `$4/$10`: `2200/550=$4.00`, `5500/550=$10.00`. Mock PASS: `560 VES→rejected ($1)`, `2200→Bronze`, `5500→Gold`.
  Закрыта главная дыра: раньше `560 VES` считалось как `$4` (курс `140`), реально `$1` — проходили депозиты за доллар. Было `73 ACCESS` на `VE`.
- BO: курс `6.9→10` (реальный по сверке с партнёркой 1xBet), Bronze `28→35 BOB`, Gold `69` без изменений.
  АРХИТЕКТУРА: для BO одобрение по ЛОКАЛЬНОМУ порогу в BOB (`LOCAL_THRESHOLDS.BO={bronze:35,gold:69}`), НЕ через USD-сравнение (`35 BOB=$3.50<$4` по USD бы отклонился). USD-эквивалент только для аналитики. Вставлено в `CLRSE_VISION` (approval/tier) и `CALC_NEW_TOTAL_DEPOSIT` (второй guard tier/has_access по BOB). Display `35/69 BOB` в `01`/`FAST_ROUTE`/`FAST_SEND_REG_WAIT`.
  Mock PASS: `28 BOB→rejected`, `34→rejected`, `35→Bronze approved`, `69→Gold`.
  BO-промпты дочищены: `AI Agent` (`28/60→35/69 BOB`), `VISION_BRAIN` (пример `"40 $b"=28 BOB` → `"35 BOB"`, minimum map `BO:40→35`).
- ARS НЕ трогали (`5600 ARS≈$3.97`, расхождение копеечное).
- Все правки на Hermes (Opus 4.8), не OpenClaw. Бэкапы: `before_ves_fix`, `before_bo_fix`, `before_bo_prompt_cleanup`. Денежная логика делалась с mock+rollback (VES один раз откатывали из-за несведённых курс/пороги, исправили курсом `550`).

### TODO / хвосты (открыто)
- VES в промптах остался СТАРЫМ (рассинхрон с логикой): `AI Agent` — `VE: Bronze 4 USD, Gold 10 USD`, `VISION_BRAIN` map `VE:6`. Логика требует `2200/5500 VES`. Последствие: бот говорит венесуэльцу `4 USD`, внесёт примерно `560 VES` → отказ. ДОЧИСТИТЬ промпт VES (по аналогии с BO cleanup).
- PE Gold рассинхрон: `AI Agent` prompt `30 PEN` vs логика `37 PEN`. Дочистить.
- Живая проверка курсов через 1–2 дня на реальном трафике: реальные `VE`-депозиты `<2200 VES` теперь rejected (не проходят за `$1`)? `BO <35 BOB` rejected? Проверить executions.
- Косметика LATAM2 (не горит): float-хвосты `total_deposit`, orphan-узлы (`03`, `FAST_SEND_REG_WAIT`, `PRECLRE_ALBUM`, `SEND TO USER`, `Send Button to Admin`), `lat2c`-дубль фронта, inline-секреты в `Route TG Update`, `last_error_present=true` на webhook (старый флаг, глянуть).
- Ранний AI-переход `WARMUP→REGISTRATION` на короткое `si` (~8% реальных) — продуктовое решение, не баг (разгадка прогрева 31.05: была остаточная stage, не регресс).
- `CLAUDE.md` untracked в git — закоммитить.

## LATAM2 — session notes / DONE 2026-06-01

### LATAM2 — фикс курсов VES + BO — DONE 01.06
- VES: курс 140→550, пороги 2200/5500 VES (Bronze/Gold). 5 узлов: `CLRSE_VISION`, `CALC_NEW_TOTAL_DEPOSIT`, `01`, `FAST_ROUTE`, `FAST_SEND_REG_WAIT`. Курс 550 (не 554), чтобы `2200/550=$4`, `5500/550=$10` ровно. Закрыта дыра: раньше 560 VES считалось как $4 по курсу 140, реально ~$1.
- BO: курс 6.9→10 (реальный по сверке с партнёркой 1xBet: 28 BOB=$2.80). Bronze 28→35 BOB, Gold 69 без изм. Локальный порог `LOCAL_THRESHOLDS.BO={35,69}` в BOB (не через USD, т.к. 35 BOB=$3.50<$4). В `CLRSE_VISION` + `CALC_NEW_TOTAL_DEPOSIT`. Display 35/69. BO-промпты дочищены (`AI Agent`, `VISION_BRAIN`).
- ARS не трогали (`5600≈$3.97`, копейки).
- Все правки на Hermes (Opus 4.8). Бэкапы: `before_ves_fix`, `before_bo_fix`, `before_bo_prompt_cleanup`.

### LATAM2 Daily Counter — починен 01.06
- Counter `gy9OoMWO74zQHjRo` не обновлялся (закреп завис на 00:49). Найдены 3 проблемы (наследие сборки через OpenClaw/GPT-5.5):
  1. activation не зарегистрировалась в scheduler → передёрнуть active off→on;
  2. READ-узлы использовали `$env.SUPABASE_URL` (runtime блокирует env) → захардкожен base URL `https://wqnqybpbsxdcqmosohyt.supabase.co` как на MY CRM;
  3. `READ_USERS_YESTERDAY`/`READ_USERS_TODAY` брали даты из `$json` (после HTTP там ответ Supabase, не контекст) → привязаны к `$('PREPARE_CONTEXT').item.json`.
- После фиксов: тик success, все 7 узлов прошли, закреп ожил (обновляется каждые 15 мин). Логи `saveData` возвращены в `none`.
- УРОК: counter/workflow собирать на Hermes по эталону MY CRM: hardcoded public Supabase REST base URL, явные ссылки `$('NODE')`, не `$env`/не текущий `$json` для контекста после HTTP.


### MY CRM — Push Engine ↔ stage drift (FIX PLAN 01.06, superseded)
- Устарело как план: Push Engine guard уже применён, node `01` sub-step A и C уже применены. Актуальный статус/порядок следующих шагов см. выше: `MY CRM — Push Engine ↔ stage drift (частично DONE 01.06)`.

### TODO / хвосты после 01.06
- VES в промптах старый рассинхрон: `AI Agent` говорит `VE: 4 USD/10 USD`, `VISION_BRAIN` говорит `VE:6`, а логика требует 2200/5500 VES. Бот может сказать "4 USD" → юзер внесёт 560 VES → отказ. Дочистить промпт VES.
- PE Gold промпт 30 PEN vs логика 37 PEN — дочистить.
- Живая проверка курсов через 1–2 дня: реальные VE <2200 и BO <35 теперь rejected? Проверить executions.
- Косметика/техдолг: float-хвосты, orphan-узлы, `lat2c`-дубль, секреты в `Route TG Update`, `last_error` на webhook.
- `CLAUDE.md` untracked в git — закоммитить отдельно после approval.

### MY CRM — Push Engine ↔ AI stage drift (диагноз 01.06, чиним)

Симптом: активный юзер (`679809232`) вёл живой прогрев, но Push Engine влез со старым country-reminder `access is paused / choose your country`, сбив диалог.

ДВА бага:

1. **STAGE DRIFT** — main workflow `AFdSGFs3ipz0mQID`:
   - AI-path обновляет `users_my_crm.stage` только при явном `[UPDATE_STAGE:...]` от AI/парсера.
   - Узел `01` ищет stage через `stageRegex`.
   - Если AI не выдал тег — stage застревает: юзер активно общается, а в базе остаётся ранний `ASK_COUNTRY`.
   - Узел `02` при `/start` с тем же stage сбрасывает `push_sent → 0`.
   - `AI Agent` видит stage из базы: `$('00').stage`.

2. **PUSH ENGINE NO-GUARD** — workflow `T7k1OCKRS7ZHhCCs`, schedule 10 мин:
   - `Build Pushes` при `status === stage` берёт `anchor = last_reminder`.
   - `last_active` в этом случае игнорируется.
   - Нет фильтра “не слать активным”.
   - `Fetch Users` идёт без `last_active`-фильтра.
   - Поэтому Push Engine может отправить push юзеру, который писал минуту назад.

План фикса:
- **Баг 2:** добавить guard в Push Engine — не слать, если `last_active` свежее N минут, например 30–60.
- **Баг 1:** обновлять stage надёжнее — обсуждается отдельно.

## ПРОЕКТ: Беттинг-мини-апп ЧМ-2026 (Canada / ca-wc) — состояние 02.06.2026

**Состояние зафиксировано: 02.06.2026.**

### BOT BRIDGE — Kai / `bot.py`

Три фикса применены и работают:

1. **Дефис-баг** — prompt передаётся в Claude Code через `stdin` (`input=prompt`), не через `argv`; дефисы/спецсимволы больше не ломают запуск.
2. **Длинный ввод** — добавлен debounce-буфер **2.5с по `chat_id`**, чтобы склеивать длинные/разбитые Telegram-сообщения перед вызовом Claude Code.
3. **Рамки кода** — Telegram-ответы идут через `parse_mode=HTML` и `<pre>`, чтобы code blocks не ломали Markdown.

Бэкапы: `/Users/omir/Jarvis/exports/kai-bot-backups/`.

### ПРОГНОЗЫ — готовы и в проде

- Готовы **72 карточки WC2026**: короткие notes с разными игроками.
- Supabase: `public.wc2026_predictions` в проекте `wqnqybpbsxdcqmosohyt`:
  - 72 строки;
  - `card jsonb`;
  - RLS ON.
- n8n webhook: **`Match Prediction CA-WC`** / `JfxHevEzDMC3KoST`:
  - `active=true`;
  - path: `/webhook/match-prediction-cawc`;
  - контракт ответа: `{ok, match, teaser, main, unlocked, markets, blocks}`;
  - `unlocked` временно `true`.
  - TODO: брать `unlocked` из `check-access-cawc`.
- Frontend: `ca-wc/index.html` тянет live-прогнозы.
- Тема notes **ЗАМОРОЖЕНА**:
  - anti-template прогон на 72 деградировал в слова-затычки `third` / `infield` / `aerial`;
  - откат на версию `all_market_notes_20260602-1322`;
  - именно эта версия лежит в Supabase.
- Косметика на потом: повторы оборотов между матчами.

### ВОРОНКА `ca-wc` — клон MY CRM эталона

#### F1 — таблицы и check-access

- Таблицы: `users_cawc` + `miniapp_chat_cawc`.
- RLS ON; `service_role` обходит RLS.
- `check-access-cawc` workflow: `zFzfC2xwHoxj07Di`.
- Статус: **INACTIVE**.
- Access allowed iff `stage === 'ACCESS'`.

#### F2a — главный бот

- Workflow: **`NexusAI CA-WC 🇨🇦⚽`** / `VI5QQWsqU73zNnjh`.
- Telegram credential: **`Telegram CA-WC Bot API`** / `IjAxbH525fG1qGzs`.
- Core send-ноды переведены на `ca-wc` токен.
- Non-MVP nodes disabled:
  - `RELAY_*`;
  - `MIRROR_*`;
  - `POST_SCOREBOARD_*`.
- `Start Trigger` disabled.

#### F2b — prompt surgery / логика

- Один тир: **$50 CAD**.
- Гео/язык/валюта: **CA / EN / CAD**.
- PH/Malaysia leftovers убраны.
- Контракты целы:
  - `[UPDATE_STAGE]`;
  - `[PLAYER_ID]`;
  - `[SET_COUNTRY]`;
  - `[SEND_VIDEO]` / `[SEND_PROOF_ALBUM]` сохранены как parser contracts, но media выключено.
- `PARSE_VISION`: `MIN_DEPOSIT=50`.
- `player_id` range: `1670000000–1999999999`.
  - TODO: подтвердить реальный диапазон 1xBet 2026.
- Промо/ссылка — плейсхолдеры:
  - `{{CAWC_PROMO}}`;
  - `{{CAWC_REF_LINK}}`.

#### F2c — activation / live bot

- Bot: `@nexusaicanadawc_bot`.
- Status: **ACTIVE**.
- Webhook: `/webhook/cawc-proxy-entry`.
- `allowed_updates`: `[message, callback_query]`.
- Живой многоходовый диалог **РАБОТАЕТ**.
- Починены регрессии:
  - битое выражение `AI Agent CurrentTier` после F2b;
  - малайзийское media нейтрализовано (`media off`);
  - prompt перепозиционирован с crash/game/casino-подачи на **спорт-беттинг WC2026** + обычные emoji.

### РЕШЕНИЯ

- Гейт: **$50**, один тир.
- Push отложен.
- Промо + ref-link 1xBet CA: Omir ждёт от партнёрки; нужны к F3.
- Токен только в n8n credential / approved secret source, не в чат и не в память.

### TODO / NEXT

1. Omir — ре-тест перепозиционированного prompt: `/start → текст → прогрев`.
2. Тест депозита: `vision → $50 → ACCESS`.
3. F3:
   - промо/ссылка;
   - deploy фронта;
   - скачать 16 фото стадионов локально, не хотлинкать;
   - Mini App menu button URL;
   - связать `unlocked` прогнозов с `check-access-cawc`.
4. Решить, нужен ли сигнальный канал: `chat_join_request → cawc-tg-router`.
5. Косметика / hardening:
   - promo `777CA777` в CONFIG фронта;
   - `not  wins` двойной пробел;
   - LATAM2 `last_error` хвост;
   - миграция Code-node токенов в credential;
   - betting-media content;
   - `ca-wc/index.html` untracked в git.

### Adjacent funnels

- MY CRM / LATAM2 за сессию 02.06 не тронуты.
- Вебхуки и счётчики смежных воронок целы.



## СЕССИЯ 02-03.06.2026 — итоги

### CA-WC warmup_fix DONE
- AI Agent `VI5QQWsqU73zNnjh`: переписана WARMUP-политика — короткий прогрев без простыни регистрации.
- Сужен триггер `REGISTRATION` до явного user intent.
- Убран `{{CAWC_PROMO}}` из `AI Agent` / `03` / `01`.
- Применено; webhook `cawc-proxy-entry` цел.
- Статус: ждёт живой тест.
- TODO: вернуть реальный промо; косметика `AI signal engine` в node `03`.

### UZ vision DONE
- Workflow `kIRC04gY5stu8LPs`, узел `Build Vision Request Body`.
- Модель заменена: `google/gemini-2.0-flash-001` → `google/gemini-2.5-flash`.
- Причина: OpenRouter выпилил всё семейство `2.0-flash`; ошибка `404 No endpoints found`.
- Статус: работает.
- Риск: тот же slug есть на MY CRM эталоне (`VISION_BRAIN`, `AFdSGFs3ipz0mQID`) — депозитный vision MY CRM вероятно тоже лежит; проверить.

### LATAM2 Meta / CAPI
- Расхождение Meta `100` vs реально `47`: два Subscribe-узла считают “открыл бота” + view-through надув.
- Реальная воронка: `46` старт → `16` player_id → `5` депозит.
- Аудит Meta CAPI Registration: чисто — 1 узел, `event_id = latam_manual_reg_{user_id}` стабильный, объём примерно `103/7д`.
- MATCH QUALITY DONE:
  - `ALTER users_latam2` добавил `client_ip` + `user_agent`.
  - Узел `02.1` сохраняет из `RESOLVE_TRACK`.
  - Meta CAPI Registration шлёт `client_ip_address` / `client_user_agent` из `$('00')`.
  - node count: `121`.
- Subscribe-dedup DONE: `event_id` без `message.date` (`naima_sub_{chat_id}`).
- Omir сам переключает оптимизацию адсета на `CompleteRegistration`.

### TR CRM — состояние 03.06.2026

#### DONE
- F1 таблицы: `users_tr_crm` + `miniapp_chat_tr_crm`.
- Check Access: workflow `UtPLLe8c1ubVgYsm`, path `check-access-trcrm`, `INACTIVE`.
- F2a каркас: workflow `pRYOqrsRV6GrFtsf`, бот `@nexusaiturkey_bot`.
- Пороги: `700 / 1400 TRY`.
- Инфра-группа: `-5195822393`.
- CAPI/custom data: `geo=trcrm`, currency/TRY родные.
- Prompt: турецкий; без имени; без промокода; Player ID убран; кнопка `registered_done → DEPOSIT`.
- Register/ref link: `sp1nwin.com/QSNDZ2`.
- Media: кружок перезалит на TR-токен `8761335541`; proof media = TR public URL.
- Vision: `google/gemini-2.5-flash-lite`; TR token используется в `image_url`; raw screenshots/base64 не хранить.
- Activation: `active=true`, webhook path `trcrm-proxy-entry`.
- `/start` scripted localization done.
- Subscribe dedup done: `event_id = nai1_sub_{chat_id}` без `message.date`.

#### TODO для новой сессии
1. Дочистить donor-остатки в out-of-scope узлах: `FLAG_MY×52`, `WINNERS×6`, `did someone×2`, `🇲🇾×10`.
2. Чистый `/start` тест: reset test-user из `ASK_COUNTRY`.
3. Support Chat clone → `miniapp_chat_tr_crm`.
4. Frontend `tr/ → tr-crm/`: webhooks `trcrm`, пороги `700/1400`, `APP_NS=nexustrcrm`.
5. F3 deploy + menu URL + активировать `check-access-trcrm`.


### TR CRM → MaltCasino + Mini App, сессия 03-04.06.2026

- TR CRM (`pRYOqrsRV6GrFtsf`, `@nexusaiturkey_bot`) переведён с донор-1xBet на MaltCasino, поднят Mini App, закрыт CAPI.
- Рабочий протокол сессии: всё через `backup → mock → apply → readback/export → сверка Кая`; подробности по узлам и raw exports лежат в `/Users/omir/Jarvis/exports/tr_crm/`.

#### DONE
- Донор-дочистка A→D:
  - MY-token → TR-token;
  - 5 deposit-текстов переведены на турецкий с порогами `₺700 / ₺1400`;
  - proof-caption: `KAZANANLAR` + флаг `🇹🇷`;
  - CAPI `funnel` → `nexusai_tr_crm`.
- M1-M5:
  - rebrand `1xBet` → `MaltCasino` + анимированная регистрация;
  - Vision gate переведён на MaltCasino;
  - фото-пруфы убраны, видео-кружок оставлен;
  - Mini App messaging обновлён;
  - временно оставлен приём `1xBet` для теста.
- Hotfixes:
  - node `01`: `FLAG_TR_ID undefined` исправлен;
  - `registered_done` routing добавлен в `NORMALIZE` whitelist;
  - `VISION_BRAIN` битый `jsonBody` → валидный JSON body.
- Registration pin once:
  - node `03` + `FAST_SEND_REG`;
  - guard по переходу стадии, чтобы пинить регистрацию один раз.
- Dialog log в группу `-5195822393`:
  - включены `Report to Group`, `Admin_Photo`, `FAST_GROUP_LOG` по LATAM2-паттерну.
- Top 100:
  - Researcher собрал 114 турецких ников.
- Mini App `tr-crm/` в проде:
  - commit `7fdab3a`;
  - GitHub Pages поднят;
  - `check-access-trcrm` workflow `UtPLLe8c1ubVgYsm` active;
  - menu button: `Uygulama`.
- CAPI полный аудит + фикс:
  - старый pixel `801358272846553` оказался чужим для запуска TR CRM; 05.06 все 5 CAPI-узлов workflow `pRYOqrsRV6GrFtsf` переключены на Turkey dataset pixel `1035829422436944` + новый Meta token (не хранить/не печатать токен);
  - `event_source_url` → `tr-crm`;
  - `Send Purchase` disabled;
  - match-quality: `client_ip` / `user_agent` persist → Purchase как LATAM2;
  - `ALTER users_tr_crm` добавил `client_ip` + `user_agent`.
- `check-access-trcrm`:
  - inline `service_role` ключ убран;
  - используется credential `Supabase account`.
- Node `03`:
  - кнопка регистрации локализована как `Kayıt ol`.

#### TODO перед запуском
1. Откатить временный приём `1xBet` → `maltcasino-only` (`M5-B`, Vision).
2. Сделать Support Chat для TR CRM:
   - clone LATAM2 workflow `pc924v1tdLa8qX7H`;
   - exact webhooks: `nexusai-trcrm-chat` / `nexusai-trcrm-history`;
   - table: `miniapp_chat_tr_crm`;
   - подключить Chat-вкладку Mini App.
3. Выключить `saveDataSuccessExecution`: `all` → `none`.
4. CAPI validate на реальном рекламном трафике: убедиться, что Meta принимает события.

### Cross-funnel status — 03.06.2026

- Subscribe-дедуп DONE на `TR CRM`, `LATAM2`, `MY CRM`: Subscribe `event_id` без `message.date`.
- Трафик `LATAM2` + `MY CRM` разрешён к запуску.
- Dual-audit протокол Кай+Джарвис активен: экспорт read-only снимков в `/Users/omir/Jarvis/exports/<воронка>/`, Кай читает полный экспорт сам, финальный фикс = синтез двух разборов.

## Метод Кай+Джарвис: dual-audit

При работе с воронкой Jarvis использует dual-audit как дополнительный контроль качества:

1. Jarvis автоматически готовит read-only снимок в `/Users/omir/Jarvis/exports/<воронка>/`:
   - полный workflow JSON;
   - дамп последних n8n executions по воронке;
   - ключевые Supabase-метрики по соответствующим таблицам/событиям.
2. Кай читает выгрузку целиком, не пересказ Jarvis, и даёт независимый разбор.
3. Финальный фикс формируется как синтез двух видений: Jarvis + Кай.
4. Применение остаётся по стандартному безопасному циклу: `draft → mock → apply → backup`.
5. Файлы в `/Users/omir/Jarvis/exports/<воронка>/` не удаляются и не ротируются автоматически. Чистка — отдельная ручная процедура раз в месяц под контролем Кая + Omir.

## СЕССИЯ 04.06.2026 — TR CRM запуск-подготовка

### DONE
1. Откат 1xBet → MaltCasino-only (4 узла: VISION_BRAIN, PARSE_VISION, REJECTED_MSG, RELAY_FORUM_HANDLE). PARSE_VISION: if (platform !== 'maltcasino'). Mock 1xbet→wrong_platform PASS. Backup before_maltcasino_only_rollback.
2. Support Chat clone: NexusAI TR CRM Support Chat 🇹🇷 (oA6EDhwCQsJuYIk8, active, 14 нод, без Telegram Trigger). Вебхуки nexusai-trcrm-chat/history. Build Prompt локализован: GEO→TR (700/1400 TRY, Türkiye), Platform→MaltCasino, ES→TR, game scope = игры мини-аппа TR (crash: Aviator/JetX/Chicken Road/Penalty/Mines/Balloon + слоты: Sweet Bonanza/Gate of Olympus/Sugar Rush). geo='trcrm', lang='tr', users_tr_crm, Log to Group→-5195822393 через credential. Все mock PASS.
3. saveDataSuccessExecution main pRYOqrsRV6GrFtsf: all→none (error остался all). Webhook trcrm-proxy-entry цел.
4. Reset тест-юзера 930309275 (users_tr_crm + miniapp_chat_tr_crm), mode_global цел.

### ПОЛНЫЙ АУДИТ (пакет /Users/omir/Jarvis/exports/tr_crm/full_audit_20260604_122415/)
- 🟢 Чисто: money-path maltcasino-only, пороги 700/1400 консистентны, CAPI TR (pixel 801358272846553, url tr-crm), webhook invariant, фронт↔бэк сходятся, нет 1xBet/LATAM/MYR в активном пути.
- 🟡 node 09 (FLAG_MY undefined вместо FLAG_TR) — ПЕРЕОЦЕНЕНО: НЕ блокер. Срабатывает только на normal/AI-пути при new_stage===DEPOSIT (node 08 IF). Кнопка registered_done идёт по FAST_ROUTE→FAST_SEND со своим корректным турецким текстом депозита, node 09 ОБХОДИТ. Латентная мина, фикс тривиален (FLAG_MY→FLAG_TR), но запуску не мешает.
- 🔴 SECURITY: RESOLVE_TRACK (АКТИВНЫЙ, CAPI match-quality путь) держит inline service_role ключ sb_secret_VI-... в headers. Тот же ключ в disabled relay. → мигрировать в credential + РОТИРОВАТЬ ключ.
- 🟡 Bot token 8761335541:AA... inline во многих Code-узлах (техдолг эталона).
- 🟡 RELAY_FORUM_HANDLE (ручной handler: take/reg/ban из группы) ВЫКЛЮЧЕН + донор-остатки MY_CRM_RELAY/geo:'my'/malaysia. Вопрос к omir: by design или handler-CRM нужен?
- 🟡 Таблицы tr_crm_funnel_events НЕТ — аналитика воронки (как MY CRM/LATAM2) для TR не построена.

### РЕШЕНИЕ ПО ЗАПУСКУ (открыто)
- Не проверен живьём только реальный скрин MaltCasino → vision → ACCESS (нет тестового скрина MaltCasino). Всё до депозита прошло.
- План запуска: временно включить success-логи → малый контролируемый трафик (3-5 живых до депозита) → следить за vision→ACCESS в executions → если чисто, раскрутить + логи в none. Либо omir достаёт реальный скрин MaltCasino сам (рег по sp1nwin.com/QSNDZ2 + мин депозит) для проверки до трафика.

### ХВОСТЫ (hardening, не блокеры)
- node 09 FLAG_MY→FLAG_TR.
- RESOLVE_TRACK + Support Chat Fetch History inline ключи → credential + ротация.
- M5-B/Vision уже maltcasino-only (DONE). Support Chat живой тест вкладки Чат omir-ом.
- Bot token inline → credential.
- ### MY CRM (04.06, не трогали)
- Цена за PDP (Subscribe-оптимизация) скакнула: утром ~$1.5, потом $25/2 PDP. CAPI аудит: конфиг цел, pixel/token/url родные MY, не перепутаны с TR. Вчерашний Subscribe-dedup (event_id nai1_sub_{chat_id} без message.date) — либо срезал повторные Subscribe (меньше событий → дороже), либо утренние $1.5 были надуты дублями. На 2 событиях вывод не делать (шум). Оставили как есть.



## СЕССИЯ 05.06.2026 — итоги

### БАЕР
Ресёрч 2026 (10 файлов baer/research/2026-06-04/) интегрирован в суб-агента: .claude/agents/baer.md + baer/AGENT.md читают research + блок «Свежие цифры 2026». Баер=стратег-аналитик, не автокликер. baer/ untracked.

### VISION — мёртвая gemini-2.0-flash почищена (3 воронки)
OpenRouter выпилил семейство 2.0-flash→404 (onError=continueRegularOutput прятал). Фикс →google/gemini-2.5-flash-lite: MY2 (58p4EKvLlMZFrH5p VISION_BRAIN), MY CRM (AFdSGFs3ipz0mQID VISION_BRAIN + RELAY_PRIVATE_TO_TOPIC/RELAY_FORUM_HANDLE на 2.0-flash-lite-001). Бэкапы в /Users/omir/Jarvis/backups/n8n/.

### MY CRM — диагноз «дорогого трафика» того человека
Канал-барьер: 53 клика→35 invite→только 6 join (канал съел 83%)→1 PDP, + мёртвый vision (скрин депозита не читался). Лекарство — прямой вход (сделан).

### MY2 (NexusAI MY, своя Малайзия omir) — ядро на ИИ
Э1+Э2+Э3 одним PUT (backup before_my2_core_E1E2E3_20260604_235835): промпт Alex MY CRM-style (без ASK_COUNTRY, оффер 777MY777/betoholictrack/RM50/RM80); парсер 01 (медиа [SEND_VIDEO]/[SEND_PROOF_ALBUM]→has_video/has_proof, убран country/[SEND_IMAGE], /start чистый AI); send-layer (WARMUP→03, кнопки навигации orphan, медиа split, SEND_ALBUM без caption).
🔴 OPENER НЕ ДОДЕЛАН (пауза): первый /start идёт отдельной hardcoded веткой (NEXUS-текст, спрашивает страну) В ОБХОД AI Agent; старая country-логика убрана→юзер на «Malaysia» зависает. TODO: /start через AI Agent (Alex-opener без страны). Тест-юзер 930309275.

### Subscribe gating-фикс IF_HAS_FBP +startFbc на TR/LATAM2/MY CRM
Корень: Subscribe гейтился только startFbp (fbp часто пустой — лендинг строит fbc локально из fbclid, fbp от пикселя теряется в Instagram in-app webview). fbc-без-fbp не отбивались. Фикс +startFbc notEmpty (combinator or) на TR(pRYOqrsRV6GrFtsf)/LATAM2(e1KPmuaHot6wn4Kz)/MY CRM(AFdSGFs3ipz0mQID). TR подтверждён: 6 Subscribe events_received=1.

### LATAM2 — прямой вход
gating применён. event_id channel УЖЕ выровнен (naima_sub, ложная тревога про дубль снята перепроверкой Кая). Лендинг indexLatam2ESTAI.html→прямой бот (track_id→t.me/nexusailat_bot?start=f_, кнопка ABRIR EN TELEGRAM). omir заливает FileZilla.

### MY CRM — прямой вход ПОЛНОСТЬЮ готов
#1 channel dedup (Mj2OSisY1jYfl1wG Route TG Update mycrm_chsub_${userId}_${eventTime}→nai1_sub_${userId}, РЕАЛЬНЫЙ дубль). #2 gating. #3 A мгновенный редирект (фронт indexCRMMYKana.html client trackId+keepalive БЕЗ await + landing-track ACj1MJHpq3zdUxwu принимает client track_id) + RESOLVE_TRACK retry (до 3×400мс от гонки). Лендинг прямой nexusaimycrm_bot, pixel 981049354379856. omir заливает.

### ВАРИАНТ A лендингов (мгновенный редирект)
Задержка была: фронт ждал await fetch(webhook) перед редиректом. A: client trackId, fetch keepalive БЕЗ await, мгновенный редирект; webhook принимает client track_id; RESOLVE_TRACK retry от гонки. Применён MY CRM. TODO LATAM2 (+ убрать createChatInviteLink из прямого).

### TR — Subscribe работает, узкое место воронка
Subscribe ОТБИВАЕТСЯ (FBP-path 6×events_received=1). MAIN-path Meta CAPI Subscribe мёртв (leads-gate 0 запусков), FBP покрывает (тот же event_id nai1_sub/pixel 801358272846553). Лендинг indexTurkeyEstai прямой. 🟡 Match quality: IP пустой (ipwho.is ненадёжен). 🟡 channel event_id trcj_subscribe≠bot nai1_sub→при mixed дубль. Цифры сегодня: 10 кликов→7 стартов→6 Subscribe. 🔴 Воронка глохнет: REGISTRATION 0/ACCESS 0, 4 застряли ASK_COUNTRY.
### ОТКРЫТЫЕ TODO (приоритет)
- TR: ЗАКРЫТЬ окно saveDataSuccessExecution=all (висит на проде); match quality IP; почистить мёртвый MAIN-path leads; event_id channel если mixed; воронка ASK_COUNTRY застревание + REGISTRATION 0.
- LATAM2: #3 A мгновенный редирект + retry + убрать createChatInviteLink.
- MY2: opener-фикс (/start через AI Agent, Alex без страны); кружок sendVideoNote (Э4).
- Заливки FileZilla omir: indexLatam2ESTAI, indexCRMMYKana, indexTurkeyEstai (+ nexusai_avatar.jpg).
- Security: inline service_role+токены в RELAY (MY CRM) / RESOLVE_TRACK (TR) — мигрировать+ротировать.
- baer/, .claude/, ca-wc/ untracked в git.


## СЕССИЯ 07.06.2026 — итоги

### MY2 — pixel swap DONE
- MY2 pixel переключён на `1840632620657154` (DONE). Не печатать/не хранить Meta token; pixel-only факт безопасен.

### CA-WC — почти готов к трафику
- CA-WC почти готов к трафику; подробности и контекст смотреть в `KAI_MEMORY`.
- Осталось перед запуском: залить новый лендинг (уточнить/проверить домен), добавить hero/footballer assets, подключить/проверить лог-группу `-5066303738`, вернуть execution logs в `none`, пройти E2E.

### TR CRM — dialog logger DONE
- Диалоговый логгер TR CRM вынесен из `miniapp_chat_tr_crm` в отдельную таблицу `tr_crm_dialog_log` (DONE): `user_id`, `role`, `text`, `stage`, `created_at`, RLS ON.
- Причина: `miniapp_chat_tr_crm` питает вкладку Чат mini-app; туда нельзя лить прогрев основного бота, иначе support history смешивается с bot-dialog.
- 4 ветки логгера: user после `NORMALIZE`, assistant после `03`, assistant после `FAST_SEND_*`, assistant после `Send Country Buttons`.
- Затык `ASK_COUNTRY` оказался stage drift / неполное логирование, а не реальное застревание юзера в UX.

### Security
- Security audit: 41 таблица с RLS OFF. Нужен отдельный security-hardening проход; не чинить массово без плана/approval.

## СЕССИЯ 08.06.2026 — итоги

### 🇹🇷 TR CRM пуши — собраны, движок в бою
- Push Engine nEOGkCuiKN4pEWm4 (active, 13 нод, logs none, cron 10мин, time-window 20-23+12-14 Istanbul). 4 стадии×3 касания, серия на reminder_count, priority sort (DEP→REG→WARMUP→ASK_COUNTRY), guards (last_active<60/banned/ACCESS/drift), anti-spam (2 варианта текста/cap 25).
- Кнопки гибрид: DEP/REG→url-реф sp1nwin.com/QSNDZ2; WARMUP/ASK_COUNTRY→callback push_resume (Devam et). Send-слой разветвлён: IF Button URL?→Send Push URL / Send Push Callback (каждая кнопка только своё поле, без undefined).
- Callback-resume (main pRYOqrsRV6GrFtsf): push_resume→NORMALIZE fake private message→мимо FAST→AI Agent с RecentDialog из tr_crm_dialog_log (conditional)→01 stage-guard. ANSWER_PUSH_RESUME_CALLBACK side-branch. paired-item фикс: .item→.first() системно (129 refs/52 nodes). ALTER users_tr_crm +bot_blocked/blocked_at. RESET_BOT_BLOCKED_INBOUND.
- Send Push фиксы: credential (HTTP→native Telegram node, не $credentials.accessToken в выражении) + inline-кнопки (undefined→разветвление) + terminal-handler (blocked/deactivated/can't initiate/403→bot_blocked, не ретраить).
- Первая волна 08.06 вечер: 63 push, грязная (кнопки падали до фикса). ЧИСТАЯ волна — 09.06 вечер 20:00 Istanbul. TODO: проверить success rate + первые ЖИВЫЕ нажатия push_resume (механика не видена на живых). 24h follow-up cron 425c030cfdd8 (09.06 20:30).
- TODO мелочь: TR main webhook last_error HTTP 502 @19:26 (транзиент) — глянуть не повторяется.

### 🇰🇬 KG (Кыргызстан) — НОВОЕ ГЕО, поднято с нуля 08.06, клон UZ screenshot-воронки
- Логика: /start→бот просит скрин 1xBet→vision читает сумму KGS→Bronze(≥700)/Gold(≥1500)→доступ. Оффер 1xBet, реф-ссылка НЕ нужна.
- users_kg (RLS ON, схема users_uz 1:1, defaults kg/KGS). check-access-kg WXepu7t5sY0aCyQM (ACTIVE, читает users_kg, service_role обходит RLS, CORS vedatoff12-boop.github.io). Main-бот meBBI25s68N6alDM (ACTIVE, @nexusaikg_bot, credential KG BOT le7NXEJ6ciwnBYwl, vision OpenRouter Kanat AI gemini-2.5-flash под 1xBet, пороги 700/1500). Фронт kg/index.html задеплоен commit 3b39f72 → https://vedatoff12-boop.github.io/nexus-app/kg/ (APP_NS nexuskg, кыргызский, без чата/pixel/реф).
- Vision LIVE-тест PASS: скрин 1xBet 1000 KGS→bronze_valid/confidence 0.95→users_kg bronze→кыргызское сообщение.
- TODO до полного запуска: (1) menu button @BotFather omir-ом (@nexusaikg_bot→Menu Button→https://vedatoff12-boop.github.io/nexus-app/kg/?v=477d18e); (2) финальный E2E (открыть мини-апп→игры открываются bronze-доступом); (3) кыргызская вычитка носителем (опц); (4) косметика normalizeUzAccess имя в kg/index.html.

### 🇺🇿 UZ — chicken road локализация (выкачено)

- uz/index.html: кнопки сложности CSS .segmented/.seg-btn (🟢🟡🟠🔴), STEP→QADAM/«N qadam», лимит-текст Chicken Road узбекский. Задеплоено Джарвисом. TODO: узбекская вычитка формулировок (QADAM).
- Доступ-лок YOPIQ был транзиент (fetch без ретрая→разовый сбой→showLock). CORS check-access-uz=vedatoff12-boop.github.io верный (домен совпадает). Опц: добавить ретрай в handleGameClick.

### УРОКИ сессии
- Push-движки Send Push: native Telegram node с credential (НЕ $credentials.accessToken в выражении — n8n резолвит undefined); inline-кнопки — разветвлять url/callback (native node давится undefined), mock ОБА типа.
- Массовая правка JS-фронта (локализация/broad-patch) задевает идентификаторы кода → обязателен diff идентификаторов + full regression всех путей (не «загрузилось ок»).
- Диагностика-first перед фиксом: гипотезу проверять данными (unreachable оказалась button-баг).
- check-access CORS привязан к домену хостинга мини-аппа (vedatoff12-boop.github.io/nexus-app/<geo>/) — один origin для всех гео.

## WC26ES — session notes / AR launched 2026-06-10

- WC26ES (MX+AR, NexusAI FIFA 2026 / SuperComputer, 1xBet) built 09-10.06; AR launched. GEO is resolved from `start_param` prefixes `mx_` / `ar_`, not IP.
- Bot: `@nexusaififa_bot` / id `8950763672`. Main workflow `o51ea5qjYv2esBJi` active. Shared landing-track workflow `ACj1MJHpq3zdUxwu` writes/reads attribution via `agent_memory`.
- Active backend workflows: `check-access-wc26es` / `6dJ8FChbu8ytl47d`; `match-prediction-wc26es` / `jTH08f8Zpbg6qRlM`.
- Money/config: single tier; thresholds `170 MXN` / `14.000 ARS`; promo `MXWC26` / `ARWC26`; ref base `sp1nwin.com/5chgyd?sub_id=`.
- CAPI per GEO: MX pixel `987287450598713`, AR pixel `1413301670570912`. Log group `-5129281110` uses the block format `Клиент / Вопрос / Ответ / ID`.
- Frontend: `wc26es/index.html` deployed; Spanish prediction endpoint `match-prediction-wc26es`; dates localized `es-MX` / `es-AR`; INFO tab fixed.
- Predictions: 72 EN→ES cards in `wc2026_predictions_es`; team/country/name identity stays English, labels/prose are Spanish.
- Gating: `unlocked = (userId && userId !== 'preview') && stage === 'ACCESS'`; verified live for locked/preview and temporary ACCESS-positive test row. Test row cleanup confirmed `0` remaining.
- Landings: `indexFifaMX.html` / `indexFifaAR.html` on Desktop, Variant A. AR landing uploaded and handed to buyer.
- Live verification green for AR: voseo/SuperComputer/trust copy, no empty promises; deposit→access path (`MX 200 → ACCESS`, `100 → reject`); `RESOLVE_TRACK` lookup from `agent_memory` to fbp/fbc; CAPI; prediction gating.
- Remaining non-blockers: upload MX landing if MX is launched; Support Chat backend (`nexusai-wc26es-chat/history`); prediction icon cosmetics; Facebook cloaking is Omir-side.
- Lesson: verify production by live code/data, not by “done” status; this caught the `unlocked=true` gating regression.

### TR COMBO — launch credential lesson 2026-06-11
- For TR COMBO, content-ready workflow was `qAzHWe6X1nLSRc7T` (Turkish/Betewin/TRY), but correct bot credential came from donor copy `yxNLOSBkXrk4aP4c`; live fix = swap only Telegram credentials to `TRWC Bot API`, keep node fingerprints unchanged, then activate and verify `@nexusaiturkey26_bot` webhook.
- If pending updates existed before activation, check executions immediately after activation; on 2026-06-11 two old updates drained successfully.

### TR COMBO — CasinoMaxi swap lesson 2026-06-11
- CasinoMaxi screenshots should be gated by visible brand/header + `Bakiye` balance, not strict domain, because mirrors can be numeric (e.g. casinomaxi####). Turkish money parser must treat comma as decimal and dot as thousands; thresholds stay 500/1000 TRY unless Omir explicitly changes them.

```
