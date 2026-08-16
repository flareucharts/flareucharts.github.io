import json
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
# SNAPSHOT TIME
# =========================================================

def get_snapshot_time():

    return datetime.now(
        ZoneInfo("Asia/Seoul")
    ).isoformat()


# =========================================================
# PARSE RANK CHANGE
# =========================================================

def parse_rank_change(change_element):

    if not change_element:
        return 0

    span = change_element.select_one("span")

    if not span:
        return 0

    value = span.get_text(strip=True)

    if value == "-":
        return 0

    try:

        number = int(value)

    except ValueError:

        return 0

    if "up" in span.get("class", []):
        return number

    if "down" in span.get("class", []):
        return -number

    return 0


# =========================================================
# GET GUYSOME MELON REAL-TIME
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

    snapshot_time = get_snapshot_time()

    results = []

    rows = soup.select("tr")

    for row in rows:

        artist_element = row.select_one(
            ".subject .singer"
        )

        if not artist_element:
            continue

        artist = artist_element.get(
            "title",
            ""
        ).strip()

        # -------------------------------------------------
        # FILTER ARTIST
        # -------------------------------------------------

        if artist != TARGET_ARTIST:
            continue

        # -------------------------------------------------
        # RANK
        # -------------------------------------------------

        rank_element = row.select_one(
            ".ranking span[class^='no']"
        )

        if not rank_element:
            continue

        try:

            rank = int(
                rank_element.get_text(
                    strip=True
                )
            )

        except ValueError:

            continue

        # -------------------------------------------------
        # MOVEMENT
        # -------------------------------------------------

        change_element = row.select_one(
            ".ranking .change"
        )

        rank_change = parse_rank_change(
            change_element
        )

        # -------------------------------------------------
        # TITLE
        # -------------------------------------------------

        title_element = row.select_one(
            ".subject p[title]"
        )

        title = (
            title_element.get("title", "").strip()
            if title_element
            else ""
        )

        # -------------------------------------------------
        # COVER
        # -------------------------------------------------

        cover_element = row.select_one(
            ".albumimg img"
        )

        cover = (
            cover_element.get("src", "").strip()
            if cover_element
            else ""
        )

        # -------------------------------------------------
        # LIKES
        # -------------------------------------------------

        likes_element = row.select_one(
            ".count .like"
        )

        likes = None

        if likes_element:

            likes_text = (
                likes_element
                .get_text(strip=True)
                .replace(",", "")
            )

            try:

                likes = int(likes_text)

            except ValueError:

                likes = None

        # -------------------------------------------------
        # PREVIOUS RANK
        # -------------------------------------------------

        previous_rank = None

        if rank_change != 0:

            previous_rank = (
                rank + rank_change
                if rank_change > 0
                else rank - rank_change
            )

        # -------------------------------------------------
        # RESULT
        # -------------------------------------------------

        results.append({

            "platform": "Melon",

            "chart": "Real-time",

            "source": "Guysome",

            "snapshot_time": snapshot_time,

            "rank": rank,

            "previous_rank": previous_rank,

            "artist": artist,

            "title": title,

            "cover": cover,

            "likes": likes,

            "rank_change": rank_change

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
    
    with open("melon_realtime.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

    for item in data:

        if item["rank_change"] > 0:
            movement = f"↑{item['rank_change']}"

        elif item["rank_change"] < 0:
            movement = f"↓{abs(item['rank_change'])}"

        else:
            movement = "—"

        print(
            f"#{item['rank']:>3} "
            f"{movement:<4} "
            f"{item['title']} | "
            f"{item['artist']} | "
            f"Likes: {item['likes']}"
        )

    print(
        "\n=========================================="
    )

    print(
        f"Total: {len(data)} lagu"
    )

    print(
        f"Snapshot: {get_snapshot_time()}"
    )

    print(
        "=========================================="
    )


if __name__ == "__main__":
    main()