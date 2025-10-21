import { Siggn } from './siggn.js';

type Msg =
  | {
      type: 'increment_count';
      value: number;
    }
  | {
      type: 'decrement_count';
      value: number;
    };

const siggn = new Siggn<Msg>();

let count = 0;

siggn.subscribe('1', 'increment_count', (msg) => {
  count += msg.value;
});

siggn.subscribe('2', 'decrement_count', (msg) => {
  count -= msg.value;
});

function incrementCount(r: typeof siggn) {
  r.emit({ type: 'increment_count', value: 4 });
}

function decrementCount(r: typeof siggn) {
  r.emit({ type: 'decrement_count', value: 2 });
}

incrementCount(siggn);
console.log(count);

decrementCount(siggn);
console.log(count);
