import requests
from bs4 import BeautifulSoup
from datetime import datetime
from zoneinfo import ZoneInfo


# =========================================================
# CONFIG
# =========================================================

TARGET_ARTIST = "RESCENE (리센느)"

URL = "https://xn--o39an51b2re.com/chart/melon/realtime/20260817/8"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}


# =========================================================
# GET SNAPSHOT TIME
# =========================================================

def get_snapshot_time():

    return datetime.now(
        ZoneInfo("Asia/Seoul")
    ).isoformat()


# =========================================================
# GET GUYSOME DATA
# =========================================================

def get_guysome_melon_realtime():

    print("Mengambil Guysome Melon Real-time...")

    response = requests.get(
        URL,
        headers=HEADERS,
        timeout=20
    )

    response.raise_for_status()

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    print("Status:", response.status_code)

    # -----------------------------------------------------
    # DEBUG
    # -----------------------------------------------------

    print("Title halaman:")

    if soup.title:
        print(soup.title.get_text(strip=True))
    else:
        print("Tidak ditemukan")

    print("\nMencari data chart...")

    # -----------------------------------------------------
    # SEMUA ROW
    # -----------------------------------------------------

    rows = soup.select("tr")

    print("Jumlah <tr>:", len(rows))

    results = []

    for row in rows:

        text = row.get_text(
            " ",
            strip=True
        )

        if not text:
            continue

        # -------------------------------------------------
        # FILTER ARTIST
        # -------------------------------------------------

        if (
            "RESCENE" not in text
            and "리센느" not in text
        ):
            continue

        print("\nFOUND:")
        print(text)

        # -------------------------------------------------
        # SIMPAN HTML ROW UNTUK DEBUG
        # -------------------------------------------------

        print("\nHTML ROW:")
        print(row.prettify()[:3000])

        results.append({
            "raw_text": text
        })

    return results


# =========================================================
# MAIN
# =========================================================

def main():

    print(
        "\n=========================================="
    )

    print(
        "GUYSOME → MELON REAL-TIME"
    )

    print(
        f"TARGET: {TARGET_ARTIST}"
    )

    print(
        "==========================================\n"
    )

    data = get_guysome_melon_realtime()

    print(
        "\n=========================================="
    )

    print(
        f"Total hasil RESCENE: {len(data)}"
    )

    print(
        "Snapshot time:",
        get_snapshot_time()
    )

    print(
        "=========================================="
    )


if __name__ == "__main__":
    main()