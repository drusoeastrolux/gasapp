# GasFinder — Production System Design

## What the App Currently Is

- Pure React/Vite SPA — no backend
- Calls Google Places API directly from the browser
- **Prices are randomly generated (`Math.random()`)** — not real data
- API key is in the Vite env (partially exposed to browser)
- No caching, no rate limiting, no persistence

At thousands of users this breaks in 3 ways: **Google API bill explodes**, **mock prices are a lie**, and **there's nothing protecting your API key**.

---

## Critical Gaps (before architecture)

| Problem | Risk at Scale |
|---|---|
| Mock prices | Users get random numbers — product has no value |
| No backend proxy | Every user directly burns your Google quota |
| No caching | 1,000 users in Houston = 1,000 identical Google Places calls |
| No rate limiting | Bots/scrapers destroy your API budget |
| API key in frontend | Anyone can extract it and use your quota |

---

## Target Architecture

```
                         ┌─────────────────────────────────────────┐
                         │           Cloudflare (Edge)              │
                         │   DDoS protection · SSL · CDN · WAF     │
                         └──────────────────┬──────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
            ┌─────────────┐        ┌──────────────┐        ┌──────────────┐
            │  React SPA  │        │  Backend API │        │  Static CDN  │
            │  (Vercel /  │        │  (Railway /  │        │  (assets,    │
            │  CF Pages)  │        │   Render)    │        │   fonts)     │
            └─────────────┘        └──────┬───────┘        └──────────────┘
                                          │
                         ┌────────────────┼────────────────┐
                         ▼                ▼                 ▼
                  ┌────────────┐  ┌─────────────┐  ┌──────────────┐
                  │   Redis    │  │  PostgreSQL  │  │ Google Places│
                  │  (Upstash) │  │  (Supabase) │  │   API (only  │
                  │  Cache     │  │  + PostGIS  │  │  via backend)│
                  └────────────┘  └─────────────┘  └──────────────┘
```

---

## Layer-by-Layer Breakdown

### 1. Frontend — Deploy as-is, but change API calls

The React app barely needs changes. You just point it at your backend instead of Google directly.

```
Current: browser → /api/v1/places (Google)
Fixed:   browser → your-api.com/stations → (backend caches + proxies)
```

Deploy to **Vercel** or **Cloudflare Pages** — both handle thousands of concurrent users for free. Static files served from CDN globally.

Remove the API key from the frontend entirely.

---

### 2. Backend API — Node.js (Express or Hono)

This is what you build new. It has three jobs: proxy Google Places, cache results, serve prices.

**Key endpoints:**

```
POST /api/stations
  Body: { lat, lng, radius }
  → Check Redis cache by geohash
  → Cache miss: call Google Places, store in Redis (TTL: 20 min)
  → Attach price data from DB or price service
  → Return to client

GET /api/prices/:place_id
  → Return latest known price for a station

POST /api/prices/report
  Body: { place_id, price, fuel_type }
  → User-submitted price report (crowdsourcing)
  → Store in DB, update cached price
```

**Rate limiting** — `express-rate-limit` or Cloudflare WAF rules:
- 20 requests/minute per IP for station searches
- 5 price reports/hour per IP to prevent spam

---

### 3. Caching — Redis (Upstash, pay-per-request)

This is your biggest cost saver. Gas stations don't move. You cache by **geohash** (a grid cell ~5km²):

```
Cache key: stations:geohash:{hash}
TTL: 20 minutes

1,000 users in Houston → 1 Google Places call (not 1,000)
Cost reduction: ~98%
```

Price cache:
```
Cache key: price:{place_id}
TTL: 60 minutes
Source: user reports or external price service
```

---

### 4. Database — PostgreSQL + PostGIS (Supabase)

Two tables to start:

```sql
-- Stations (synced from Google Places)
stations (
  place_id     TEXT PRIMARY KEY,
  name         TEXT,
  address      TEXT,
  location     GEOGRAPHY(POINT),  -- PostGIS for geo queries
  last_fetched TIMESTAMPTZ
)

-- User-reported prices
price_reports (
  id         UUID PRIMARY KEY,
  place_id   TEXT REFERENCES stations,
  price      DECIMAL(4,3),
  fuel_type  TEXT,    -- regular, premium, diesel
  reported_at TIMESTAMPTZ,
  ip_hash    TEXT     -- hashed IP for dedup
)
```

**Supabase free tier** gives you a real Postgres instance with PostGIS enabled. Upgrade when you hit limits.

---

### 5. Real Gas Prices (the actual problem)

Right now prices are `Math.random()`. For a real product you need one of:

| Option | Cost | Quality |
|---|---|---|
| **Crowdsourcing** (users report prices) | Free | Good at scale |
| **GasBuddy Data API** | Paid ($$$) | Great |
| **OPIS / Dow Jones fuel** | Enterprise | Best |
| **EIA API** (US gov, weekly averages) | Free | Low precision |

**Recommended path for a startup:** Start with the **EIA Open Data API** (free, weekly US average by state/region) as a baseline, then layer crowdsourced user reports on top. This is exactly what GasBuddy did early on.

EIA endpoint: `https://api.eia.gov/v2/petroleum/pri/gnd/data/` — returns weekly gas prices by US region, free, no auth needed.

---

### 6. API Key Security

Move `VITE_GOOGLE_MAPS_API_KEY` to the **backend only**. The browser should never see it.

On the Google Console, also:
- Restrict the key to your backend server's IP
- Set daily spend cap (e.g., $20/day hard limit)
- Set up billing alerts at 50%, 80%, 100%

---

## Cost Estimate at 10,000 Monthly Active Users

| Service | Cost |
|---|---|
| Vercel/CF Pages (frontend) | Free |
| Railway (backend, 512MB) | ~$5/mo |
| Supabase (DB) | Free → $25/mo |
| Upstash Redis | ~$0–10/mo |
| Google Places API (with caching) | ~$15–40/mo |
| Cloudflare (WAF + DDoS) | Free tier |
| **Total** | **~$20–80/mo** |

Without caching: Google Places alone would be **$320+/mo** at 10k users.

---

## Implementation Order

1. **Build the backend** — Express proxy for Google Places + Redis cache (biggest ROI, do this first)
2. **Swap mock prices for EIA data** — real numbers, even if weekly averages
3. **Add crowdsourced price reports** — DB table + POST endpoint + UI button
4. **Deploy frontend to Vercel** — point API calls at your backend URL
5. **Set up Cloudflare** in front of everything — free DDoS protection
6. **Add monitoring** — Sentry (errors) + Uptime Robot (uptime)

---

The single most impactful change is the **backend proxy with Redis caching** — it cuts your Google API cost by 95%+ and secures your key. Everything else builds on top of that.
