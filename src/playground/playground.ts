//r import { Context    } from "./context"
// import { EditorPanel     } from "./editor_panel"
import { FrontPanel } from "./components/front_panel"
import { FailMessagePanel } from "./components/front_panel/fail_message_panel"
// import { Logger     } from "./logger"
// import { ET, Event } from "../assembler-emulator"
import { el, setChildren } from "redom"
import { EditorPanel } from "./editor_panel"
import { BaseDispatcher } from "../shared/dispatcher"
import { AssemblyDone, AssemblyEvent, Emulator, EmulatorEvent, SourceCode } from "../assembler-emulator"
import type { NumberEvent } from "./number"
import { RunningState, StateDelta } from "../assembler-emulator/emulator/machine_state"


/////////// amalgamate all the different event sources, and create a 
//          dispatcher type that can use them

type CommandRun = { type: "CommandRun" }
type CommandStep = { type: "CommandStep" }
type CommandReset = { type: "CommandReset" }
type CommandReloadSource = { type: "CommandReloadSource" }

export type ToggleSetBreakpoint = { type: "ToggleSetBreakpoint", address: number }
export type StateUpdated = { type: "StateUpdated", deltas: StateDelta }
export type NewCodeLoaded = { type: "NewCodeLoaded", assembled: SourceCode, deltas: StateDelta }

type LocalEvent = CommandRun | CommandStep | CommandReset | CommandReloadSource | StateUpdated | NewCodeLoaded | ToggleSetBreakpoint

type PlaygroundEvent = LocalEvent | AssemblyEvent | EmulatorEvent | NumberEvent

export class Dispatcher extends BaseDispatcher<PlaygroundEvent> { }


/////////// Handle the emulator start/stop stuff



export class Playground {

  private editor_panel: EditorPanel

  el: HTMLElement
  dispatcher: Dispatcher
  emulator: Emulator

  constructor(private defaultSource: string) {
    this.dispatcher = new Dispatcher()
    this.emulator = new Emulator(this.dispatcher)    

    this.dispatcher.register("AssemblyDone", (ev: AssemblyDone) => {
      const deltas = this.emulator.loadAssembledCode(ev.assembled)
      console.log("assembly done, deltas", deltas)
      this.dispatcher.dispatch({
        type: "StateUpdated",
        deltas: deltas,
      })
      this.dispatcher.dispatch({
        type: "NewCodeLoaded",
        deltas: deltas,
        assembled: ev.assembled,
      })
    })

    this.dispatcher.register("CommandStep",  () => this.step())
    this.dispatcher.register("CommandRun",   () => this.run())
    this.dispatcher.register("CommandReset", () => this.reset())
    this.dispatcher.register("CommandReloadSource", () => this.reloadSource())

    this.el = el(".playground.visible") 
    this.editor_panel = new EditorPanel(this.dispatcher, this.defaultSource)
    setChildren(this.el,       [
      FrontPanel(this.dispatcher),
      FailMessagePanel(this.dispatcher),
        this.editor_panel 
      ])
  }


  step() {
    const deltas = this.emulator.step()
    this.dispatcher.dispatch({
      type: "StateUpdated",
      deltas: deltas,
    })
    return deltas
  }

  run() {
    let deltas: StateDelta
    do 
      deltas = this.step()
    while (this.continueRunning(deltas))
  }

  reset() {
    this.editor_panel.assemble_source(this.editor_panel.source)
  }

  reloadSource() {
    this.editor_panel.revert_to_original_source()
  }

  continueRunning(state: StateDelta) {
    if (state.running_state !== RunningState.Paused)
      return false

    if (this.editor_panel.breakpointSetAt(state.register_delta.get(7))) {
      return false
    }
    return true
  }

}
