const FEEDS = [
  { name: "Trending🔥", url: "https://feeds.bbci.co.uk/news/rss.xml" },
  { name: "World", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  {
    name: "science and Tech",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  },
  { name: "Nepal", url: "https://kathmandupost.com/rss" },
  { name: "Sports", url: "https://feeds.bbci.co.uk/sport/rss.xml?edition=uk" },
  { name: "Business", url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
  { name: "health", url: "https://feeds.bbci.co.uk/news/health/rss.xml" },
  {
    name: "Entertainment",
    url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
  },
];

const PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";
let allArticles = []; // stores every article
let activeCategory = "All";
async function loadAllFeeds() {
  document.getElementById("newsGrid").innerHTML = "Loading...";

  for (const feed of FEEDS) {
    const res = await fetch(PROXY + encodeURIComponent(feed.url));
    const data = await res.json();

    // Tag each article with its category
    const tagged = data.items.map((item) => ({
      ...item,
      category: feed.name,
    }));
    allArticles = [...allArticles, ...tagged];
  }

  buildCategoryNav();
  renderCards(allArticles);
}
// Date & Time
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = now.toLocaleDateString("en-US", options);
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("datetime").textContent = `${date} | ${time}`;
}
updateDateTime();
setInterval(updateDateTime, 1000); // updates every second

// Weather
fetch("https://wttr.in/Pokhara?format=j1")
  .then((response) => response.json())
  .then((data) => {
    console.log("Temperature:", data.current_condition[0].temp_C, "°C");
    console.log("Weather:", data.current_condition[0].weatherDesc[0].value);
    console.log("Humidity:", data.current_condition[0].humidity, "%");
    console.log("Wind:", data.current_condition[0].windspeedKmph, "km/h");
  });
function buildCategoryNav() {
  const nav = document.getElementById("categoryNav");
  const categories = ["All", ...FEEDS.map((f) => f.name)];

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = cat === "All" ? "active" : "";
    btn.addEventListener("click", () => {
      activeCategory = cat;
      document
        .querySelectorAll("#categoryNav button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filtered =
        cat === "All"
          ? allArticles
          : allArticles.filter((a) => a.category === cat);
      renderCards(filtered);
    });
    nav.appendChild(btn);
  });
}
function renderCards(articles) {
  const grid = document.getElementById("newsGrid");
  if (articles.length === 0) {
    grid.innerHTML = "<p>No articles found.</p>";
    return;
  }

  grid.innerHTML = articles
    .map(
      (article) => `
    <a class="card" href="${article.link}" target="_blank">
      ${article.thumbnail ? `<img src="${article.thumbnail}" alt="">` : ""}
      <div class="card-body">
        <span class="badge">${article.category}</span>
        <h3>${article.title}</h3>
        
      </div>
    </a>
  `,
    )
    .join("");
}

// --- Search box ---
document.getElementById("searchBox").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const source =
    activeCategory === "All"
      ? allArticles
      : allArticles.filter((a) => a.category === activeCategory);
  const results = source.filter((a) => a.title.toLowerCase().includes(query));
  renderCards(results);
});
loadAllFeeds();
