import json
import requests

from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from pathlib import Path


# =========================================================
# K-CHART COLLECTOR — FINAL
# =========================================================
#
# 1. Melon TOP100
# 2. Melon HOT100 — 100 Days
# 3. Melon HOT100 — 30 Days
# 4. Melon Real-time — Guysome
# 5. Bugs Real-time
# 6. Genie TOP200
# 7. FLO Real-time
# 8. VIBE Domestic
#
# GLOBAL TIME:
# Asia/Seoul
#
# SNAPSHOT:
# HH:00:00+09:00
#
# TARGET ARTIST:
# RESCENE (리센느)
#
# RANK CHANGE:
# dihitung otomatis dari snapshot sebelumnya.
# current rank 69
# previous rank 71
# = rank_change +2
#
# =========================================================


# =========================================================
# CONFIG
# =========================================================

TARGET_ARTIST = "RESCENE (리센느)"

KST = ZoneInfo("Asia/Seoul")

HISTORY_DAYS = 90

MAX_HOUR_LOOKBACK = 6

ROOT_DIR = (
    Path(__file__).resolve().parent.parent
)

DATA_DIR = ROOT_DIR / "data"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": (
        "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
    ),
}


# =========================================================
# URLS
# =========================================================

MELON_TOP100_URL = (
    "https://www.melon.com/chart/index.htm"
)

MELON_HOT100_30_URL = (
    "https://www.melon.com/chart/hot100/index.htm"
    "?classCd=30"
)

MELON_HOT100_100_URL = (
    "https://www.melon.com/chart/hot100/index.htm"
    "?classCd=100"
)

GUYSOME_BASE_URL = (
    "https://xn--o39an51b2re.com/"
    "chart/melon/realtime"
)

BUGS_REALTIME_URL = (
    "https://music.bugs.co.kr/"
    "chart/track/realtime/total"
)

GENIE_BASE_URL = (
    "https://www.genie.co.kr/chart/top200"
)

FLO_URL = (
    "https://www.music-flo.com/"
    "api/meta/v1/chart/track/1"
)

VIBE_URL = (
    "https://apis.naver.com/"
    "vibeWeb/musicapiweb/"
    "vibe/v1/chart/track/domestic"
)


# =========================================================
# OUTPUT FILES
# =========================================================

OUTPUT_FILES = {

    "melon_top100":
        DATA_DIR / "melon_top100.json",

    "melon_hot100_100":
        DATA_DIR / "melon_hot100_100days.json",

    "melon_hot100_30":
        DATA_DIR / "melon_hot100_30days.json",

    "melon_realtime":
        DATA_DIR / "melon_realtime.json",

    "bugs_realtime":
        DATA_DIR / "bugs_realtime.json",

    "genie_top200":
        DATA_DIR / "genie_top200.json",

    "flo_realtime":
        DATA_DIR / "flo_realtime.json",

    "vibe_domestic":
        DATA_DIR / "vibe_domestic.json",

}


# =========================================================
# TIME
# =========================================================

def get_now_kst():

    return datetime.now(KST)


def get_current_hour_kst():

    now = get_now_kst()

    return now.replace(
        minute=0,
        second=0,
        microsecond=0
    )


def get_snapshot_time(dt=None):

    if dt is None:
        dt = get_current_hour_kst()

    dt = dt.astimezone(KST)

    dt = dt.replace(
        minute=0,
        second=0,
        microsecond=0
    )

    return dt.isoformat()


# =========================================================
# HTTP
# =========================================================

def request_url(
    url,
    params=None,
    headers=None
):

    request_headers = dict(HEADERS)

    if headers:
        request_headers.update(headers)

    try:

        response = requests.get(
            url,
            params=params,
            headers=request_headers,
            timeout=20
        )

        return response

    except requests.RequestException as error:

        print(
            f"REQUEST ERROR: {error}"
        )

        return None


# =========================================================
# GENERIC JSON LOAD
# =========================================================

