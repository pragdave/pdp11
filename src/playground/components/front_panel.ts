import { el, text } from "redom"
import { Dispatcher } from "../playground"
import { BaseSelector } from "./front_panel/base_selector"
{/* import { PSW } from "./front_panel/psw" */}
import { Registers }    from "./front_panel/registers"

export interface FrontPanelCallbacks {
  step: () => void,
  run: () => void,
  reset: () => void,
}

{/* export interface FrontPanelProps { */}
{/*   setVisible: Setter<boolean>, */}
{/*     registers: RegisterModel, */}
{/*     psw: PswModel, */}
{/*   emulator: Emulator, */}
{/*   assembled: SourceCode, */}
{/*   callbacks: FrontPanelCallbacks, */}
{/* } */}

export function FrontPanel(dispatcher: Dispatcher) {

  const runButton = el("button", text("Run"))
  runButton.onclick = () => dispatcher.dispatch({ type: "CommandRun" })

  const stepButton = el("button", text("Step"))
  stepButton.onclick = () => dispatcher.dispatch({ type: "CommandStep" })

  const resetButton = el("button", text("Reset"))
  resetButton.onclick = () => dispatcher.dispatch({ type: "CommandReset" })

  // <button onClick={props.callbacks.run} digccsabled={!runnable()}>Run</button>
  //         <button onClick={props.callbacks.step} disabled={!runnable()}>Step</button>
  //         <button onClick={props.callbacks.reset}>Reset</button>
  return el(".front-panel", [
    el(".holder-controls.holder", [
      el("h1", text("Controls")),
      el(".switches", [
        runButton,
        stepButton,
        resetButton
      ]),
      BaseSelector(dispatcher),
    ]),
    el(".holder-registers.holder", [
      el("h1", text("Registers")),
      Registers(dispatcher)
    ])
  ])
  // function runnable() {
  //   return props.assembled.errorCount == 0 // && props.status.runningState != RunningState.Running
  // }


  // return (
  //   <div  class="front-panel">
  //     <div class="holder-controls holder">
  //       <h1>Controls</h1>
  //       <div class="switches">
  //       </div>
  //     <BaseSelector/>
  //     </div>
  //     <div class="holder-psw holder">
  //       <h1>Processor Status</h1>
  //       <PSW psw={props.psw} />
  //       <hr/>
  //       <h3>Help</h3>
  //       <ul>
  //         <li>...</li>
  //         <li>...</li>
  //         <li>...</li>
  //       </ul>
  //       <hr/>
  //       <button onClick={() => props.setVisible(false)}>Close Playground</button>
  //     </div>
  //     </div>
  //     )
}


