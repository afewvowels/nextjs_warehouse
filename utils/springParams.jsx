import { easeCubicIn } from 'd3-ease'

const trailParams = {
  'horizontal': -150,
  'translate': '0',
  'blur': '0',
}

export const trailSet = {
  configLR: {
    mass: 2,
    tension: 250,
    friction: 30,
    velocity: 0,
    precision: 0.25,
    easing: easeCubicIn()
  },
  configSimple: {
    mass: 1.5,
    tension: 250,
    friction: 25,
    velocity: 0,
    precision: 0.25,
    easing: easeCubicIn()
  },
  fromLeft: {
    width: '100%',
    marginLeft: trailParams.horizontal,
    opacity: 0,
    transform: `translate3d(0, ${trailParams.translate}, 0)`,
    filter: `blur(${trailParams.blur})`
  },
  fromRight: {
    width: '100%',
    marginRight: trailParams.horizontal,
    opacity: 0,
    transform: `translate3d(0, ${trailParams.translate}, 0)`,
    filter: `blur(${trailParams.blur})`
  },
  fromSimple: {
    width: '100%',
    marginLeft: trailParams.horizontal,
    opacity: 0,
    transform: `translate3d(0, ${trailParams.translate}, 0)`,
    filter: `blur(${trailParams.blur})`
  },
  endLR: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    filter: 'blur(0)'
  },
  endSimple: {
    width: '100%',
    marginLeft: 0,
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    filter: 'blur(0)'
  }
}