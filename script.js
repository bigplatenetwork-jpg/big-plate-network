/* Big Plate Network — front-end prototype.
   Article submissions are stored only in this browser. This is NOT a secure CMS. */
"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuToggle = $("#menuToggle");
const primaryNav = $("#primaryNav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const open = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $$(".primary-nav a").forEach(link => link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }));
}

const year = new Date().getFullYear();
if ($("#footerYear")) $("#footerYear").textContent = year;

const demoArticles = [
  {
    id: "demo-1",
    title: "Why Creative Education Matters for the Next Generation",
    category: "Education & Youth",
    author: "Big Plate Editorial",
    date: "Demo story",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
    summary: "A demonstration feature about creating more space for young people to explore art, design and imagination.",
    body: "Creative education can give young people a structured space to experiment, collaborate and express ideas. Schools, families, artists and community organisations can help make creative activities more accessible. This is sample demonstration copy, not verified reporting. Replace it with a researched article, named author, credible sources and approved images before publication."
  },
  {
    id: "demo-2",
    title: "Building Cultural Experiences That Bring Communities Together",
    category: "Culture",
    author: "Big Plate Editorial",
    date: "Demo story",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    summary: "How festivals and shared creative experiences can make room for talent, culture and community connection.",
    body: "A well-planned cultural event can bring artists, families, local businesses and visitors into one shared space. Successful programmes begin with a clear purpose, safe planning, inclusive access and realistic budgets. This is sample demonstration copy, not verified reporting. Replace it with a researched article, named author, credible sources and approved images before publication."
  },
  {
    id: "demo-3",
    title: "What Responsible Digital Storytelling Can Look Like",
    category: "Media",
    author: "Big Plate Editorial",
    date: "Demo story",
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80",
    summary: "Accuracy, context, permission and transparency belong at the centre of digital publishing.",
    body: "Digital stories can reach audiences quickly, which makes verification and clear sourcing essential. Publishers should separate fact from opinion, seek responses where appropriate, credit creators and correct mistakes transparently. This is sample demonstration copy, not verified reporting. Replace it with a researched article, named author, credible sources and approved images before publication."
  },
  {
    id: "demo-4",
    title: "Small Business, Big Ideas: Starting With a Clear Plan",
    category: "Business",
    author: "Big Plate Editorial",
    date: "Demo story",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
    summary: "A practical introduction to testing a business idea, understanding customers and managing costs.",
    body: "A useful business plan starts with a customer problem, a clear offer, a realistic cost model and a way to test demand. Entrepreneurs can learn quickly by speaking to prospective customers, tracking costs and reviewing results. This is sample demonstration copy, not verified reporting. Replace it with a researched article, named author, credible sources and approved images before publication."
  },
  {
    id: "demo-5",
    title: "Stories Across Borders: Connecting Ghana and the Diaspora",
    category: "Ghana & Africa",
    author: "Big Plate Editorial",
    date: "Demo story",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80",
    summary: "A sample editorial concept about identity, community and connections across countries.",
    body: "Diaspora stories can explore culture, work, family, entrepreneurship and the ways communities stay connected across borders. Good reporting listens to people with different experiences and avoids treating any community as a single voice. This is sample demonstration copy, not verified reporting. Replace it with a researched article, named author, credible sources and approved images before publication."
  },
  {
    id: "demo-6",
    title: "Podcasting as a Space for Thoughtful Conversation",
    category: "Media",
    author: "Big Plate Editorial",
    date: "Demo story",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
    summary: "A demonstration feature on preparing interviews, respecting guests and making useful audio content.",
    body: "A strong podcast usually begins with a clear audience, a thoughtful format and preparation. Hosts should research guests, explain the purpose of sensitive questions, secure permissions and edit fairly. This is sample demonstration copy, not verified reporting. Replace it with a researched article, named author, credible sources and approved images before publication."
  }
];

const articleGrid = $("#articleGrid");
const emptyState = $("#emptyState");
const searchInput = $("#articleSearch");
const filterButtons = $$(".filter-chip");
const showAllButton = $("#showAllArticles");
const dialog = $("#articleDialog");
let activeCategory = "All";
let showAll = false;

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function getLocalSubmissions() {
  try {
    return JSON.parse(localStorage.getItem("bpnDemoSubmissions") || "[]");
  } catch {
    return [];
  }
}

