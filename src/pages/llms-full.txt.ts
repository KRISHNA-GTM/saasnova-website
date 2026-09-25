import type { APIRoute } from 'astro';
import { knowledgeAsText } from '../data/knowledge';

export const GET: APIRoute = () =>
  new Response(knowledgeAsText(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
