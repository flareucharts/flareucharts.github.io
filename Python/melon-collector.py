import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from pathlib import Path


# =========================================================
# CONFIG
# =========================================================

TARGET_ARTIST = "RESCENE"

KST = ZoneInfo("Asia/Seoul")

HISTORY_DAYS = 90

BASE_URL = "https://www.melon.com"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Referer": "https://www.melon.com/"
}

OUTPUT_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "melon_charts.json"
)


# =========================================================
# MELON CHARTS
# =========================================================

CHARTS = {

    # -----------------------------------------------------
    # HOURLY
    # -----------------------------------------------------

    "top100": {
        "name": "Melon TOP100",
        "url": (
            "https://www.melon.com/chart/index.htm"
        )
    },

    "hot100_100": {
        "name": "Melon HOT100 (100 Days)",
        "url": (
            "https://www.melon.com/chart/"
            "hot100/index.htm?classCd=100"
        )
    },

    "hot100_30": {
        "name": "Melon HOT100 (30 Days)",
        "url": (
            "https://www.melon.com/chart/"
            "hot100/index.htm?classCd=30"
        )
    },


    # -----------------------------------------------------
    # PERIODIC
    # -----------------------------------------------------

    "daily": {
        "name": "Melon Daily Chart",
        "url": (
            "https://www.melon.com/chart/day/index.htm"
        )
    },

    "weekly": {
        "name": "Melon Weekly Chart",
        "url": (
            "https://www.melon.com/chart/week/index.htm"
        )
    },

    "monthly": {
        "name": "Melon Monthly Chart",
        "url": (
            "https://www.melon.com/chart/month/index.htm"
        )
    }

}


# =========================================================
# CURRENT TIME
# =========================================================

def get_now():

    return datetime.now(KST)


# =========================================================
# SNAPSHOT ID
# =========================================================

def get_snapshot_id():

    now = get_now()

    return now.strftime(
        "%Y%m%d_%H"
    )


# =========================================================
# SNAPSHOT TIME
# =========================================================

def get_snapshot_time():

    return get_now().isoformat()


# =========================================================
# PARSE RANK CHANGE
# =========================================================

def parse_rank_change(row):

    rank_change = 0

    change_element = row.select_one(
        ".rank_wrap .rank_updown"
    )

    if not change_element:
        return 0

    text = change_element.get_text(
        " ",
        strip=True
    )

    if not text:
        return 0


    # -----------------------------------------------------
    # DOWN
    # -----------------------------------------------------

    if "하락" in text:

        number = "".join(
            char
            for char in text
            if char.isdigit()
        )

        if number:
            return -int(number)

        return 0


    # -----------------------------------------------------
    # UP
    # -----------------------------------------------------

    if "상승" in text:

        number = "".join(
            char
            for char in text
            if char.isdigit()
        )

        if number:
            return int(number)

        return 0


    return 0


# =========================================================
# PARSE MELON CHART
# =========================================================

def get_melon_chart(
    chart_key,
    chart_info
):

    print()
    print(
        "=========================================="
    )

    print(
        f"Mengambil {chart_info['name']}"
    )

    print(
        f"URL: {chart_info['url']}"
    )

    print(
        "=========================================="
    )

    results = []


    # -----------------------------------------------------
    # REQUEST
    # -----------------------------------------------------

    try:

        response = requests.get(
            chart_info["url"],
            headers=HEADERS,
            timeout=20
        )

        print(
            f"HTTP: {response.status_code}"
        )

        response.raise_for_status()

    except Exception as error:

        print(
            f"ERROR REQUEST: {error}"
        )

        return results


    # -----------------------------------------------------
    # PARSE HTML
    # -----------------------------------------------------

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )


    # -----------------------------------------------------
    # GET ROWS
    # -----------------------------------------------------

    rows = soup.select(
        "tr.lst50, tr.lst100"
    )

    print(
        f"Jumlah row chart: {len(rows)}"
    )


    # -----------------------------------------------------
    # PARSE ROW
    # -----------------------------------------------------

    for row in rows:

        rank_element = row.select_one(
            ".rank"
        )

        title_element = row.select_one(
            ".rank01 span a"
        )

        artist_element = row.select_one(
            ".rank02 span a"
        )

        album_element = row.select_one(
            ".rank03 a"
        )


        if not rank_element:
            continue

        if not title_element:
            continue

        if not artist_element:
            continue


        # -------------------------------------------------
        # RANK
        # -------------------------------------------------

        try:

            rank = int(
                rank_element.get_text(
                    strip=True
                )
            )

        except ValueError:

            continue


        # -------------------------------------------------
        # TITLE
        # -------------------------------------------------

        title = (
            title_element
            .get_text(
                strip=True
            )
        )


        # -------------------------------------------------
        # ARTIST
        # -------------------------------------------------

        artist = (
            artist_element
            .get_text(
                strip=True
            )
        )


        # -------------------------------------------------
        # FILTER ARTIST
        # -------------------------------------------------

        if (
            TARGET_ARTIST.lower()
            not in artist.lower()
            and "리센느" not in artist
        ):

            continue


        # -------------------------------------------------
        # ALBUM
        # -------------------------------------------------

        album = (
            album_element
            .get_text(
                strip=True
            )
            if album_element
            else ""
        )


        # -------------------------------------------------
        # COVER
        # -------------------------------------------------

        cover_element = row.select_one(
            ".image_typeAll img"
        )

        if not cover_element:

            cover_element = row.select_one(
                "img"
            )

        cover = ""

        if cover_element:

            cover = (
                cover_element
                .get(
                    "src",
                    ""
                )
                .strip()
            )


        # -------------------------------------------------
        # RANK CHANGE
        # -------------------------------------------------

        rank_change = parse_rank_change(
            row
        )


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

            "rank_change":
                rank_change,

            "title":
                title,

            "artist":
                artist,

            "album":
                album,

            "cover":
                cover

        })


    print(
        f"RESCENE ditemukan: {len(results)}"
    )

    return results