def load_json_file(path):

    if not path.exists():

        return {

            "platform": "",
            "chart": "",
            "source": "",
            "artist": TARGET_ARTIST,
            "updated_at": None,
            "snapshots": []

        }

    try:

        with open(
            path,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        if not isinstance(
            data,
            dict
        ):

            raise ValueError(
                "JSON root bukan object."
            )

        # -------------------------------------------------
        # OLD HISTORY COMPATIBILITY
        # -------------------------------------------------

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
        OSError,
        json.JSONDecodeError,
        ValueError
    ):

        print(
            f"JSON invalid: {path}"
        )

        return {

            "platform": "",
            "chart": "",
            "source": "",
            "artist": TARGET_ARTIST,
            "updated_at": None,
            "snapshots": []

        }


# =========================================================
# SAVE JSON
# =========================================================

def save_json(path, data):

    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        path,
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
# CLEAN HISTORY
# =========================================================

def remove_old_history(history):

    cutoff = (
        get_now_kst()
        - timedelta(days=HISTORY_DAYS)
    )

    cleaned = []

    for snapshot in history:

        timestamp = snapshot.get(
            "snapshot_time"
        )

        if not timestamp:
            continue

        try:

            dt = datetime.fromisoformat(
                timestamp
            )

            if dt.tzinfo is None:

                dt = dt.replace(
                    tzinfo=KST
                )

            dt = dt.astimezone(KST)

            if dt >= cutoff:

                cleaned.append(
                    snapshot
                )

        except ValueError:

            continue

    cleaned.sort(
        key=lambda item:
        item.get(
            "snapshot_time",
            ""
        )
    )

    return cleaned


# =========================================================
# SONG IDENTITY
# =========================================================

def normalize_text(value):

    if value is None:
        return ""

    return " ".join(
        str(value)
        .strip()
        .casefold()
        .split()
    )


def song_identity(song):

    # -----------------------------------------------------
    # BEST MATCH:
    # TRACK ID
    # -----------------------------------------------------

    track_id = song.get(
        "track_id"
    )

    if track_id is not None:

        track_id = str(
            track_id
        ).strip()

        if track_id:

            return (
                "track_id",
                track_id
            )

    # -----------------------------------------------------
    # FALLBACK:
    # ARTIST + TITLE
    # -----------------------------------------------------

    artist = normalize_text(
        song.get(
            "artist",
            ""
        )
    )

    title = normalize_text(
        song.get(
            "title",
            ""
        )
    )

    return (
        "artist_title",
        artist,
        title
    )


# =========================================================
# FIND PREVIOUS SONG
# =========================================================

def find_previous_song(
    previous_snapshot,
    current_song
):

    if not previous_snapshot:

        return None

    previous_songs = (
        previous_snapshot.get(
            "songs",
            []
        )
    )

    current_identity = (
        song_identity(
            current_song
        )
    )

    for previous_song in previous_songs:

        if (
            song_identity(
                previous_song
            )
            ==
            current_identity
        ):

            return previous_song

    return None


# =========================================================
# CALCULATE RANK CHANGE
# =========================================================

def calculate_rank_change(
    current_rank,
    previous_rank
):

    # -----------------------------------------------------
    # CURRENT RANK UNKNOWN
    # -----------------------------------------------------

    if not isinstance(
        current_rank,
        int
    ):

        return 0

    # -----------------------------------------------------
    # NO PREVIOUS RANK
    # -----------------------------------------------------

    if not isinstance(
        previous_rank,
        int
    ):

        return 0

    # -----------------------------------------------------
    # IMPORTANT:
    #
    # previous 71
    # current 69
    #
    # 71 - 69 = +2
    #
    # previous 69
    # current 71
    #
    # 69 - 71 = -2
    # -----------------------------------------------------

    return (
        previous_rank
        -
        current_rank
    )


# =========================================================
# APPLY RANK HISTORY
# =========================================================

