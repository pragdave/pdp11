import { el, text } from "redom"
import { Dispatcher } from "../playground"
import { BaseSelector } from "./front_panel/base_selector"
import { PSW } from "./front_panel/psw" 
import { Registers }    from "./front_panel/registers"

export function FrontPanel(dispatcher: Dispatcher) {

  const runButton = el("button", text("Run"))
  runButton.onclick = () => dispatcher.dispatch({ type: "CommandRun" })

  const stepButton = el("button", text("Step"))
  stepButton.onclick = () => dispatcher.dispatch({ type: "CommandStep" })

  const resetButton = el("button", text("Reset"))
  resetButton.onclick = () => dispatcher.dispatch({ type: "CommandReset" })

  const reloadSourceButton = el("button.reload-source", text("Reload source"))
  reloadSourceButton.onclick = () => dispatcher.dispatch({ type: "CommandReloadSource" })

  const closePlaygroundButton = el("button", text("Close playground"))

  
  return el(".front-panel", [
    el(".holder-controls.holder", [
      el("h1", text("Controls")),
      el(".switches", [
        runButton,
        stepButton,
        resetButton,
      ]),
      BaseSelector(dispatcher),
      reloadSourceButton,
    ]),
    el(".holder-registers.holder", [
      el("h1", text("Registers")),
      Registers(dispatcher)
    ]),
    el(".holder-psw.holder", [
      el("h1", text("Processor Status")),
      PSW(dispatcher), 
      el("hr"),
      el("h3", text("help")),
      el("ul", [ el("li"), el("li"), el("li") ]),
      el("hr"),
      closePlaygroundButton,
    ])
  ])

}


