export interface Atom {
  x: number;
  y: number;
  z: number;
  element: string;
}

export interface Bond {
  beginAtom: number;
  endAtom: number;
  bondType: number;
}

export interface Compound {
  properties: {
    AtomArray: Atom[];
    BondArray: Bond[];
  };
}

export function createCompound(): Compound {
  return {
    properties: {
      AtomArray: [],
      BondArray: []
    }
  };
}
