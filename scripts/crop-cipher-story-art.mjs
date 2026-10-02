import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import process from 'node:process';
import ffmpegPath from 'ffmpeg-static';

const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error('Pass the generated_images directory containing the Cipher story source sheets.');
if (!ffmpegPath) throw new Error('ffmpeg-static did not provide a platform binary.');

const outputDirectory = path.resolve('public/images/storylines/cipher-of-damnation');
await mkdir(outputDirectory, { recursive: true });

const crops = [
  ['exec-2e8c2423-6db4-4d3a-beb9-36d16d064e49.png', 'hand-of-guldan', 768, 512, 0, 0, false],
  ['exec-2e8c2423-6db4-4d3a-beb9-36d16d064e49.png', 'oronok-farm', 768, 512, 768, 0, false],
  ['exec-2e8c2423-6db4-4d3a-beb9-36d16d064e49.png', 'coilskar-point', 768, 512, 0, 512, false],
  ['exec-2e8c2423-6db4-4d3a-beb9-36d16d064e49.png', 'illidari-point', 768, 512, 768, 512, false],
  ['exec-77a320c0-09cf-4168-8133-ef7f08e2e1dc.png', 'eclipse-point-bridge', 768, 512, 0, 0, false],
  ['exec-77a320c0-09cf-4168-8133-ef7f08e2e1dc.png', 'netherwing-fields', 768, 512, 768, 0, false],
  ['exec-77a320c0-09cf-4168-8133-ef7f08e2e1dc.png', 'altar-of-damnation', 768, 512, 0, 512, false],
  ['exec-77a320c0-09cf-4168-8133-ef7f08e2e1dc.png', 'shattrath-lower-city', 768, 512, 768, 512, false],
  ['exec-80f43ff2-32a4-4a2f-a7d1-00447194f206.png', 'shattered-plains', 1536, 1024, 0, 0, false],
  ['exec-80f43ff2-32a4-4a2f-a7d1-00447194f206.png', 'shattered-plains', 1536, 1024, 0, 0, false],
  ['exec-f14f50a4-2d2b-4050-8e40-dac066575c55.png', 'oronok-torn-heart', 384, 512, 0, 0, true, true],
  ['exec-f14f50a4-2d2b-4050-8e40-dac066575c55.png', 'gromtor-torn-heart', 384, 512, 384, 0, true, true],
  ['exec-f14f50a4-2d2b-4050-8e40-dac066575c55.png', 'artor-torn-heart', 384, 512, 768, 0, true, true],
  ['exec-f14f50a4-2d2b-4050-8e40-dac066575c55.png', 'artor-spirit', 384, 512, 1152, 0, true, true],
  ['exec-f14f50a4-2d2b-4050-8e40-dac066575c55.png', 'borak-torn-heart', 384, 512, 0, 512, true, true],
  ['exec-f14f50a4-2d2b-4050-8e40-dac066575c55.png', 'earthmender-torlok', 384, 512, 384, 512, true, true],
  ['exec-f14f50a4-2d2b-4050-8e40-dac066575c55.png', 'coilskar-commander', 384, 512, 768, 512, true, true],
  ['exec-f14f50a4-2d2b-4050-8e40-dac066575c55.png', 'painmistress-gabrissa', 384, 512, 1152, 512, true, true],
  ['exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3.png', 'veneratus-the-many', 512, 512, 0, 0, true],
  ['exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3.png', 'ruul-the-darkener', 512, 512, 512, 0, true],
  ['exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3.png', 'cyrukh-the-firelord', 512, 512, 1024, 0, true],
  ['exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3.png', 'redeemed-elemental-spirits', 512, 512, 0, 512, true],
  ['exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3.png', 'envoy-icarius', 512, 512, 512, 512, true],
  ['exec-7f190769-6743-4c7b-8907-e74f8a6ea0a3.png', 'blood-lord-zarath', 512, 512, 1024, 512, true],
  ['exec-cd303156-8a95-4cda-857b-43de362d0b53.png', 'cipher-reassembled', 640, 583, 672, 0, true],
  ['exec-cd303156-8a95-4cda-857b-43de362d0b53.png', 'bloodthistle-bundle', 640, 583, 0, 616, true],
  ['exec-cd303156-8a95-4cda-857b-43de362d0b53.png', 'stormrage-missive', 640, 583, 672, 616, true],
  ['exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f.png', 'tormented-elemental-spirits', 384, 512, 0, 0, true, true],
  ['exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f.png', 'totem-of-spirits', 384, 512, 384, 0, true, true],
  ['exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f.png', 'domesticated-felboars', 384, 512, 768, 0, true, true],
  ['exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f.png', 'ravenous-flayer-eggs', 384, 512, 1152, 0, true, true],
  ['exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f.png', 'lohngoron-bow', 384, 512, 0, 512, true, true],
  ['exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f.png', 'rotten-arakkoa-egg', 384, 512, 384, 512, true, true],
  ['exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f.png', 'tobias-filth-gorger', 384, 512, 768, 512, true, true],
  ['exec-68a73854-d5f3-4449-a6ce-5733cbe33c7f.png', 'eclipsion-disguise', 384, 512, 1152, 512, true, true],
];

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr}`));
    });
  });
}

for (const [sourceFile, name, width, height, x, y, transparent, pad] of crops) {
  const input = path.join(sourceDirectory, sourceFile);
  const output = path.join(outputDirectory, `${name}.research.webp`);
  try {
    if ((await stat(output)).size > 0) continue;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const filters = [`crop=${width}:${height}:${x}:${y}`];
  if (pad) filters.push('pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000');
  await runFfmpeg([
    '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
    '-vf', filters.join(','),
    '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6',
    ...(transparent ? ['-pix_fmt', 'yuva420p'] : []),
    output,
  ]);
}

const guldanSource = path.join(sourceDirectory, 'exec-86712863-63c3-4057-bbbd-eb3568f3fa33.png');
const guldanOutput = path.join(outputDirectory, 'guldan-memory.research.webp');
try {
  if ((await stat(guldanOutput)).size === 0) {
    await runFfmpeg([
      '-hide_banner', '-loglevel', 'error', '-y', '-i', guldanSource,
      '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6', '-pix_fmt', 'yuva420p',
      guldanOutput,
    ]);
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  await runFfmpeg([
    '-hide_banner', '-loglevel', 'error', '-y', '-i', guldanSource,
    '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6', '-pix_fmt', 'yuva420p',
    guldanOutput,
  ]);
}

const fragmentSource = path.join(sourceDirectory, 'exec-4f4d9fa8-8078-47e5-85ec-db9023f0f8ee.png');
const fragmentOutput = path.join(outputDirectory, 'cipher-fragment.research.webp');
try {
  if ((await stat(fragmentOutput)).size === 0) {
    await runFfmpeg([
      '-hide_banner', '-loglevel', 'error', '-y', '-i', fragmentSource,
      '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6', '-pix_fmt', 'yuva420p',
      fragmentOutput,
    ]);
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  await runFfmpeg([
    '-hide_banner', '-loglevel', 'error', '-y', '-i', fragmentSource,
    '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6', '-pix_fmt', 'yuva420p',
    fragmentOutput,
  ]);
}

const ruuskSource = path.join(sourceDirectory, 'exec-66c33825-4e54-4004-a23e-037dd6b3e622.png');
const ruuskOutput = path.join(outputDirectory, 'grand-commander-ruusk.research.webp');
try {
  if ((await stat(ruuskOutput)).size === 0) {
    await runFfmpeg(['-hide_banner', '-loglevel', 'error', '-y', '-i', ruuskSource, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6', '-pix_fmt', 'yuva420p', ruuskOutput]);
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  await runFfmpeg(['-hide_banner', '-loglevel', 'error', '-y', '-i', ruuskSource, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6', '-pix_fmt', 'yuva420p', ruuskOutput]);
}

process.stdout.write(`Cropped ${crops.length + 3} original illustrations to ${outputDirectory}.\n`);
