import { el, setAttr, text } from "redom"
import { Bit } from "../../../assembler-emulator"

function OneBit(dispatcher: Dispatcher, initialPsw: number, { bit, label, title }) {
  const element =  el(`div.bit.${label}`, { title }, text(label))

  function updateState(psw: number) {
    const existingClass = element.classList.toString()

    if (psw & bit)
      setAttr(element, { class: `bit ${label} is-set` })
    else
      setAttr(element, { class: `bit ${label}` })
  }

  updateState(initialPsw)

  dispatcher.register("StateUpdated", (state: StateUpdated) => {
    const psw = state.deltas.psw
    updateState(psw.toWord())
  })

  return element
}

import { Dispatcher, StateUpdated } from "../../playground"

const Fields = [
  { bit: Bit.N, label: "N", title: "last result was negative" },
  { bit: Bit.Z, label: "Z", title: "last result was zero" },
  { bit: Bit.C, label: "C", title: "last result generated unsigned carry" },
  { bit: Bit.V, label: "V", title: "last result overflowed the signed result" },
]
export function PSW(dispatcher: Dispatcher) {
  const psw = 0

  const fields = Fields.map(f => OneBit(dispatcher, psw, f))

  return el("ul.PSW", [
    fields.map(f => el("li", f))
  ])
}


