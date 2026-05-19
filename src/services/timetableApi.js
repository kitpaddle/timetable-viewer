// Trafiklab Realtime API

const BASE = 'https://realtime-api.trafiklab.se/v1'
const KEY = import.meta.env.VITE_REALTIME_API_KEY

const transportModeMap = {
    'BUS':   'bus',
    'METRO': 'metro',
    'TRAIN': 'rail',
    'TRAM':  'tram',
    'TAXI':  'bus',
    'BOAT':  'ferry'
}

function sanitizeLine(raw) {
    return raw === '.' ? 'FAC' : raw
}

function toHHMM(iso) {
    return iso ? iso.slice(11, 16) : ''
}

function toAPITime(date) {
    // Format Date as YYYY-MM-DDTHH:mm (no seconds) for the API time parameter
    const pad = n => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function mapDeparture(d) {
    const tMode = transportModeMap[d.route?.transport_mode] || 'bus'
    const scheduledTime = toHHMM(d.scheduled)
    const realtimeTime  = toHHMM(d.realtime)
    const hasRealtime   = d.is_realtime === true
    const isRealtime    = hasRealtime && realtimeTime !== scheduledTime

    return {
        id:           `${d.scheduled}-${d.route?.designation}-${d.route?.direction}`,
        line:         sanitizeLine(d.route?.designation || d.route?.name || '?'),
        destination:  d.route?.direction || d.route?.destination?.name || '',
        platform:     d.scheduled_platform?.designation || null,
        time:         scheduledTime,
        timeISO:      d.scheduled,
        realtimeTime: isRealtime ? realtimeTime : null,
        hasRealtime,
        isRealtime,
        canceled:     d.canceled || false,
        tMode
    }
}

export async function getDepartures(stationId) {
    const now = new Date()
    const plusOneHour = new Date(now.getTime() + 60 * 60 * 1000)

    const [res1, res2] = await Promise.all([
        fetch(`${BASE}/departures/${stationId}/${toAPITime(now)}?key=${KEY}`),
        fetch(`${BASE}/departures/${stationId}/${toAPITime(plusOneHour)}?key=${KEY}`)
    ])

    if (!res1.ok) throw new Error('Realtime API error ' + res1.status)
    if (!res2.ok) throw new Error('Realtime API error ' + res2.status)

    const [data1, data2] = await Promise.all([res1.json(), res2.json()])

    const deps1 = data1.departures ?? []
    const deps2 = data2.departures ?? []

    // Merge and deduplicate by id (the two windows overlap by ~0 min but be safe)
    const seen = new Set()
    return [...deps1, ...deps2]
        .map(mapDeparture)
        .filter(d => {
            if (seen.has(d.id)) return false
            seen.add(d.id)
            return true
        })
}
