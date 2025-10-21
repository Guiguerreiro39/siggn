import  { Siggn} from "./siggn.js";
import { test, expect } from "vitest";

type Msg = {
  type: 'increment_count',
  value: number
} | { type: 'decrement_count', value: number}

test("Siggn", () => {
  const siggn = new Siggn<Msg>();
  let count = 0;

  siggn.subscribe('1', 'increment_count', (msg) => {
    count += msg.value;
  })

  siggn.subscribe('1', 'decrement_count', (msg) => {
    count -= msg.value;
  })

  siggn.emit({ type: 'increment_count', value: 4 });

  expect(count).toBe(4);

  siggn.emit({ type: 'decrement_count', value: 2 });

  expect(count).toBe(2);
});