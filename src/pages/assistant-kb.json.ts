import type { APIRoute } from 'astro';
import { knowledge } from '../data/knowledge';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(knowledge), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
