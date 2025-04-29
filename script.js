const pages = [
  { title: "Home", url: "index.html" },
  { title: "Ships", url: "ships.html" },
  { title: "Characters", url: "characters.html" },
  { title: "Races", url: "races.html" },
  { title: "Systems", url: "systems.html" },
  { title: "Science", url: "science.html" },
  { title: "Weapons", url: "weapons.html" },
  { title: "Battles", url: "battles.html" },
  { title: "Series", url: "series.html" },
  { title: "Games", url: "games.html" }
];

let pageIndex = [];
if (window.location.protocol === "file:") {
  alert("This site is being opened directly from a file (file://).\n\nFor full functionality like search, please launch it using a local web server (e.g., Live Server in VS Code or Python's http.server).");
}
console.warn("You're running the site from file:// — this may block features like fetch(). Please use a local web server.");

async function buildIndex() {
  if (pageIndex.length > 0) return pageIndex;

  for (const page of pages) {
    try {
      const response = await fetch(page.url);
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, "text/html");
      const content = doc.body.innerText.toLowerCase();
      pageIndex.push({ ...page, content });
    } catch (err) {
      console.warn(`Failed to fetch ${page.url}`, err);
    }
  }

  return pageIndex;
}

// Show dropdown suggestions
async function showSuggestions() {
  const input = document.getElementById("siteSearchInput");
  const query = input.value.toLowerCase();
  const suggestions = document.getElementById("searchSuggestions");
  suggestions.innerHTML = "";
  suggestions.style.display = "none";

  if (query.length < 2) return;

  const index = await buildIndex();
  const matches = index.filter(page => page.content.includes(query));

  if (matches.length === 0) return;

  matches.slice(0, 5).forEach(page => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `${page.url}?highlight=${encodeURIComponent(query)}`;
    a.textContent = `${page.title}`;
    li.appendChild(a);
    suggestions.appendChild(li);
  });

  suggestions.style.display = "block";
}

// Submit handler
async function siteSearch() {
  const input = document.getElementById("siteSearchInput");
  const query = input.value.toLowerCase();
  const index = await buildIndex();

  const match = index.find(page => page.content.includes(query));
  if (match) {
    window.location.href = `${match.url}?highlight=${encodeURIComponent(query)}`;
  } else {
    alert("No matching content found.");
  }
}
  // WILL NOT WORK WHEN LAUNCHING FROM A FILE
  // launch from VS code and install this https://marketplace.visualstudio.com/items/?itemName=ritwickdey.LiveServer
  // then right click on any HTML file and select "Open with Live Server"
  // this will launch a local server and open the file in your browser
  // this will allow the fetch to work properly