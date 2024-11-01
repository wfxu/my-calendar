import { atom } from 'jotai';

const today = new Date()
export const yearAtom = atom(today.getFullYear())
export const monthAtom = atom(today.getMonth())
export const calenderNowListAtom = atom<string[]>([])
export const freshAtom = atom(false)
