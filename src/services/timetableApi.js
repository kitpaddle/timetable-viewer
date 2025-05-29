// ResRobot DepartureBoard v2.1

const BASE = 'https://api.resrobot.se/v2.1/departureBoard'
const KEY = import.meta.env.VITE_TIMETABLE_API_KEY   //  ← from .env

export async function getDepartures(stationId, maxRows = 10) {
    // ?id=STATION&format=json&accessId=KEY&maxJourneys=10 would also work,
    // but we’ll fetch everything and slice on the client
    const url = `${BASE}?id=${stationId}&format=json&accessId=${KEY}`

    const res = await fetch(url)
    if (!res.ok) throw new Error('ResRobot API error ' + res.status)

    const data = await res.json()
    if (!data.Departure) return []
    console.log(data.Departure.slice(0, maxRows))
    return data.Departure.slice(0, maxRows).map(d => ({
        id: `${d.time}-${d.transportNumber}-${d.direction}`,  // build a unique-ish key
        line: d.transportNumber || d.Product?.num || d.Product?.name,
        destination: d.direction,
        time: d.time,                       // "11:31:00"
        timeISO: `${d.date}T${d.time}`,     // good for <time datetime="">
    }))
}
