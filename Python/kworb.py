
import json
import re
import time
from pathlib import Path
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup

ARTIST = "FLARE U"
URL = "https://kworb.net/itunes/artist/flareu.html"

OUTPUT_DIR = Path("kworb_data")
HISTORY_DIR = OUTPUT_DIR / "history"
LATEST_FILE = OUTPUT_DIR / "latest.json"


def utc_now():
    return datetime.now(timezone.utc)


def clean_text(value):
    return re.sub(r"\s+", " ", value or "").strip()


def fetch_page():
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; FLAREUCollector/1.0)"
    }

    response = requests.get(URL, headers=headers, timeout=30)
    response.raise_for_status()

    if not response.text.strip():
        raise ValueError("Halaman Kworb kosong.")

    return response.text


def extract_data(html):
    soup = BeautifulSoup(html, "html.parser")

    title = clean_text(
        soup.title.get_text(" ", strip=True)
        if soup.title else ""
    )

    page_text = soup.get_text("\n", strip=True)
    lines = [
        clean_text(line)
        for line in page_text.splitlines()
        if clean_text(line)
    ]

    # Simpan semua tabel yang tersedia.
    tables = []

    for table_index, table in enumerate(soup.find_all("table")):
        rows = []

        for tr in table.find_all("tr"):
            cells = [
                clean_text(cell.get_text(" ", strip=True))
                for cell in tr.find_all(["th", "td"])
            ]

            if cells:
                rows.append(cells)

        tables.append({
            "table_index": table_index,
            "rows": rows
        })

    # Simpan blok teks DOM agar konten yang tidak berbentuk
    # tabel tetap bisa diperiksa dan diproses nantinya.
    blocks = []

    for tag in soup.find_all(["div", "section", "article"]):
        text = clean_text(tag.get_text(" ", strip=True))

        if not text:
            continue

        # Hindari menyimpan blok teks yang sama berulang kali.
        if blocks and blocks[-1]["text"] == text:
            continue

        blocks.append({
            "tag": tag.name,
            "id": tag.get("id"),
            "class": tag.get("class", []),
            "text": text
        })

    # Label tab yang diharapkan pada halaman artis Kworb.
    tab_labels = ["Main", "Songs", "Albums", "Countries"]

    detected_tabs = [
        tab for tab in tab_labels
        if re.search(rf"\b{re.escape(tab)}\b", page_text, re.I)
    ]

    no_chart = (
        "not charting anywhere" in page_text.lower()
        or "not charting" in page_text.lower()
    )

    return {
        "artist": ARTIST,
        "source_url": URL,
        "page_title": title,
        "fetched_at_utc": utc_now().isoformat(),
        "status": "no_chart" if no_chart else "fetched",
        "detected_tabs": detected_tabs,
        "table_count": len(tables),
        "tables": tables,
        "content_blocks": blocks,
        "page_lines": lines,
        "page_text": page_text
    }


def atomic_write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)

    temp_path = path.with_name(path.name + ".tmp")

    with temp_path.open("w", encoding="utf-8") as file:
        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=2
        )

    # Replace file only after JSON has been written successfully.
    for attempt in range(5):
        try:
            temp_path.replace(path)
            return
        except PermissionError:
            if attempt == 4:
                raise
            time.sleep(1)


def save_snapshot(data):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    HISTORY_DIR.mkdir(parents=True, exist_ok=True)

    # Timestamp unik agar setiap pengambilan menjadi rekaman baru.
    timestamp = utc_now().strftime("%Y%m%dT%H%M%S%fZ")

    history_file = HISTORY_DIR / f"{timestamp}.json"

    # Simpan history terlebih dahulu agar latest tidak
    # diperbarui jika penyimpanan history gagal.
    atomic_write_json(history_file, data)
    atomic_write_json(LATEST_FILE, data)

    print(f"[SAVE] Latest: {LATEST_FILE}")
    print(f"[SAVE] History: {history_file}")


def main():
    print(f"[FETCH] {URL}")

    try:
        html = fetch_page()
        data = extract_data(html)

        # Jangan menyimpan halaman error atau halaman yang salah
        # sebagai snapshot data artis.
        if "kworb" not in data["page_title"].lower():
            raise ValueError(
                f"Judul halaman tidak sesuai: {data['page_title']}"
            )

        save_snapshot(data)

        print(f"[OK] Status: {data['status']}")
        print(f"[INFO] Judul: {data['page_title']}")
        print(f"[INFO] Tabel: {data['table_count']}")
        print(f"[INFO] Tab terdeteksi: {data['detected_tabs']}")
        print(f"[INFO] Baris halaman: {len(data['page_lines'])}")

        if data["status"] == "no_chart":
            print(
                "[INFO] Kworb menyatakan artis tidak sedang "
                "charting. Data kosong tidak diisi dengan tebakan."
            )

    except Exception as error:
        print(f"[ERROR] Collector gagal: {error}")
        print("[SAFEGUARD] Snapshot lama tidak diubah.")


if __name__ == "__main__":
    main()
