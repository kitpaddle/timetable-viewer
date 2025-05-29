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
            id: null,   // rikshallplats 740-ID
            name: null,
            lat: null,
            lon: null,
            transportMode: null   // bus / rail / …
        };
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

    // KeyValue pair → rikshallplats
    if (PATH('KeyValue', 'Key')) { keyPending = t; return; }
    if (PATH('KeyValue', 'Value')) {
        if (keyPending === 'rikshallplats') stop.id = t;
        keyPending = null;
        return;
    }

    // TransportMode
    if (PATH('TransportMode')) { stop.transportMode = t; return; }
});

parser.on('closetag', tag => {
    if (tag === 'StopPlace') {
        inStop = false;
        if (stop.id && stop.lat && stop.lon) {
            if (!firstRecord) out.write(',');
            firstRecord = false;
            out.write(JSON.stringify(stop));
            total++;
        }
        stop = null;
    }
    stack.pop();
});

parser.on('end', () => {
    out.end(']');
    console.log(`✅  Extracted ${total} stops → ${path.basename(DEST)}`);
});

parser.on('error', err => {
    console.error('❌  SAX error:', err.message);
    process.exit(1);
});

src.pipe(parser);
