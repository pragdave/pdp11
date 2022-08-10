import { MemoryWriteRecorder } from "../emulator/machine_state"
import { PSW } from "./psw"

const MEMORY_SIZE = 0o200000
const PSW_ADDR    = 0o177776


function octal(val: number) {
  return val.toString(8).padStart(6, `0`)
}

export class Memory {

  psw: PSW
  ram: DataView

  constructor(private recorder: MemoryWriteRecorder) {
    this.clear()
    this.psw = new PSW()
  }

  clear() {
    const bytes = new ArrayBuffer(MEMORY_SIZE) // all zeros 
    this.ram = new DataView(bytes)
  }

  getByte(addr: number): number {
    let result: number
    if (addr >= PSW_ADDR) {
      const psw = this.psw.toWord()
      if (addr & 1)
        result = (psw >> 8) & 0xff
      else
        result = psw & 0xff
    }
    else {
      result = this.ram.getUint8(addr)
    }

    return result
  }

  setByte(addr: number, value: number) {
    if (addr >= PSW_ADDR) {
      let psw = this.psw.toWord()
      if (addr & 1)
        psw = psw & 0xff | (value << 8)
      else
        psw = psw & 0xff00 | value

      this.psw.fromWord(psw)
    }

    this.ram.setUint8(addr, value)
    this.recorder.record_memory_write(addr, value)
  }

  getWord(addr: number): number {
    if (addr & 1)
      throw new Error(`word fetch from odd address (${octal(addr)})`)

    let result: number

    if (addr === PSW_ADDR)
      result = this.psw.toWord()
    else
      result = this.ram.getUint16(addr, true)

    return result
  }

  setWord(addr: number, value: number) {
    if (addr & 1)
      throw new Error(`word store from odd address (${octal(addr)})`)

    if (addr === PSW_ADDR)
      this.psw.fromWord(value)

    this.ram.setUint16(addr, value, true)
    this.recorder.record_memory_write(addr, value & 0xff)
    this.recorder.record_memory_write(addr+1, (value >> 8) & 0xff)
  }

  getByteOrWord(addr: number, count: number) {
    return count === 1 ? this.getByte(addr) : this.getWord(addr)
  }

  setByteOrWord(addr: number, value: number, count: number) {
    return count === 1 ? this.setByte(addr, value) : this.setWord(addr, value)
  }
}
