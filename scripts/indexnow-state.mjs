import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function gitOutput(args, cwd = process.cwd()) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.trim();
}

export function indexNowStatePath(name, cwd = process.cwd()) {
  return resolve(cwd, gitOutput(['rev-parse', '--git-path', name], cwd));
}

export function readIndexNowKey({ env = process.env, cwd = process.cwd() } = {}) {
  const override = env.INDEXNOW_KEY?.trim();
  if (override) return override;
  const path = indexNowStatePath('indexnow-key', cwd);
  return existsSync(path) ? readFileSync(path, 'utf8').trim() : '';
}

export function readIndexNowBaseline(cwd = process.cwd()) {
  const path = indexNowStatePath('indexnow-successful-baseline', cwd);
  return existsSync(path) ? readFileSync(path, 'utf8').trim() : '';
}

export function resolveIndexNowBaseRef({ env = process.env, cwd = process.cwd() } = {}) {
  const override = env.INDEXNOW_BASE_REF?.trim();
  const baseline = override || readIndexNowBaseline(cwd);
  if (!baseline) throw new Error('No successful IndexNow baseline is recorded. Set INDEXNOW_BASE_REF to initialize or recover deployment state.');
  return baseline;
}

export function writeIndexNowBaseline(head, cwd = process.cwd()) {
  if (!/^[0-9a-f]{40,64}$/i.test(head)) throw new Error(`Cannot record invalid IndexNow baseline: ${head}`);
  const path = indexNowStatePath('indexnow-successful-baseline', cwd);
  mkdirSync(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp-${process.pid}`;
  writeFileSync(temporaryPath, `${head}\n`, { mode: 0o600 });
  renameSync(temporaryPath, path);
}

export function currentHead(cwd = process.cwd()) {
  return gitOutput(['rev-parse', 'HEAD'], cwd);
}

export function verifyGitRef(ref, cwd = process.cwd()) {
  return gitOutput(['rev-parse', '--verify', `${ref}^{commit}`], cwd);
}

export function changedFilesBetween(baseRef, head, cwd = process.cwd()) {
  const output = gitOutput(['diff', '--name-only', `${baseRef}..${head}`], cwd);
  return output ? output.split('\n') : [];
}