def apply_rank_history(
    songs,
    history
):

    # -----------------------------------------------------
    # FIND PREVIOUS SNAPSHOT
    # -----------------------------------------------------

    previous_snapshot = None

    if history:

        sorted_history = sorted(
            history,
            key=lambda item:
            item.get(
                "snapshot_time",
                ""
            )
        )

        previous_snapshot = (
            sorted_history[-1]
        )

    # -----------------------------------------------------
    # PROCESS CURRENT SONGS
    # -----------------------------------------------------

    processed = []

    for song in songs:

        current_rank = song.get(
            "rank"
        )

        previous_song = (
            find_previous_song(
                previous_snapshot,
                song
            )
        )

        previous_rank = None

        if previous_song:

            previous_rank = (
                previous_song.get(
                    "rank"
                )
            )

        rank_change = (
            calculate_rank_change(
                current_rank,
                previous_rank
            )
        )

        # -------------------------------------------------
        # UNIVERSAL RANK DATA
        # -------------------------------------------------

        song["previous_rank"] = (
            previous_rank
        )

        song["rank_change"] = (
            rank_change
        )

        processed.append(
            song
        )

    return processed


# =========================================================
# SAVE SNAPSHOT
# =========================================================

def save_snapshot(
    key,
    platform,
    chart,
    source,
    songs,
    snapshot_time=None,
    source_time=None
):

    if not songs:

        print(
            f"[{platform} {chart}] "
            "RESCENE tidak ditemukan → SKIP"
        )

        return False

    if snapshot_time is None:

        snapshot_time = (
            get_snapshot_time(
                source_time
            )
        )

    output_file = OUTPUT_FILES[key]

    data = load_json_file(
        output_file
    )

    history = data.get(
        "snapshots",
        []
    )

    # -----------------------------------------------------
    # DUPLICATE SNAPSHOT
    # -----------------------------------------------------

    for existing in history:

        if (
            existing.get(
                "snapshot_time"
            )
            ==
            snapshot_time
        ):

            print(
                f"[{platform} {chart}] "
                f"{snapshot_time} sudah ada → SKIP"
            )

            return False

    # -----------------------------------------------------
    # CALCULATE PREVIOUS RANK
    # -----------------------------------------------------

    songs = apply_rank_history(
        songs=songs,
        history=history
    )

    # -----------------------------------------------------
    # CREATE SNAPSHOT
    # -----------------------------------------------------

    snapshot = {

        "snapshot_time":
            snapshot_time,

        "date":
            snapshot_time[:10],

        "hour":
            int(
                snapshot_time[11:13]
            ),

        "platform":
            platform,

        "chart":
            chart,

        "source":
            source,

        "songs":
            songs

    }

    history.append(
        snapshot
    )

    # -----------------------------------------------------
    # CLEAN OLD HISTORY
    # -----------------------------------------------------

    history = remove_old_history(
        history
    )

    # -----------------------------------------------------
    # FINAL JSON
    # -----------------------------------------------------

    data = {

        "platform":
            platform,

        "chart":
            chart,

        "source":
            source,

        "artist":
            TARGET_ARTIST,

        "updated_at":
            snapshot_time,

        "snapshots":
            history

    }

    save_json(
        output_file,
        data
    )

    print(
        f"[{platform} {chart}] "
        f"SAVED → {snapshot_time} "
        f"({len(songs)} songs)"
    )

    # -----------------------------------------------------
    # DEBUG RANK CHANGES
    # -----------------------------------------------------

    for song in songs:

        rank = song.get(
            "rank"
        )

        previous = song.get(
            "previous_rank"
        )

        change = song.get(
            "rank_change"
        )

        title = song.get(
            "title",
            ""
        )

        if (
            isinstance(rank, int)
            and isinstance(previous, int)
        ):

            if change > 0:

                change_text = (
                    f"↑ {change}"
                )

            elif change < 0:

                change_text = (
                    f"↓ {abs(change)}"
                )

            else:

                change_text = "="

            print(
                f"   {title} | "
                f"{previous} → {rank} "
                f"{change_text}"
            )

        else:

            print(
                f"   {title} | "
                f"{rank} | NEW / NO PREVIOUS"
            )

    return True


# =========================================================
# NORMALIZE
# =========================================================

