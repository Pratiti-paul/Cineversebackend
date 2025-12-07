
import express from "express";
const router = express.Router();

const TMDB_BASE = "https://api.themoviedb.org/3";

let fetcher;
if (typeof fetch === "function") {
  fetcher = fetch;
} else {
  try {
    const mod = await import("node-fetch");
    fetcher = mod.default;
  } catch (err) {
    fetcher = null;
    console.warn("node-fetch not installed and global fetch not available.");
  }
}

function tmdb(path, params = {}) {
  if (!process.env.TMDB_API_KEY) return null;
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return url.toString();
}

async function safeFetch(url) {
  if (!url) throw new Error("TMDB API key missing (tmdb url is null).");
  if (!fetcher) throw new Error("No fetch available on server (install node-fetch or upgrade Node).");
  const resp = await fetcher(url);
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const err = new Error(`Upstream TMDb error: ${resp.status} ${resp.statusText} ${text}`);
    err.status = resp.status;
    throw err;
  }
  return resp.json();
}


const GENRE_MAP = {
  thriller: "53",
  drama: "18",
  family: "10751",          
  action: "28",
  adventure: "12",
  action_adventure: "28,12", 
  comedy: "35",
  horror: "27",
  romance: "10749",
  animation: "16",
  mystery: "9648"
};

router.get("/trending", async (req, res) => {
  if (!process.env.TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB_API_KEY not configured on server." });
  }
  try {
    const url = tmdb("/trending/movie/week");
    const json = await safeFetch(url);
    return res.json(json);
  } catch (err) {
    console.error("moviesRoutes /trending error:", err);
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    return res.status(status).json({ error: "Failed to fetch trending", detail: err.message });
  }
});

router.get("/latest", async (req, res) => {
  if (!process.env.TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB_API_KEY not configured." });
  }
  const region = req.query.region || ""; 
  const page = req.query.page || 1;
  try {
    const url = tmdb("/discover/movie", {
      sort_by: "release_date.desc",
      include_adult: "false",
      page,
      region
    });
    const json = await safeFetch(url);
    return res.json(json);
  } catch (err) {
    console.error("moviesRoutes /latest error:", err);
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    return res.status(status).json({ error: "Failed to fetch latest releases", detail: err.message });
  }
});

router.get("/genre/:name", async (req, res) => {
  if (!process.env.TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB_API_KEY not configured." });
  }
  const name = (req.params.name || "").toLowerCase();
  const page = req.query.page || 1;

  const genreId = GENRE_MAP[name];
  if (!genreId) {
    return res.status(400).json({ error: `Unknown genre '${name}'. Supported: ${Object.keys(GENRE_MAP).join(", ")}` });
  }

  try {
    const url = tmdb("/discover/movie", {
      with_genres: genreId,
      sort_by: "popularity.desc",
      include_adult: "false",
      page
    });
    const json = await safeFetch(url);
    return res.json(json);
  } catch (err) {
    console.error("moviesRoutes /genre/:name error:", err);
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    return res.status(status).json({ error: "Failed to fetch genre list", detail: err.message });
  }
});

router.get("/search", async (req, res) => {
  if (!process.env.TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB_API_KEY not configured." });
  }
  try {
    const q = req.query.query || "";
    const url = tmdb("/search/movie", { query: q });
    const json = await safeFetch(url);
    return res.json(json);
  } catch (err) {
    console.error("moviesRoutes /search error:", err);
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    return res.status(status).json({ error: "Search failed", detail: err.message });
  }
});

router.get("/:id", async (req, res) => {
  if (!process.env.TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB_API_KEY not configured." });
  }
  try {
    const url = tmdb(`/movie/${req.params.id}`, { append_to_response: "videos,credits,similar" });
    const json = await safeFetch(url);
    return res.json(json);
  } catch (err) {
    console.error("moviesRoutes /:id error:", err);
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    return res.status(status).json({ error: "Movie details failed", detail: err.message });
  }
});


router.get("/:id/reviews", async (req, res) => {
  if (!process.env.TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB_API_KEY not configured on server." });
  }

  try {
    const movieId = req.params.id;
    const page = req.query.page || 1;

    const cacheKey = `tmdb:reviews:${movieId}:p${page}`;
    if (!global.__tmdbCache) global.__tmdbCache = new Map();
    const cached = global.__tmdbCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json(cached.value);
    }

    const url = tmdb(`/movie/${encodeURIComponent(movieId)}/reviews`, {
      language: "en-US",
      page
    });

    const json = await safeFetch(url);

    global.__tmdbCache.set(cacheKey, { value: json, expiresAt: Date.now() + 90 * 1000 });

    return res.json(json);
  } catch (err) {
    console.error("moviesRoutes /:id/reviews error:", err);
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    return res.status(status).json({ error: "Failed to fetch reviews", detail: err.message });
  }
});


export default router;
