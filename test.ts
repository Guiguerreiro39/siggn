import { Siggo } from "./siggo";

type Msg = {
  type: 'increment_count',
  value: number
} | {
  type: 'decrement_count',
  value: number
}

const siggo = new Siggo<Msg>();

let count = 0

siggo.subscribe('1', 'increment_count', (msg) => {
  count += msg.value
})

siggo.subscribe('2', 'decrement_count', (msg) => {
  count -= msg.value
})

function incrementCount(r: typeof siggo) {
  r.emit({ type: 'increment_count', value: 4 })
}

function decrementCount(r: typeof siggo) {
  r.emit({ type: 'decrement_count', value: 2 })
}
  
incrementCount(siggo)
console.log(count)

decrementCount(siggo)
console.log(count)