def normalize_song(
    rank,
    title,
    artist,
    cover="",
    previous_rank=None,
    rank_change=0,
    likes=None,
    score=None,
    track_id=None
):

    return {

        "rank":
            rank,

        "previous_rank":
            previous_rank,

        "title":
            title,

        "artist":
            artist,

        "cover":
            cover,

        "likes":
            likes,

        "rank_change":
            rank_change,

        "score":
            score,

        "track_id":
            track_id

    }


# =========================================================
# 1. MELON TOP100
# =========================================================

def collect_melon_top100():

    print()
    print("=" * 70)
    print("1. MELON TOP100")
    print("=" * 70)

    response = request_url(
        MELON_TOP100_URL
    )

    if not response:
        return

    print(
        "STATUS:",
        response.status_code
    )

    if response.status_code != 200:

        print("SKIP")
        return

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    songs = []

    rows = soup.select(
        "tr.lst50, tr.lst100"
    )

    print(
        "ROWS:",
        len(rows)
    )

    for row in rows:

        rank_el = row.select_one(
            ".rank"
        )

        title_el = row.select_one(
            ".rank01 span a"
        )

        artist_el = row.select_one(
            ".rank02 span a"
        )

        if not (
            rank_el
            and title_el
            and artist_el
        ):

            continue

        artist = artist_el.get_text(
            " ",
            strip=True
        )

        if not (
            "RESCENE" in artist.upper()
            or "리센느" in artist
        ):

            continue

        try:

            rank = int(
                rank_el.get_text(
                    strip=True
                )
            )

        except ValueError:

            continue

        title = title_el.get_text(
            " ",
            strip=True
        )

        cover_el = row.select_one(
            ".image_typeAll img"
        )

        cover = ""

        if cover_el:

            cover = (
                cover_el.get("src")
                or
                cover_el.get(
                    "data-original",
                    ""
                )
            )

        songs.append(
            normalize_song(
                rank=rank,
                title=title,
                artist=artist,
                cover=cover
            )
        )

    print(
        "RESCENE SONGS:",
        len(songs)
    )

    save_snapshot(
        key="melon_top100",
        platform="Melon",
        chart="TOP100",
        source="Melon",
        songs=songs
    )


# =========================================================
# 2. MELON HOT100
# =========================================================

def collect_melon_hot100(
    days,
    key
):

    print()
    print("=" * 70)
    print(
        f"MELON HOT100 — {days} DAYS"
    )
    print("=" * 70)

    if days == 30:

        url = MELON_HOT100_30_URL

    elif days == 100:

        url = MELON_HOT100_100_URL

    else:

        print(
            f"Hot100 {days} Days tidak valid → SKIP"
        )

        return

    print(
        "URL:",
        url
    )

    response = request_url(
        url
    )

    if not response:
        return

    print(
        "STATUS:",
        response.status_code
    )

    if response.status_code != 200:

        print("SKIP")
        return

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    songs = []

    rows = soup.select(
        "tr.lst50, tr.lst100"
    )

    print(
        "ROWS:",
        len(rows)
    )

    for row in rows:

        rank_el = row.select_one(
            ".rank"
        )

        title_el = row.select_one(
            ".rank01 span a"
        )

        artist_el = row.select_one(
            ".rank02 span a"
        )

        if not (
            rank_el
            and title_el
            and artist_el
        ):

            continue

        artist = artist_el.get_text(
            " ",
            strip=True
        )

        if not (
            "RESCENE" in artist.upper()
            or "리센느" in artist
        ):

            continue

        try:

            rank = int(
                rank_el.get_text(
                    strip=True
                )
            )

        except ValueError:

            continue

        title = title_el.get_text(
            " ",
            strip=True
        )

        cover_el = row.select_one(
            ".image_typeAll img"
        )

        cover = ""

        if cover_el:

            cover = (
                cover_el.get("src")
                or
                cover_el.get(
                    "data-original",
                    ""
                )
            )

        songs.append(
            normalize_song(
                rank=rank,
                title=title,
                artist=artist,
                cover=cover
            )
        )

    print(
        "RESCENE SONGS:",
        len(songs)
    )

    save_snapshot(
        key=key,
        platform="Melon",
        chart=f"HOT100 ({days} Days)",
        source="Melon",
        songs=songs
    )