function getVisibleArticles() {
  const submissions = getLocalSubmissions()
    .filter(item => item && item.status === "Demo submission")
    .map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      author: item.author,
      date: "Local demo submission",
      image: "assets/article-placeholder.svg",
      summary: item.summary,
      body: item.body
    }));
  return [...submissions, ...demoArticles];
}

function renderArticles() {
  if (!articleGrid) return;
  const query = (searchInput?.value || "").trim().toLowerCase();
  const matching = getVisibleArticles().filter(article => {
    const categoryMatch = activeCategory === "All" || article.category === activeCategory;
    const textMatch = [article.title, article.summary, article.category, article.author]
      .some(value => String(value || "").toLowerCase().includes(query));
    return categoryMatch && textMatch;
  });
  const displayed = showAll ? matching : matching.slice(0, 3);
  articleGrid.innerHTML = displayed.map(article => `
    <article class="article-card">
      <div class="article-art">
        <img src="${escapeHTML(article.image || "assets/article-placeholder.svg")}"
             alt="" loading="lazy" onerror="this.src='assets/article-placeholder.svg'">
        <span class="article-category">${escapeHTML(article.category)}</span>
      </div>
      <div class="article-copy">
        <div class="article-meta">${escapeHTML(article.date)} · ${escapeHTML(article.author)}</div>
        <h3>${escapeHTML(article.title)}</h3>
        <p>${escapeHTML(article.summary)}</p>
        <button class="article-read" type="button" data-open-article="${escapeHTML(article.id)}">
          Read story <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>`).join("");
  emptyState.hidden = displayed.length !== 0;
  showAllButton.hidden = matching.length <= 3;
  showAllButton.innerHTML = showAll ? 'Show fewer stories <span>↑</span>' : 'Show all stories <span>↓</span>';
}

articleGrid?.addEventListener("click", event => {
  const button = event.target.closest("[data-open-article]");
  if (!button) return;
  const article = getVisibleArticles().find(item => item.id === button.dataset.openArticle);
  if (!article || !dialog) return;
  $("#dialogCategory").textContent = article.category.toUpperCase();
  $("#dialogTitle").textContent = article.title;
  $("#dialogMeta").textContent = `${article.date} · ${article.author}`;
  $("#dialogSummary").textContent = article.summary;
  $("#dialogBody").textContent = article.body;
  dialog.showModal();
});
$("#dialogClose")?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

searchInput?.addEventListener("input", () => {
  showAll = true;
  renderArticles();
});
filterButtons.forEach(button => button.addEventListener("click", () => {
  filterButtons.forEach(item => item.classList.toggle("active", item === button));
  activeCategory = button.dataset.category || "All";
  showAll = false;
  renderArticles();
}));
showAllButton?.addEventListener("click", () => {
  showAll = !showAll;
  renderArticles();
});

const submissionForm = $("#submissionForm");
const formMessage = $("#formMessage");

submissionForm?.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(submissionForm);
  const entry = {
    id: `local-${Date.now()}`,
    author: String(formData.get("authorName") || "").trim(),
    email: String(formData.get("authorEmail") || "").trim(),
    title: String(formData.get("articleTitle") || "").trim(),
    category: String(formData.get("articleCategory") || "").trim(),
    summary: String(formData.get("articleSummary") || "").trim(),
    body: String(formData.get("articleBody") || "").trim(),
    sources: String(formData.get("sourceLinks") || "").trim(),
    status: "Demo submission",
    submittedAt: new Date().toISOString()
  };

  if (!entry.author || !entry.email || !entry.title || !entry.category ||
      entry.summary.length < 10 || entry.body.length < 80 ||
      !$("#originality").checked) {
    formMessage.textContent = "Please complete all required fields and confirm the submission declaration.";
    formMessage.className = "form-message visible error";
    return;
  }

  try {
    const current = getLocalSubmissions();
    current.unshift(entry);
    localStorage.setItem("bpnDemoSubmissions", JSON.stringify(current));
    formMessage.textContent = "Demo submission saved in this browser. It has NOT been sent to Big Plate Network or reviewed by an editor.";
    formMessage.className = "form-message visible";
    submissionForm.reset();
    activeCategory = "All";
    filterButtons.forEach(button => button.classList.toggle("active", button.dataset.category === "All"));
    showAll = true;
    renderArticles();
  } catch {
    formMessage.textContent = "This browser could not save the demo submission. Check browser storage settings and try again.";
    formMessage.className = "form-message visible error";
  }
});

renderArticles();
console.info("Big Plate Network prototype ready. Demo submissions are local to this browser only.");
