/** Literal boundary inputs verify independent selection rather than a bag/shuffle policy. */
import {it,expect} from 'vitest';
import {select} from '../../src/engine/random';
it('maps each index and allows immediate repetitions',()=>{const values=[0,0.15,0.3,0.44,0.58,0.72,0.999999];expect(values.map(value=>select(()=>value))).toEqual(['I','O','T','S','Z','J','L']);expect([select(()=>0.15),select(()=>0.15)]).toEqual(['O','O']);});