# =========================================================
# 3. GUYSOME
# =========================================================

def build_guysome_url(dt):

    date_part = dt.strftime(
        "%Y%m%d"
    )

    hour_part = dt.strftime(
        "%H"
    )

    return (
        f"{GUYSOME_BASE_URL}/"
        f"{date_part}/"
        f"{hour_part}"
    )


def fetch_guysome_page(dt):

    url = build_guysome_url(
        dt
    )

    print(
        "Guysome:",
        url
    )

    response = request_url(
        url
    )

    if not response:

        return None, None

    if response.status_code != 200:

        print(
            "HTTP:",
            response.status_code
        )

        return None, None

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    if not soup.select("tr"):

        return None, None

    return soup, url


def find_latest_guysome():

    current_hour = (
        get_current_hour_kst()
    )

    for offset in range(
        0,
        MAX_HOUR_LOOKBACK + 1
    ):

        target_time = (
            current_hour
            - timedelta(hours=offset)
        )

        soup, url = (
            fetch_guysome_page(
                target_time
            )
        )

        if soup is not None:

            return (
                soup,
                target_time,
                url
            )

    return (
        None,
        None,
        None
    )


def collect_guysome():

    print()
    print("=" * 70)
    print("4. MELON REAL-TIME — GUYSOME")
    print("=" * 70)

    (
        soup,
        source_time,
        source_url
    ) = find_latest_guysome()

    if soup is None:

        print(
            "Guysome tidak tersedia → SKIP"
        )

        return

    print(
        "SOURCE:",
        source_url
    )

    songs = []

    for row in soup.select("tr"):

        artist_el = row.select_one(
            ".subject .singer"
        )

        if not artist_el:
            continue

        artist = artist_el.get(
            "title",
            ""
        ).strip()

        if artist != TARGET_ARTIST:
            continue

        rank_el = row.select_one(
            ".ranking span[class^='no']"
        )

        if not rank_el:
            continue

        try:

            rank = int(
                rank_el.get_text(
                    strip=True
                )
            )

        except ValueError:

            continue

        title_el = row.select_one(
            ".subject p[title]"
        )

        title = ""

        if title_el:

            title = title_el.get(
                "title",
                ""
            ).strip()

        cover_el = row.select_one(
            ".albumimg img"
        )

        cover = ""

        if cover_el:

            cover = cover_el.get(
                "src",
                ""
            ).strip()

        likes_el = row.select_one(
            ".count .like"
        )

        likes = None

        if likes_el:

            try:

                likes = int(
                    likes_el
                    .get_text(
                        strip=True
                    )
                    .replace(
                        ",",
                        ""
                    )
                )

            except ValueError:

                pass

        songs.append(
            normalize_song(
                rank=rank,
                title=title,
                artist=artist,
                cover=cover,
                likes=likes
            )
        )

    snapshot_time = (
        get_snapshot_time(
            source_time
        )
    )

    save_snapshot(
        key="melon_realtime",
        platform="Melon",
        chart="Real-time",
        source="Guysome",
        songs=songs,
        snapshot_time=snapshot_time,
        source_time=source_time
    )


# =========================================================
# 4. BUGS REAL-TIME
# =========================================================

