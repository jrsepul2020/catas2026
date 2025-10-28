import { supabaseServices } from './supabaseClient';

export const Vino = supabaseServices.entities.Vino;

export const Cata = supabaseServices.entities.Cata;

// auth service:
export const User = supabaseServices.auth;