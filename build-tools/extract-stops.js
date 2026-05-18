// Script used to loop through TRAFIKLAB XML file of all stops in sweden and create much smaller Json file with relevant data
// Run locally to create file. In a bigger version, could be run on server to update once a day

import fs from 'fs';
import path from 'path';
import sax from 'sax';

const SRC = path.resolve(process.argv[2] || 'swedenData.xml');
const DEST = path.resolve('public/stops.min2.json');

if (!fs.existsSync(SRC)) {
    console.error('❌  File not found:', SRC);
    process.exit(1);
}

// Full mode name → single char saved in JSON
const MODE_CHAR = { bus: 'b', rail: 'r', tram: 't', metro: 'm', water: 'w', ferry: 'f' };

const parser = sax.createStream(true);
const src = fs.createReadStream(SRC);
const out = fs.createWriteStream(DEST);

out.write('[');

let firstRecord = true;
let total = 0;

let inStop = false;
let stop = null;
let keyPending = null;

const stack = [];
const PATH = (...parts) =>
    stack.slice(-parts.length).join('/') === parts.join('/');

parser.on('opentag', node => {
    stack.push(node.name);

    if (node.name === 'StopPlace') {
        inStop = true;
        stop = {
            id: null,
            name: null,
            lat: null,
            lon: null,
            transportMode: null,
            municipality: null
        };
    }

    // TopographicPlaceRef carries ref="NSR:TopographicPlace:XXX" where descriptive name
    // may be in the Name child. But Trafiklab NeTEx often puts municipality in keyValue
    // with key="municipality" or as TopographicPlaceRef/@ref last segment.
    if (inStop && node.name === 'TopographicPlaceRef' && node.attributes) {
        // ref looks like "NSR:TopographicPlace:0180" or "SE:Topographic:Stockholm"
        // Try to extract a readable name from the ref as a fallback
        const ref = node.attributes.ref || node.attributes.Ref || ''
        if (ref && !stop.municipality) {
            const parts = ref.split(':')
            const last = parts[parts.length - 1]
            // Only use it if it looks like a name (not a pure numeric ID)
            if (last && !/^\d+$/.test(last)) {
                stop.municipality = last
            }
        }
    }
});

parser.on('text', txt => {
    if (!inStop) return;
    const t = txt.trim();
    if (!t) return;

    // Name (outside KeyValue)
    if (PATH('StopPlace', 'Name') && stack[stack.length - 3] !== 'KeyValue') {
        stop.name ??= t;
    }

    // Coordinates
    if (PATH('Latitude')) { stop.lat = parseFloat(t); return; }
    if (PATH('Longitude')) { stop.lon = parseFloat(t); return; }

    // KeyValue pairs
    if (PATH('KeyValue', 'Key')) { keyPending = t; return; }
    if (PATH('KeyValue', 'Value')) {
        if (keyPending === 'rikshallplats') stop.id = t;
        if (keyPending === 'municipality' || keyPending === 'Municipality') {
            stop.municipality ??= t;
        }
        keyPending = null;
        return;
    }

    // TransportMode
    if (PATH('TransportMode')) { stop.transportMode = t; return; }

    // TopographicPlace Name inside a parent TopographicPlace element
    if (PATH('TopographicPlace', 'Name') || PATH('TopographicPlaceRef', 'Name')) {
        stop.municipality ??= t;
        return;
    }
});

parser.on('closetag', tag => {
    if (tag === 'StopPlace') {
        inStop = false;
        if (stop.id && stop.lat && stop.lon) {
            if (!firstRecord) out.write(',');
            firstRecord = false;
            const lat = Math.round(stop.lat * 10000) / 10000;
            const lon = Math.round(stop.lon * 10000) / 10000;
            const mode = MODE_CHAR[stop.transportMode] || 'o';
            // Only include municipality if present (keeps file size small for stops without it)
            const row = stop.municipality
                ? [stop.id, stop.name, lat, lon, mode, stop.municipality]
                : [stop.id, stop.name, lat, lon, mode];
            out.write(JSON.stringify(row));
            total++;
        }
        stop = null;
    }
    stack.pop();
});

parser.on('end', () => {
    out.end(']');
    fs.writeFileSync(path.resolve('public/stops-meta.json'), JSON.stringify({ count: total }))
    console.log(`✅  Extracted ${total} stops → ${path.basename(DEST)}`);
});

parser.on('error', err => {
    console.error('❌  SAX error:', err.message);
    process.exit(1);
});

src.pipe(parser);
