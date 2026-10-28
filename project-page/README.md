# ROVER project page

This is a dependency-light static research page for the UprightBias paper.

## What to install

Nothing is required to edit or deploy the first version. The page uses:

- HTML, CSS, and vanilla JavaScript
- KaTeX from jsDelivr for equation rendering
- Existing PDF, PNG, and JPG assets from the parent paper project

Python 3 is useful for local preview and is already available in the current environment. Node.js/npm are not required.

## Local preview

Run this from the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/project-page/>.

Do not open `index.html` directly with a `file://` URL: browsers restrict some asset and script behavior for local files.

## Replacing placeholders

- Replace the source link in `index.html` with the final PDF URL when the paper is compiled.
- Add final code and dataset URLs to the hero action links.
- Replace the provisional BibTeX metadata in the citation section.
- Replace the precomputed demo metadata in `script.js` with measured variance curves before publication.

## Re-rendering PDF previews

The page uses PNG previews instead of embedding PDFs directly. Direct PDF embeds open the browser's built-in PDF viewer, including its toolbar and thumbnail sidebar. If the source figures change, regenerate the previews with:

```bash
python3 project-page/tools/render_assets.py
```

This requires PyMuPDF:

```bash
python3 -m pip install PyMuPDF
```

The original PDFs remain linked from the figure captions for full-resolution viewing.

## Deployment

The folder can be served directly by GitHub Pages when it is inside the repository. If the repository is configured to publish from the root, the URL will usually be:

```text
https://<user>.github.io/<repository>/project-page/
```

The page intentionally references `../Figures`, `../supplementary_figures`, and the paper files in the parent directory. Keep that relative layout when deploying, or copy those referenced assets into the published site.
