import { el, text } from "redom"
import { PGNumber } from "../../number"
import { Dispatcher, StateUpdated } from "../../playground"

const rname = [
  "R0",
  "R1",
  "R2",
  "R3",
  "R4",
  "R5",
  "SP",
  "PC",
]

export function Registers(dispatcher: Dispatcher) {

  let registers = [ 0, 0, 0, 0, 0, 0, 0, 0 ]

  const values = registers.map((_, i) => PGNumber(dispatcher, registers[i]))

  dispatcher.register("StateUpdated", (ev: StateUpdated) => {
    const deltas = ev.deltas.register_delta
    for (const [rno, val] of deltas) {
      registers[rno] = val 
      values[rno].update(val)
    }
  })


  return (
    el("table.registers", [
      registers.map((_reg, i) => {
        return el("tr", [
          el("th", text(rname[i])),
          el("td", values[i]),
        ])
      })
    ])
  )
}

