#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$DIR/problem-statement.html"
OUT="$DIR/../problem-statement.pdf"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ -x "$CHROME" ]; then
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$OUT" "file://$SRC" >/dev/null 2>&1 \
    || "$CHROME" --headless --disable-gpu --print-to-pdf="$OUT" "file://$SRC" >/dev/null 2>&1
  echo "PDF written to $OUT (chrome)"; exit 0
fi
if command -v pandoc >/dev/null 2>&1; then
  pandoc "$SRC" -o "$OUT"; echo "PDF written to $OUT (pandoc)"; exit 0
fi
if command -v weasyprint >/dev/null 2>&1; then
  weasyprint "$SRC" "$OUT"; echo "PDF written to $OUT (weasyprint)"; exit 0
fi
echo "No PDF tool found (tried Chrome, pandoc, weasyprint). Install one, or print $SRC to PDF from a browser." >&2
exit 1