def collect_bugs():

    print()
    print("=" * 70)
    print("5. BUGS REAL-TIME")
    print("=" * 70)

    response = request_url(
        BUGS_REALTIME_URL
    )

    if not response:
        return

    print(
        "STATUS:",
        response.status_code
    )

    if response.status_code != 200:

        print("SKIP")
        return

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    songs = []

    rows = soup.select(
        "table.trackList tbody tr"
    )

    if not rows:

        rows = soup.select(
            "tr"
        )

    for row in rows:

        artist_el = row.select_one(
            ".artist a"
        )

        if not artist_el:

            artist_el = row.select_one(
                "a.artist"
            )

        if not artist_el:
            continue

        artist = artist_el.get_text(
            " ",
            strip=True
        )

        if (
            TARGET_ARTIST.lower()
            not in artist.lower()
            and
            "리센느" not in artist
        ):

            continue

        title_el = row.select_one(
            ".title a"
        )

        if not title_el:

            title_el = row.select_one(
                "a.title"
            )

        if not title_el:
            continue

        title = title_el.get_text(
            " ",
            strip=True
        )

        rank_el = row.select_one(
            ".ranking"
        )

        rank = None

        if rank_el:

            text = rank_el.get_text(
                " ",
                strip=True
            )

            digits = ""

            for char in text:

                if char.isdigit():

                    digits += char

                elif digits:

                    break

            if digits:

                try:

                    rank = int(
                        digits
                    )

                except ValueError:

                    pass

        if rank is None:

            class_match = row.get(
                "class",
                []
            )

            for cls in class_match:

                if cls.startswith(
                    "rank"
                ):

                    try:

                        rank = int(
                            cls.replace(
                                "rank-",
                                ""
                            )
                        )

                    except ValueError:

                        pass

        if rank is None:
            continue

        cover_el = row.select_one(
            "img"
        )

        cover = ""

        if cover_el:

            cover = (
                cover_el.get("src")
                or
                cover_el.get("data-original")
                or
                cover_el.get("data-lazy")
                or
                ""
            ).strip()

        songs.append(
            normalize_song(
                rank=rank,
                title=title,
                artist=artist,
                cover=cover
            )
        )

    save_snapshot(
        key="bugs_realtime",
        platform="Bugs",
        chart="Real-time",
        source="Bugs",
        songs=songs
    )


# =========================================================
# 5. GENIE TOP200
# =========================================================

def parse_genie_page(html):

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    songs = []

    rows = soup.select(
        "tr.list"
    )

    for row in rows:

        artist_el = row.select_one(
            "a.artist"
        )

        if not artist_el:

            artist_el = row.select_one(
                ".artist"
            )

        if not artist_el:
            continue

        artist = artist_el.get_text(
            " ",
            strip=True
        )

        if (
            TARGET_ARTIST.lower()
            not in artist.lower()
        ):

            continue

        title_el = row.select_one(
            "a.title"
        )

        if not title_el:
            continue

        title = title_el.get_text(
            " ",
            strip=True
        )

        title = title.lstrip(
            " "
        )

        cover_el = row.select_one(
            "img"
        )

        cover = ""

        if cover_el:

            cover = (
                cover_el.get("src")
                or
                cover_el.get("data-original")
                or
                cover_el.get("data-lazy")
                or
                ""
            ).strip()

            if cover.startswith("//"):

                cover = (
                    "https:"
                    + cover
                )

        rank_el = row.select_one(
            ".number"
        )

        if not rank_el:
            continue

        rank_text = rank_el.get_text(
            " ",
            strip=True
        )

        rank = None

        for token in rank_text.split():

            if token.isdigit():

                rank = int(token)

                break

        if rank is None:
            continue

        track_id = ""

        for link in row.select("a"):

            href = link.get(
                "href",
                ""
            )

            if "/detail/" in href:

                track_id = (
                    href
                    .split("/detail/")[-1]
                    .split("?")[0]
                )

                break

        songs.append(
            normalize_song(
                rank=rank,
                title=title,
                artist=artist,
                cover=cover,
                track_id=track_id
            )
        )

    return songs


def collect_genie():

    print()
    print("=" * 70)
    print("6. GENIE TOP200 — HOURLY")
    print("=" * 70)

    now = get_current_hour_kst()

    ymd = now.strftime(
        "%Y%m%d"
    )

    hh = now.strftime(
        "%H"
    )

    songs = []

    for page in range(
        1,
        5
    ):

        response = request_url(
            GENIE_BASE_URL,
            params={
                "ditc": "D",
                "ymd": ymd,
                "hh": hh,
                "rtm": "Y",
                "pg": page
            }
        )

        if not response:
            continue

        if response.status_code != 200:

            print(
                f"Genie page {page}: "
                f"HTTP {response.status_code}"
            )

            continue

        page_songs = (
            parse_genie_page(
                response.text
            )
        )

        songs.extend(
            page_songs
        )

    unique = {}

    for song in songs:

        key = (
            song.get("track_id")
            or
            (
                song.get("rank"),
                song.get("title")
            )
        )

        unique[str(key)] = song

    songs = list(
        unique.values()
    )

    songs.sort(
        key=lambda song:
        song.get(
            "rank",
            9999
        )
    )

    save_snapshot(
        key="genie_top200",
        platform="Genie",
        chart="TOP200",
        source="Genie",
        songs=songs
    )


