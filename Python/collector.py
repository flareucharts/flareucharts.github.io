import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from pathlib import Path


# =========================================================
# CONFIG
# =========================================================

TARGET_ARTIST = "RESCENE (리센느)"

KST = ZoneInfo("Asia/Seoul")

now = datetime.now(KST)

date_part = now.strftime("%Y%m%d")
hour_part = now.strftime("%H")

URL = (
    "https://xn--o39an51b2re.com/"
    f"chart/melon/realtime/{date_part}/{hour_part}"
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

HISTORY_DAYS = 90

OUTPUT_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "melon_realtime.json"
)


# =========================================================
# SNAPSHOT ID
# =========================================================

def get_snapshot_id():

    return (
        f"{date_part}_{hour_part}"
    )


# =========================================================
# SNAPSHOT TIME
# =========================================================

def get_snapshot_time():

    return datetime.now(
        KST
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

    print(
        "Mengambil Guysome Melon Real-time..."
    )

    print(
        f"URL: {URL}"
    )

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

    snapshot_id = get_snapshot_id()

    results = []

    rows = soup.select("tr")

    for row in rows:

        # -------------------------------------------------
        # ARTIST
        # -------------------------------------------------

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
            title_element.get(
                "title",
                ""
            ).strip()
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
            cover_element.get(
                "src",
                ""
            ).strip()
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

                likes = int(
                    likes_text
                )

            except ValueError:

                likes = None

        # -------------------------------------------------
        # PREVIOUS RANK
        # -------------------------------------------------

        previous_rank = None

        if rank_change != 0:

            if rank_change > 0:

                previous_rank = (
                    rank + rank_change
                )

            else:

                previous_rank = (
                    rank - rank_change
                )

        # -------------------------------------------------
        # RESULT
        # -------------------------------------------------

        results.append({

            "platform": "Melon",

            "chart": "Real-time",

            "source": "Guysome",

            "snapshot_id":
                snapshot_id,

            "snapshot_time":
                snapshot_time,

            "rank":
                rank,

            "previous_rank":
                previous_rank,

            "artist":
                artist,

            "title":
                title,

            "cover":
                cover,

            "likes":
                likes,

            "rank_change":
                rank_change

        })

    print(
        "Jumlah lagu ditemukan:",
        len(results)
    )

    return results


# =========================================================
# NORMALIZE SONG DATA
# =========================================================

def normalize_song_data(
    songs
):

    normalized = []

    for song in songs:

        normalized.append({

            "rank":
                song.get(
                    "rank"
                ),

            "previous_rank":
                song.get(
                    "previous_rank"
                ),

            "artist":
                song.get(
                    "artist",
                    ""
                ),

            "title":
                song.get(
                    "title",
                    ""
                ),

            "cover":
                song.get(
                    "cover",
                    ""
                ),

            "likes":
                song.get(
                    "likes"
                ),

            "rank_change":
                song.get(
                    "rank_change",
                    0
                )

        })

    return normalized


# =========================================================
# LOAD EXISTING DATA
# =========================================================

def load_existing_data():

    if not OUTPUT_FILE.exists():

        print(
            "File history belum ada."
        )

        return {
            "platform": "Melon",
            "chart": "Real-time",
            "source": "Guysome",
            "artist": TARGET_ARTIST,
            "history": []
        }

    try:

        with open(
            OUTPUT_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        if not isinstance(data, dict):

            return {
                "platform": "Melon",
                "chart": "Real-time",
                "source": "Guysome",
                "artist": TARGET_ARTIST,
                "history": []
            }

        if "history" not in data:

            data["history"] = []

        return data

    except (
        json.JSONDecodeError,
        OSError
    ):

        print(
            "File JSON tidak valid. "
            "Membuat history baru."
        )

        return {
            "platform": "Melon",
            "chart": "Real-time",
            "source": "Guysome",
            "artist": TARGET_ARTIST,
            "history": []
        }


# =========================================================
# CHECK DUPLICATE SNAPSHOT
# =========================================================

def snapshot_exists(
    history,
    snapshot_id
):

    for snapshot in history:

        if (
            snapshot.get(
                "snapshot_id"
            )
            == snapshot_id
        ):

            return True

    return False


# =========================================================
# REMOVE OLD HISTORY
# =========================================================

def remove_old_history(
    history
):

    cutoff = (
        datetime.now(KST)
        - timedelta(
            days=HISTORY_DAYS
        )
    )

    cleaned = []

    for snapshot in history:

        snapshot_time = (
            snapshot.get(
                "snapshot_time"
            )
        )

        if not snapshot_time:
            continue

        try:

            snapshot_datetime = (
                datetime.fromisoformat(
                    snapshot_time
                )
            )

            if (
                snapshot_datetime
                >= cutoff
            ):

                cleaned.append(
                    snapshot
                )

        except ValueError:

            continue

    return cleaned


# =========================================================
# SAVE DATA
# =========================================================

def save_data(
    data
):

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=2
        )


# =========================================================
# MAIN
# =========================================================

def main():

    print(
        "=========================================="
    )

    print(
        "GUYSOME → MELON REAL-TIME"
    )

    print(
        f"TARGET: {TARGET_ARTIST}"
    )

    print(
        f"SNAPSHOT: {date_part} {hour_part}:00 KST"
    )

    print(
        "=========================================="
    )

    # -----------------------------------------------------
    # LOAD OLD DATA
    # -----------------------------------------------------

    data = load_existing_data()

    history = data.get(
        "history",
        []
    )

    snapshot_id = (
        get_snapshot_id()
    )

    # -----------------------------------------------------
    # DUPLICATE CHECK
    # -----------------------------------------------------

    if snapshot_exists(
        history,
        snapshot_id
    ):

        print(
            f"Snapshot {snapshot_id} "
            "sudah ada."
        )

        print(
            "SKIP — tidak menambahkan "
            "data duplicate."
        )

        # Tetap bersihkan history lama
        history = remove_old_history(
            history
        )

        data["history"] = history

        save_data(data)

        print(
            f"Total snapshot: {len(history)}"
        )

        return

    # -----------------------------------------------------
    # FETCH
    # -----------------------------------------------------

    songs = (
        get_guysome_melon_realtime()
    )

    if not songs:

        print(
            "Tidak ada data artist "
            "yang ditemukan."
        )

        print(
            "History TIDAK diubah."
        )

        return

    # -----------------------------------------------------
    # NORMALIZE
    # -----------------------------------------------------

    songs = normalize_song_data(
        songs
    )

    # -----------------------------------------------------
    # CREATE SNAPSHOT
    # -----------------------------------------------------

    snapshot = {

        "snapshot_id":
            snapshot_id,

        "snapshot_time":
            get_snapshot_time(),

        "date":
            date_part,

        "hour":
            int(hour_part),

        "platform":
            "Melon",

        "chart":
            "Real-time",

        "source":
            "Guysome",

        "artist":
            TARGET_ARTIST,

        "songs":
            songs

    }

    # -----------------------------------------------------
    # APPEND
    # -----------------------------------------------------

    history.append(
        snapshot
    )

    # -----------------------------------------------------
    # CLEAN OLD DATA
    # -----------------------------------------------------

    history = remove_old_history(
        history
    )

    # -----------------------------------------------------
    # SORT
    # -----------------------------------------------------

    history.sort(
        key=lambda item:
            item.get(
                "snapshot_time",
                ""
            )
    )

    # -----------------------------------------------------
    # UPDATE ROOT DATA
    # -----------------------------------------------------

    data = {

        "platform":
            "Melon",

        "chart":
            "Real-time",

        "source":
            "Guysome",

        "artist":
            TARGET_ARTIST,

        "updated_at":
            get_snapshot_time(),

        "history":
            history

    }

    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    save_data(
        data
    )

    print(
        "=========================================="
    )

    print(
        "SNAPSHOT BERHASIL DISIMPAN"
    )

    print(
        f"Snapshot ID : {snapshot_id}"
    )

    print(
        f"Lagu        : {len(songs)}"
    )

    print(
        f"Total history: {len(history)}"
    )

    print(
        f"File        : {OUTPUT_FILE}"
    )

    print(
        "==========================================")


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    try:

        main()

    except Exception as error:

        print(
            "=========================================="
        )

        print(
            "COLLECTOR ERROR"
        )

        print(
            str(error)
        )

        print(
            "=========================================="
        )

        raise