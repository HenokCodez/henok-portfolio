---
description: Build the next unfinished phase of the portfolio, strictly following the kit
---

1. Read `AGENTS.md` fully (golden rules).
2. Open `docs/05-build-order.md`. Find the **first phase that has unticked checkboxes**. Announce which phase you are doing.
3. Read the page spec(s) that phase references in `pages/`, and `docs/02-design-system.md`.
4. **Open and look at** the mockup images listed in the spec: desktop, desktop-annotated, mobile. Read the matching `design/mockups/html/<page>.html` and `mock.css` for exact sizes.
5. Implement only that phase. Follow `docs/04-folder-structure.md` for file locations. Use tokens only — no raw hex values, no new fonts, no new libraries.
6. Run `npm run build`. Fix every error.
7. Run `npm run dev`, open the page at 1440px and 390px, and compare with the mockups. List every visible difference and fix them.
8. Tick the completed boxes in `docs/05-build-order.md`.
9. Report to Henok: what was built, what to look at, and any conflict or question (also append to `docs/NOTES-FOR-HENOK.md`). Then STOP and wait.
