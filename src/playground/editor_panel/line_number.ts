import { el, setAttr, text } from "redom"
import { Dispatcher, StateUpdated } from "../playground"

export function LineNumber(dispatcher: Dispatcher, n: number, line_pc: number) {
  let breakpointSet = false
  let this_is_the_current_line = false

  const breakpointFlag = el("span.bp-flag", text("🛑"))

  const element = el("div.line-number", [
    breakpointFlag,
    el("div.n", text(n.toString())),
    el("div.arrow", text("▸"))
  ])

  if (line_pc >= 0) {
    element.onclick = (ev: Event) => {
      ev.preventDefault()
      breakpointSet = !breakpointSet
      update()
      dispatcher.dispatch({ type: "ToggleSetBreakpoint", address: line_pc })
    }
  }

  dispatcher.register("StateUpdated", (ev: StateUpdated) => {
    const pc = ev.deltas.register_delta.get(7)
    this_is_the_current_line = pc == line_pc
    update()
  })

  function update() {
    let cls = "line-number"
    if (this_is_the_current_line) cls += " current"
    if (breakpointSet) cls += " bp-set"

    setAttr(element, { class: cls })
  }

  return {
    el:   element,
    update
  }
}


