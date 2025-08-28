import { test } from '@playwright/test';
import { fullLogin } from './helpers/auth';
import * as fs from 'fs';
import * as path from 'path';

test('authenticate and save storage state', async ({ page, context }) => {
  await fullLogin(page);

  const outDir = 'storageState';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  await context.storageState({ path: path.join(outDir, 'admin.json') });
});
