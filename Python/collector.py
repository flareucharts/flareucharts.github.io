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

BASE_URL = (
    "https://xn--o39an51b2re.com/"
    "chart/melon/realtime"
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

HISTORY_DAYS = 90

# Berapa jam ke belakang yang boleh dicoba
MAX_HOUR_LOOKBACK = 6

OUTPUT_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "melon_realtime.json"
)


# =========================================================
# CURRENT TIME
# =========================================================

def get_now_kst():

    return datetime.now(KST)


# =========================================================
# SNAPSHOT TIME
# =========================================================

def get_snapshot_time():

    return get_now_kst().isoformat()


# =========================================================
# BUILD GUYSOME URL
# =========================================================

def build_url(dt):

    date_part = dt.strftime("%Y%m%d")
    hour_part = dt.strftime("%H")

    return (
        f"{BASE_URL}/"
        f"{date_part}/"
        f"{hour_part}"
    )


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

    classes = span.get("class", [])

    if "up" in classes:
        return number

    if "down" in classes:
        return -number

    return 0


# =========================================================
# FETCH GUYSOME PAGE
# =========================================================

def fetch_guysome_page(dt):

    url = build_url(dt)

    print(
        f"Mencoba Guysome: {url}"
    )

    try:

        response = requests.get(
            url,
            headers=HEADERS,
            timeout=20
        )

        if response.status_code != 200:

            print(
                f"HTTP {response.status_code}"
            )

            return None, None

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        rows = soup.select("tr")

        if not rows:

            print(
                "Tidak ada row chart."
            )

            return None, None

        return soup, url

    except requests.RequestException as error:

        print(
            f"Request error: {error}"
        )

        return None, None


# =========================================================
# FIND LATEST AVAILABLE GUYSOME SNAPSHOT
# =========================================================

def find_latest_available_page():

    now = get_now_kst()

    for offset in range(
        0,
        MAX_HOUR_LOOKBACK + 1
    ):

        target_time = (
            now
            - timedelta(hours=offset)
        )

        soup, url = fetch_guysome_page(
            target_time
        )

        if soup is not None:

            print(
                "Halaman Guysome ditemukan."
            )

            return (
                soup,
                target_time,
                url
            )

    return None, None, None


# =========================================================
# PARSE MELON REALTIME
# =========================================================

def parse_melon_realtime(
    soup
):

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

        if rank_change > 0:

            previous_rank = (
                rank + rank_change
            )

        elif rank_change < 0:

            previous_rank = (
                rank - rank_change
            )

        # -------------------------------------------------
        # RESULT
        # -------------------------------------------------

        results.append({

            "rank":
                rank,

            "previous_rank":
                previous_rank,

            "title":
                title,

            "cover":
                cover,

            "likes":
                likes,

            "rank_change":
                rank_change

        })

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

            "platform":
                "Melon",

            "chart":
                "Real-time",

            "source":
                "Guysome",

            "artist":
                TARGET_ARTIST,

            "updated_at":
                None,

            "snapshots":
                []

        }

    try:

        with open(
            OUTPUT_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        if not isinstance(
            data,
            dict
        ):

            raise ValueError(
                "JSON bukan object."
            )

        # -------------------------------------------------
        # COMPATIBILITY
        # -------------------------------------------------
        # Kalau file lama masih memakai "history",
        # pindahkan ke "snapshots".

        if (
            "snapshots" not in data
            and "history" in data
        ):

            data["snapshots"] = (
                data.pop("history")
            )

        if "snapshots" not in data:

            data["snapshots"] = []

        return data

    except (
        json.JSONDecodeError,
        OSError,
        ValueError
    ):

        print(
            "File JSON tidak valid."
        )

        return {

            "platform":
                "Melon",

            "chart":
                "Real-time",

            "source":
                "Guysome",

            "artist":
                TARGET_ARTIST,

            "updated_at":
                None,

            "snapshots":
                []

        }


# =========================================================
# GET SONG SIGNATURE
# =========================================================

def get_song_signature(
    songs
):

    signature = []

    for song in songs:

        signature.append({

            "rank":
                song.get(
                    "rank"
                ),

            "previous_rank":
                song.get(
                    "previous_rank"
                ),

            "title":
                song.get(
                    "title",
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

    return signature


# =========================================================
# CHECK WHETHER DATA CHANGED
# =========================================================

def is_same_as_latest(
    history,
    songs
):

    if not history:
        return False

    latest = history[-1]

    latest_songs = latest.get(
        "songs",
        []
    )

    return (
        get_song_signature(latest_songs)
        ==
        get_song_signature(songs)
    )


# =========================================================
# REMOVE OLD HISTORY
# =========================================================

def remove_old_history(
    history
):

    cutoff = (
        get_now_kst()
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

            # Pastikan timezone-aware
            if (
                snapshot_datetime.tzinfo
                is None
            ):

                snapshot_datetime = (
                    snapshot_datetime.replace(
                        tzinfo=KST
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
        "=========================================="
    )

    # -----------------------------------------------------
    # LOAD OLD DATA
    # -----------------------------------------------------

    data = load_existing_data()

    history = data.get(
        "snapshots",
        []
    )

    # -----------------------------------------------------
    # FIND LATEST AVAILABLE PAGE
    # -----------------------------------------------------

    (
        soup,
        source_time,
        source_url
    ) = find_latest_available_page()

    if soup is None:

        print(
            "Tidak menemukan halaman Guysome."
        )

        print(
            "History TIDAK diubah."
        )

        return

    print(
        f"Source page: {source_url}"
    )

    # -----------------------------------------------------
    # PARSE
    # -----------------------------------------------------

    songs = parse_melon_realtime(
        soup
    )

    print(
        "Jumlah lagu ditemukan:",
        len(songs)
    )

    if not songs:

        print(
            "RESCENE tidak ditemukan "
            "pada halaman tersebut."
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
    # CHECK DATA CHANGE
    # -----------------------------------------------------

    if is_same_as_latest(
        history,
        songs
    ):

        print(
            "DATA TIDAK BERUBAH."
        )

        print(
            "SKIP — snapshot baru "
            "tidak disimpan."
        )

        # Tetap bersihkan history lama.
        history = remove_old_history(
            history
        )

        data["snapshots"] = history

        data["updated_at"] = (
            get_snapshot_time()
        )

        data["platform"] = "Melon"
        data["chart"] = "Real-time"
        data["source"] = "Guysome"
        data["artist"] = TARGET_ARTIST

        save_data(data)

        print(
            f"Total snapshot: {len(history)}"
        )

        return

    # -----------------------------------------------------
    # CREATE NEW SNAPSHOT
    # -----------------------------------------------------

    snapshot_time = (
        get_snapshot_time()
    )

    snapshot = {

        "snapshot_time":
            snapshot_time,

        "date":
            source_time.strftime(
                "%Y-%m-%d"
            ),

        "hour":
            int(
                source_time.strftime(
                    "%H"
                )
            ),

        "platform":
            "Melon",

        "chart":
            "Real-time",

        "source":
            "Guysome",

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
    # REMOVE OLD DATA
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
    # ROOT DATA
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
            snapshot_time,

        "snapshots":
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
        "SNAPSHOT BARU DISIMPAN"
    )

    print(
        f"Source      : {source_url}"
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