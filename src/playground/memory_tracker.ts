import { Address, Value } from "../assembler-emulator/emulator/machine_state"

export class MemoryTracker {
  updateSeen: Map<Address, boolean> = new Map()
  memoryValues: Map<Address, number> = new Map()

  recordDeltas(deltas: Map<Address, Value>) {
    for (let [address, value] of deltas) {
      this.updateSeen.set(address, true)
      this.memoryValues.set(address, value)
    }
  }
  
  updatesIn(address: Address, length: number): number[] {
    let updatesSeen = false
    let i = 0
    while (i < length && !updatesSeen)
      updatesSeen = this.updateSeen.get(address + i++)

    if (!updatesSeen)
      return null

    const result: number[] = []
    for (i = 0; i < length; i++)
      result.push(this.memoryValues.get(address+i))

    this.updateSeen.clear()
    return result
  }
}