# =========================================================
# 6. FLO REAL-TIME
# =========================================================

def collect_flo():

    print()
    print("=" * 70)
    print("7. FLO REAL-TIME")
    print("=" * 70)

    response = request_url(
        FLO_URL
    )

    if not response:
        return

    print(
        "STATUS:",
        response.status_code
    )

    if response.status_code != 200:

        print("SKIP")
        return

    try:

        data = response.json()

    except ValueError:

        print(
            "FLO JSON ERROR → SKIP"
        )

        return

    chart_data = data.get(
        "data",
        {}
    )

    track_list = chart_data.get(
        "trackList",
        []
    )

    songs = []

    for index, track in enumerate(
        track_list,
        start=1
    ):

        artist_data = (
            track.get(
                "representationArtist",
                {}
            )
        )

        artist = artist_data.get(
            "name",
            ""
        )

        if (
            TARGET_ARTIST.lower()
            not in artist.lower()
        ):

            continue

        title = track.get(
            "name",
            ""
        )

        track_id = track.get(
            "id"
        )

        score = track.get(
            "score"
        )

        album = track.get(
            "album",
            {}
        )

        img = album.get(
            "img",
            {}
        )

        url_format = img.get(
            "urlFormat",
            ""
        )

        cover = ""

        if url_format:

            cover = url_format.replace(
                "{size}",
                "350"
            )

        songs.append(
            normalize_song(
                rank=index,
                title=title,
                artist=artist,
                cover=cover,
                score=score,
                track_id=track_id
            )
        )

    save_snapshot(
        key="flo_realtime",
        platform="FLO",
        chart="Real-time",
        source="FLO API",
        songs=songs
    )


# =========================================================
# 7. VIBE DOMESTIC
# =========================================================

def recursive_vibe_search(
    obj,
    results
):

    if isinstance(
        obj,
        dict
    ):

        text = json.dumps(
            obj,
            ensure_ascii=False
        ).lower()

        if (
            TARGET_ARTIST.lower()
            in text
        ):

            results.append(
                obj
            )

        for value in obj.values():

            recursive_vibe_search(
                value,
                results
            )

    elif isinstance(
        obj,
        list
    ):

        for item in obj:

            recursive_vibe_search(
                item,
                results
            )


def collect_vibe():

    print()
    print("=" * 70)
    print("8. VIBE DOMESTIC")
    print("=" * 70)

    vibe_headers = {

        "Accept":
            "application/json, "
            "text/plain, */*",

        "Referer":
            "https://vibe.naver.com/"
            "chart/domestic",

        "Origin":
            "https://vibe.naver.com"

    }

    response = request_url(
        VIBE_URL,
        headers=vibe_headers
    )

    if not response:
        return

    print(
        "STATUS:",
        response.status_code
    )

    if response.status_code != 200:

        print("SKIP")
        return

    try:

        data = response.json()

    except ValueError:

        print(
            "VIBE JSON ERROR → SKIP"
        )

        return

    matches = []

    recursive_vibe_search(
        data,
        matches
    )

    unique = {}

    for item in matches:

        track_id = (
            item.get("trackId")
            or
            item.get("track_id")
            or
            item.get("id")
        )

        if track_id is not None:

            unique[str(track_id)] = item

        else:

            unique[
                json.dumps(
                    item,
                    sort_keys=True,
                    ensure_ascii=False
                )
            ] = item

    matches = list(
        unique.values()
    )

    songs = []

    for item in matches:

        title = (
            item.get("trackTitle")
            or
            item.get("title")
            or
            item.get("trackName")
            or
            ""
        )

        artist = (
            item.get("artistName")
            or
            item.get("artist")
            or
            ""
        )

        rank = (
            item.get("rank")
            or
            item.get("ranking")
        )

        track_id = (
            item.get("trackId")
            or
            item.get("track_id")
            or
            item.get("id")
        )

        cover = (
            item.get("albumImageUrl")
            or
            item.get("imageUrl")
            or
            item.get("cover")
            or
            ""
        )

        if not artist:

            text = json.dumps(
                item,
                ensure_ascii=False
            )

            if (
                TARGET_ARTIST.lower()
                in text.lower()
            ):

                artist = TARGET_ARTIST

        if not title:
            continue

        try:

            rank = int(rank)

        except (
            TypeError,
            ValueError
        ):

            rank = None

        songs.append(
            normalize_song(
                rank=rank,
                title=title,
                artist=artist,
                cover=cover,
                track_id=track_id
            )
        )

    songs.sort(
        key=lambda song:
        song.get("rank")
        if isinstance(
            song.get("rank"),
            int
        )
        else 9999
    )

    save_snapshot(
        key="vibe_domestic",
        platform="VIBE",
        chart="Domestic",
        source="VIBE API",
        songs=songs
    )


