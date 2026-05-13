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

export async function getDepartures(stationId) {
    const url = `${BASE}/departures/${stationId}?key=${KEY}`

    const res = await fetch(url)
    if (!res.ok) throw new Error('Realtime API error ' + res.status)

    const data = await res.json()
    if (!data.departures) return []

    return data.departures.map(d => {
        const tMode = transportModeMap[d.route?.transport_mode] || 'bus'
        const scheduledTime = toHHMM(d.scheduled)
        const realtimeTime  = toHHMM(d.realtime)
        const isRealtime    = d.is_realtime === true && d.delay !== 0

        return {
            id:           `${d.scheduled}-${d.route?.designation}-${d.route?.direction}`,
            line:         sanitizeLine(d.route?.designation || d.route?.name || '?'),
            destination:  d.route?.direction || d.route?.destination?.name || '',
            time:         scheduledTime,
            timeISO:      d.scheduled,
            realtimeTime: isRealtime ? realtimeTime : null,
            isRealtime,
            canceled:     d.canceled || false,
            tMode
        }
    })
}
