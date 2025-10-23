import { Siggn } from '@siggn/core';

type Msg = {
  type: "add_value",
  value: number
} | {
  type: "sub_value",
  value: number

}

export const siggn = new Siggn<Msg>()

let count = 0

siggn.subscribe("1", "add_value", (msg) => {
  count += msg.value
})

siggn.subscribe("2", "sub_value", (msg) => {
  count -= msg.value
})

siggn.publish({
  type: "add_value",
  value: 4
}) 

// Count should be 4
console.log(count)

siggn.publish({
  type: "sub_value",
  value: 2
})

// Count should be 2
console.log(count)