# =========================================================
# LOAD EXISTING DATA
# =========================================================

def load_existing_data():

    if not OUTPUT_FILE.exists():

        print(
            "JSON belum ada. Membuat struktur baru."
        )

        return {
            "platform": "Melon",
            "artist": TARGET_ARTIST,
            "updated_at": None,
            "charts": {}
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
                "Invalid JSON root"
            )


        if "charts" not in data:

            data["charts"] = {}


        return data


    except Exception as error:

        print(
            "JSON lama tidak dapat dibaca:",
            error
        )

        return {
            "platform": "Melon",
            "artist": TARGET_ARTIST,
            "updated_at": None,
            "charts": {}
        }


# =========================================================
# REMOVE OLD HISTORY
# =========================================================

def remove_old_history(
    history
):

    cutoff = (
        get_now()
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

        except ValueError:

            continue


        if (
            snapshot_datetime
            >= cutoff
        ):

            cleaned.append(
                snapshot
            )


    return cleaned


# =========================================================
# SNAPSHOT EXISTS
# =========================================================

def snapshot_exists(
    history,
    snapshot_id
):

    return any(
        snapshot.get(
            "snapshot_id"
        ) == snapshot_id
        for snapshot in history
    )


# =========================================================
# SAVE JSON
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
# PROCESS CHART
# =========================================================

def process_chart(
    data,
    chart_key,
    chart_info,
    snapshot_id,
    snapshot_time
):

    songs = get_melon_chart(
        chart_key,
        chart_info
    )


    if not songs:

        print(
            f"{chart_info['name']}: "
            "tidak ada data RESCENE."
        )

        return


    # -----------------------------------------------------
    # CREATE CHART STRUCTURE
    # -----------------------------------------------------

    if chart_key not in data["charts"]:

        data["charts"][chart_key] = {

            "name":
                chart_info["name"],

            "history":
                []

        }


    history = data["charts"][
        chart_key
    ].get(
        "history",
        []
    )


    # -----------------------------------------------------
    # DUPLICATE
    # -----------------------------------------------------

    if snapshot_exists(
        history,
        snapshot_id
    ):

        print(
            f"{chart_info['name']}: "
            f"snapshot {snapshot_id} "
            "sudah ada. SKIP."
        )

        return


    # -----------------------------------------------------
    # CREATE SNAPSHOT
    # -----------------------------------------------------

    snapshot = {

        "snapshot_id":
            snapshot_id,

        "snapshot_time":
            snapshot_time,

        "chart":
            chart_info["name"],

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
    # CLEAN OLD HISTORY
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
    # SAVE CHART
    # -----------------------------------------------------

    data["charts"][
        chart_key
    ]["history"] = history


    data["charts"][
        chart_key
    ]["updated_at"] = snapshot_time


    print(
        f"{chart_info['name']}: "
        "SNAPSHOT DISIMPAN"
    )


# =========================================================
# MAIN
# =========================================================

def main():

    now = get_now()

    snapshot_id = (
        now.strftime(
            "%Y%m%d_%H"
        )
    )

    snapshot_time = (
        now.isoformat()
    )


    print()
    print(
        "=========================================="
    )

    print(
        "MELON DIRECT COLLECTOR"
    )

    print(
        f"TARGET : {TARGET_ARTIST}"
    )

    print(
        f"TIME   : "
        f"{now.strftime('%Y-%m-%d %H:%M:%S')} KST"
    )

    print(
        f"ID     : {snapshot_id}"
    )

    print(
        "=========================================="
    )


    # -----------------------------------------------------
    # LOAD
    # -----------------------------------------------------

    data = load_existing_data()


    data["platform"] = "Melon"
    data["artist"] = TARGET_ARTIST


    # -----------------------------------------------------
    # PROCESS ALL CHARTS
    # -----------------------------------------------------

    for chart_key, chart_info in CHARTS.items():

        process_chart(
            data,
            chart_key,
            chart_info,
            snapshot_id,
            snapshot_time
        )


    # -----------------------------------------------------
    # UPDATED AT
    # -----------------------------------------------------

    data["updated_at"] = (
        snapshot_time
    )


    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    save_data(
        data
    )


    # -----------------------------------------------------
    # DONE
    # -----------------------------------------------------

    print()
    print(
        "=========================================="
    )

    print(
        "MELON COLLECTOR SELESAI"
    )

    print(
        f"FILE: {OUTPUT_FILE}"
    )

    print(
        "=========================================="
    )


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    try:

        main()

    except Exception as error:

        print()
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