# =========================================================
# MAIN
# =========================================================

def main():

    print()
    print("=" * 70)
    print("K-CHART COLLECTOR")
    print("=" * 70)

    now = get_current_hour_kst()

    print()
    print(
        "CURRENT KST :",
        now.isoformat()
    )

    print(
        "SNAPSHOT    :",
        get_snapshot_time(now)
    )

    print(
        "TARGET      :",
        TARGET_ARTIST
    )

    print("=" * 70)

    # -----------------------------------------------------
    # 1. MELON TOP100
    # -----------------------------------------------------

    try:

        collect_melon_top100()

    except Exception as error:

        print(
            "MELON TOP100 ERROR:",
            error
        )

    # -----------------------------------------------------
    # 2. MELON HOT100 100 DAYS
    # -----------------------------------------------------

    try:

        collect_melon_hot100(
            days=100,
            key="melon_hot100_100"
        )

    except Exception as error:

        print(
            "MELON HOT100 100 ERROR:",
            error
        )

    # -----------------------------------------------------
    # 3. MELON HOT100 30 DAYS
    # -----------------------------------------------------

    try:

        collect_melon_hot100(
            days=30,
            key="melon_hot100_30"
        )

    except Exception as error:

        print(
            "MELON HOT100 30 ERROR:",
            error
        )

    # -----------------------------------------------------
    # 4. GUYSOME
    # -----------------------------------------------------

    try:

        collect_guysome()

    except Exception as error:

        print(
            "GUYSOME ERROR:",
            error
        )

    # -----------------------------------------------------
    # 5. BUGS
    # -----------------------------------------------------

    try:

        collect_bugs()

    except Exception as error:

        print(
            "BUGS ERROR:",
            error
        )

    # -----------------------------------------------------
    # 6. GENIE
    # -----------------------------------------------------

    try:

        collect_genie()

    except Exception as error:

        print(
            "GENIE ERROR:",
            error
        )

    # -----------------------------------------------------
    # 7. FLO
    # -----------------------------------------------------

    try:

        collect_flo()

    except Exception as error:

        print(
            "FLO ERROR:",
            error
        )

    # -----------------------------------------------------
    # 8. VIBE
    # -----------------------------------------------------

    try:

        collect_vibe()

    except Exception as error:

        print(
            "VIBE ERROR:",
            error
        )

    # -----------------------------------------------------
    # DONE
    # -----------------------------------------------------

    print()
    print("=" * 70)
    print("K-CHART COLLECTOR SELESAI")
    print("=" * 70)
    print()
    print(
        "ALL SNAPSHOTS USE KST HH:00:00"
    )
    print()


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    try:

        main()

    except Exception as error:

        print()
        print("=" * 70)
        print("FATAL COLLECTOR ERROR")
        print("=" * 70)
        print(
            str(error)
        )
        print()

        raise