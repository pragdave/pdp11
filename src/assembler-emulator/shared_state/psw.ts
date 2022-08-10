export enum Bit {
  N = 0o10,
  Z = 0o04,
  V = 0o02,
  C = 0o01,
}

export class PSW {

  private _N : boolean
  private _Z : boolean
  private _V : boolean
  private _C : boolean

  constructor() {
    this._N = this._Z = this._V = this._C = false
  }

  toString() {
    return  (this._N ? `N` : `•`) +
            (this._Z ? `Z` : `•`) +
            (this._V ? `V` : `•`) +
            (this._C ? `C` : `•`)
  }

  toWord() {
    return  (this._N && Bit.N) |    
            (this._Z && Bit.Z) |
            (this._V && Bit.V) |
            (this._C && Bit.C) 
  }

  fromWord(word: number) {
    this._N = !!(word & Bit.N)
    this._Z = !!(word & Bit.Z)
    this._V = !!(word & Bit.V)
    this._C = !!(word & Bit.C)
  }

  get N()   { return this._N }
  set N(tf) { this._N = !!tf }
  
  get Z()   { return this._Z }
  set Z(tf) { this._Z = !!tf }
  
  get V()   { return this._V }
  set V(tf) { this._V = !!tf }
  
  get C()   { return this._C }
  set C(tf) { this._C = !!tf }
}


