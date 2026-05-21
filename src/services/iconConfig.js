// Icons for the map

import {
    Bus,
    TrainFront,
    TramFront,
    TrainFrontTunnel,
    Ship,
    MapPin
} from 'lucide-vue-next'

import busSvg from 'lucide-static/icons/bus.svg?raw'
import trainSvg from 'lucide-static/icons/train-front.svg?raw'
import tramSvg from 'lucide-static/icons/tram-front.svg?raw'
import subwaySvg from 'lucide-static/icons/train-front-tunnel.svg?raw'
import ferrySvg from 'lucide-static/icons/ship.svg?raw'
import mapPinSvg from 'lucide-static/icons/map-pin.svg?raw'

export const iconConfig = {
    rail:  { icon: TrainFront,        svg: trainSvg,  color: '#ffffff', bg: '#2563eb' },
    bus:   { icon: Bus,               svg: busSvg,    color: '#ffffff', bg: '#16a34a' },
    tram:  { icon: TramFront,         svg: tramSvg,   color: '#ffffff', bg: '#d97706' },
    metro: { icon: TrainFrontTunnel,  svg: subwaySvg, color: '#ffffff', bg: '#9333ea' },
    ferry: { icon: Ship,              svg: ferrySvg,  color: '#ffffff', bg: '#0284c7' },
    water: { icon: Ship,              svg: ferrySvg,  color: '#ffffff', bg: '#0284c7' },
    other: { icon: MapPin,            svg: mapPinSvg, color: '#ffffff', bg: '#6b7280' },
}
  