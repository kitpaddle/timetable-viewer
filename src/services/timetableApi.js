// ResRobot DepartureBoard v2.1

const BASE = 'https://api.resrobot.se/v2.1/departureBoard'
const KEY = import.meta.env.VITE_TIMETABLE_API_KEY   //  ← from .env

// Unique Modes in my data: 
// ['bus', 'ferry','metro', 'other','rail', 'tram','water']

// Based on ResRobot’s official mapping, and treating all I don't have as BUSES
const clsToMode = {
    '1': 'bus',       // Air Traffic
    '2': 'rail',     // High speed trains
    '4': 'rail',     // Regional trains, Intercity
    '8': 'bus',       // Express buses, Airport buses
    '16': 'rail',    // Local trains
    '32': 'metro',    // Metro
    '64': 'tram',     // Trams
    '128': 'bus',     // Buses
    '256': 'ferry',   // Ferries
    '512': 'bus'      // Taxis
  }

function sanitizeLine(raw) {
    return raw === '.' ? 'FAC' : raw
}  

export async function getDepartures(stationId) {
    // ?id=STATION&format=json&accessId=KEY&maxJourneys=10 would also work,
    // but we’ll fetch everything and slice on the client
    const url = `${BASE}?id=${stationId}&format=json&accessId=${KEY}&maxJourneys=50&duration=200`

    const res = await fetch(url)
    if (!res.ok) throw new Error('ResRobot API error ' + res.status)

    const data = await res.json()
    if (!data.Departure) return []
    //console.log(data.Departure)
    
    return data.Departure.map(d => {
        const cls = d.Product?.[0]?.cls
        const tMode = clsToMode[cls] || 'bus' // fallback to bus if unknown

        return {
            id: `${d.time}-${d.transportNumber}-${d.direction}`,
            line: sanitizeLine(d.transportNumber || d.Product?.[0]?.num || d.Product?.[0]?.name),
            destination: d.direction,
            time: d.time,
            timeISO: `${d.date}T${d.time}`,
            tMode,
            raw: d // include full original data (for testing!)
        }
    })     
}
