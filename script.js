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