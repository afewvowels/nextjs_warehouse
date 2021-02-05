import { easePolyInOut } from 'd3-ease'

const trailParams = {
  'horizontal': -250,
  'translate': '100px',
  'blur': '3px',
}

export const trailSet = {
  configLR: {
    mass: 2,
    tension: 300,
    friction: 30,
    velocity: 0,
    precision: 0.01,
    easing: easePolyInOut(3.0)
  },
  configSimple: {
    mass: 2,
    tension: 500,
    friction: 45,
    velocity: 0,
    precision: 0.01,
    easing: easePolyInOut(3.0)
  },
  fromLeft: {
    width: '100%',
    opacity: 0,
    transform: `translate3d(0, ${trailParams.translate}, 0)`,
    filter: `blur(${trailParams.blur})`
  },
  fromRight: {
    width: '100%',
    opacity: 0,
    transform: `translate3d(0, ${trailParams.translate}, 0)`,
    filter: `blur(${trailParams.blur})`
  },
  fromSimple: {
    width: '100%',
    opacity: 0,
    transform: `translate3d(0, ${trailParams.translate}, 0)`,
    filter: `blur(${trailParams.blur})`
  },
  endLR: {
    width: '100%',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    filter: 'blur(0)'
  },
  endSimple: {
    width: '100%',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    filter: 'blur(0)'
  }
}