import { cn } from '../utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
  });

  it('overrides tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles arrays', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('handles null and undefined', () => {
    expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('merges complex class combinations', () => {
    expect(cn(
      'bg-slate-900',
      'hover:bg-slate-800',
      'text-white',
      false && 'hidden',
      'px-4 py-2'
    )).toBe('bg-slate-900 hover:bg-slate-800 text-white px-4 py-2');
  });
}); 