// List of pages on your site
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
  
  // Fetch and index page content
  async function buildIndex() {
    const index = [];
  
    for (const page of pages) {
      try {
        const response = await fetch(page.url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const bodyContent = doc.body.innerText;
  
        index.push({
          title: page.title,
          url: page.url,
          content: bodyContent.toLowerCase()
        });
      } catch (error) {
        console.warn(`Could not fetch ${page.url}:`, error);
      }
    }
  
    return index;
  }
  
  // Perform search and redirect
  async function siteSearch() {
    const input = document.getElementById("siteSearchInput");
    const query = input.value.toLowerCase();
    const index = await buildIndex();
  
    for (const page of index) {
      if (page.content.includes(query)) {
        window.location.href = page.url;
        return;
      }
    }
  
    alert("No matching content found.");
  }