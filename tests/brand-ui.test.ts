import { describe, expect, it } from 'vitest';
import { createTranslator } from 'next-intl';
import en from '../messages/en.json';
import pl from '../messages/pl.json';
import ru from '../messages/ru.json';
import uk from '../messages/uk.json';
import { readFileSync } from 'node:fs';

describe('Public editorial interface', () => {
  const keys = Object.keys(en.BrandUI).sort();
  for (const [locale, messages] of Object.entries({ en, pl, ru, uk })) {
    it(`has complete, usable ${locale} interface translations`, () => {
      expect(Object.keys(messages.BrandUI).sort()).toEqual(keys);
      const translate = createTranslator({ locale, messages, namespace: 'BrandUI' });
      for (const key of keys) {
        const text = translate(key as keyof typeof en.BrandUI);
        expect(text.trim().length).toBeGreaterThan(0);
        expect(text).not.toContain('BrandUI.');
      }
    });
  }
  it('ships the editorial visual locally without scripts or external resources', () => {
    const image = readFileSync(new URL('../public/brand/editorial-manicure.svg', import.meta.url), 'utf8');
    expect(image).toContain('data:image/webp;base64,');
    expect(image).not.toMatch(/<script|onload=|href="https?:/i);
  });
});
