// Icons for the map

import {
    Bus,
    TrainFront,
    TramFront,
    TrainFrontTunnel,
    Ship,
    HelpCircle
} from 'lucide-vue-next'

import busSvg from 'lucide-static/icons/bus.svg?raw'
import trainSvg from 'lucide-static/icons/train-front.svg?raw'
import tramSvg from 'lucide-static/icons/tram-front.svg?raw'
import subwaySvg from 'lucide-static/icons/train-front-tunnel.svg?raw'
import ferrySvg from 'lucide-static/icons/ship.svg?raw'
import helpSvg from 'lucide-static/icons/circle-help.svg?raw'

export const iconConfig = {
    rail: { icon: TrainFront, svg: trainSvg, color: '#3b82f6', bg: '#e0f0ff' },
    bus: { icon: Bus, svg: busSvg, color: '#22c55e', bg: '#e6ffed' },
    tram: { icon: TramFront, svg: tramSvg, color: '#d97706', bg: '#fff7e6' },
    metro: { icon: TrainFrontTunnel, svg: subwaySvg, color: '#9333ea', bg: '#f3e8ff' },
    ferry: { icon: Ship, svg: ferrySvg, color: '#0ea5e9', bg: '#e0f7ff' },
    water: { icon: Ship, svg: ferrySvg, color: '#0ea5e9', bg: '#e0f7ff' },
    other: { icon: HelpCircle, svg: helpSvg, color: '#6b7280', bg: '#f3f4f6' }
}
  