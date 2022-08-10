import { Dispatcher } from "../playground/playground"

export type  AssemblyDone = {
  type: "AssemblyDone",
  source: string,
  assembled: SourceCode
}

export type AssemblyEvent = AssemblyDone 


export {
  AssignmentLine,
  BlankLine, 
  CodegenLine, 
  ErrorLine, 
  LineType, 
  SourceCode, 
  SourceLine, 
} from "./shared_state/source_code" 

export type { AssembledLine } from "./shared_state/source_code" 

export { Bit, PSW } from "./shared_state/psw" 

export type { LexToken } from "./assembler/lexer"
import { Parser } from "./assembler/parser"
import { SourceCode } from "./shared_state/source_code"
export { Parser } from "./assembler/parser"

export type { AccessInfo, AccessTracker, EmulationStatus, RW } from "./emulator/machine_state"
export { MachineState, RunningState } from "./emulator/machine_state"

export { Emulator } from "./emulator/emulator"

// export { EmulatorEventTypes } from "./event_stream"
export * as Event from "./event_stream"
export type { EmulatorEvent, EmulatorEventCallback } from "./event_stream"

export function assemble(dispatcher: Dispatcher, source: string) {
  const parser = new Parser(source)
  const assembled = parser.assemble()
  dispatcher.dispatch({ type: "AssemblyDone", assembled, source })
  return assembled
}
