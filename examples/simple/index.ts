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