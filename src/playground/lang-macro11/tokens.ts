import * as t from "./pdp11.terms.js"


const opcodes = {
  mov:  true, movb: true, cmp:  true, cmpb: true, bit:  true, bitb: true, bic:  true, bicb:  true, bis:  true, bisb: true,
  add:  true, sub:  true, mul:  true, div:  true, ash:  true, ashc: true, xor:  true, sob:   true, jmp:  true, swab: true,
  clr:  true, clrb: true, com:  true, comb: true, inc:  true, incb: true, dec:  true, decb:  true, neg:  true, negb: true,
  adc:  true, adcb: true, sbc:  true, sbcb: true, tst:  true, tstb: true, ror:  true, rorb:  true, rol:  true, rolb: true,
  asr:  true, asrb: true, asl:  true, aslb: true, mtps: true, mfpi: true, mfpd: true, mtpi:  true, mtpd: true, sxt:  true,
  mfps: true, jsr:  true, br:   true, bne:  true, beq:  true, bge:  true, blt:  true, bgt:   true, ble:  true, bpl:  true,
  bmi:  true, bhi:  true, blos: true, bvc:  true, bvs:  true, bcc:  true, bhis: true, bcs:   true, blo:  true, rts:  true,
  emt:  true, trap: true, halt: true, wait: true, rti:  true, bpt:  true, iot:  true, reset: true, clc:  true, clv:  true,
  clz:  true, cln:  true, sec:  true, sev:  true, sez:  true, sen:  true, scc:  true, ccc:   true, nop:  true,
}


export function opcode(name: string): number {
  let found = name.toLowerCase() in opcodes
  return found ? t.Opcode : -1
}

const RegRE = new RegExp("^(r[0-7]|sp|pc)$", "i")

export function register(name: string): number {
  return RegRE.test(name) ? t.Register : -1
}

