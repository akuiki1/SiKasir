const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function toISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
}

/**
 * Label ramah untuk rentang tanggal kalender (dipakai PeriodFilter & header laporan).
 * Mendeteksi pola: Hari Ini · {Bulan} {Tahun} · Tahun {Tahun} · "{start} – {end}".
 */
export function formatPeriodLabel(start: string, end: string): string {
    if (!start || !end) {
        return '';
    }

    const today = toISO(new Date());

    if (start === today && end === today) {
        return 'Hari Ini';
    }

    const [sy, sm, sd] = start.split('-');
    const [ey, em, ed] = end.split('-');

    if (start === `${sy}-01-01` && end === `${sy}-12-31`) {
        return `Tahun ${sy}`;
    }

    if (sy === ey && sm === em && sd === '01') {
        const lastDay = new Date(Number(sy), Number(sm), 0).getDate();

        if (Number(ed) === lastDay) {
            return `${MONTHS[Number(sm) - 1]} ${sy}`;
        }
    }

    return start === end ? start : `${start} – ${end}`;
}
