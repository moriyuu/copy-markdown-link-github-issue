import "./style.css";

function main() {
  function copy({ plain }: { plain: string }) {
    const listener = (event: any) => {
      event.clipboardData.setData("text/plain", plain);
      event.preventDefault();
    };
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  }

  const url = document.URL;
  const title = document.querySelector("h1.gh-header-title")?.textContent;

  if (title == null) {
    window.alert("Copy failed");
    return;
  }

  const text = title
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t !== "")
    .join(" ");

  copy({
    plain: `[${text}](${url})`,
  });
}

chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },
  (tabs) => {
    const { id, url } = tabs[0];
    if (id && url) {
      chrome.scripting.executeScript({
        target: { tabId: id },
        func: main,
      });
    }
  }
);
