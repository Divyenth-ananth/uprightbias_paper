"""Render selected paper PDFs as web-friendly PNG previews."""

from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "project-page" / "assets" / "figures"
PDFS = {
    "teaser": ROOT / "Figures" / "Teaser" / "Teaser.pdf",
    "fig2": ROOT / "Figures" / "fig2" / "fig2.pdf",
    "fig3": ROOT / "Figures" / "fig3" / "fig3.pdf",
    "fig4": ROOT / "Figures" / "fig4" / "fig4.pdf",
    "chairs": ROOT / "Figures" / "captured_supplementary" / "chairs_compressed.pdf",
    "foosball": ROOT / "Figures" / "captured_supplementary" / "foosball_compressed.pdf",
    "rooftop": ROOT / "Figures" / "captured_supplementary" / "rooftop_compressed.pdf",
}


def render_pdf(pdf_path: Path, output_path: Path) -> None:
    document = fitz.open(pdf_path)
    if not document:
        raise RuntimeError(f"No pages found in {pdf_path}")
    page = document[0]
    pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    pixmap.save(output_path)
    document.close()


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, pdf_path in PDFS.items():
        if not pdf_path.exists():
            raise FileNotFoundError(pdf_path)
        output_path = OUTPUT / f"{name}.png"
        render_pdf(pdf_path, output_path)
        print(f"{pdf_path} -> {output_path}")


if __name__ == "__main__":
    main()
