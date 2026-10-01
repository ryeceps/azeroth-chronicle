import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import process from 'node:process';
import ffmpegPath from 'ffmpeg-static';

const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error('Pass the generated_images directory that contains the five source contact sheets.');
if (!ffmpegPath) throw new Error('ffmpeg-static did not provide a platform binary.');

const outputDirectory = path.resolve('public/images/storylines/fallen-hero');
await mkdir(outputDirectory, { recursive: true });

const crops = [
  // 2x2 environment sheet, 1536x1024, with a broad center gutter.
  ['exec-1192c02d-840f-4931-89d4-30331d962a50.png', 'swamp-border', 744, 492, 0, 0, false],
  ['exec-1192c02d-840f-4931-89d4-30331d962a50.png', 'blasted-binding-field', 744, 492, 792, 0, false],
  ['exec-1192c02d-840f-4931-89d4-30331d962a50.png', 'serpents-coil-cave', 744, 492, 0, 532, false],
  ['exec-1192c02d-840f-4931-89d4-30331d962a50.png', 'rise-of-defiler', 744, 492, 792, 532, false],
  // 2x2 Azshara/Stranglethorn environment sheet, 1774x887.
  ['exec-71f66276-4a42-455e-b635-2dfbfed623cf.png', 'azshara-coast', 870, 430, 0, 0, false],
  ['exec-71f66276-4a42-455e-b635-2dfbfed623cf.png', 'temple-of-arkkoran', 870, 430, 902, 0, false],
  ['exec-71f66276-4a42-455e-b635-2dfbfed623cf.png', 'azsharite-peninsula', 870, 430, 0, 457, false],
  ['exec-71f66276-4a42-455e-b635-2dfbfed623cf.png', 'stranglethorn-forge-camp', 870, 430, 902, 457, false],
  // Two 3x2 alpha character sheets, each cell 512x512.
  ['exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', 'trebor-fallen-hero', 512, 512, 0, 0, true],
  ['exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', 'bengor', 512, 512, 512, 0, true],
  ['exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', 'kirith-damned', 512, 512, 1024, 0, true],
  ['exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', 'kirith-spirit', 512, 512, 0, 512, true],
  ['exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', 'loramus-thalipedes', 512, 512, 512, 512, true],
  ['exec-59217d89-deec-451b-b8c4-babfc7c71f34.png', 'lord-arkkoroc', 512, 512, 1024, 512, true],
  ['exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', 'hetaera', 512, 512, 0, 0, true],
  ['exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', 'galvan-ancient', 470, 512, 530, 0, true],
  ['exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', 'archmage-allistarj', 512, 512, 1024, 0, true],
  ['exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', 'lady-sevine', 512, 512, 0, 512, true],
  ['exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', 'grol-destroyer', 512, 512, 512, 512, true],
  ['exec-1484c7e1-0b0b-4c28-847f-bebeda8bb310.png', 'razelikh-defiler', 512, 512, 1024, 512, true],
  // Custom bounds keep the transparent ensemble and objects intact on the 1774x887 sheet.
  ['exec-1603518d-f80c-4e13-aea8-2deed1163381.png', 'bound-soldiers', 590, 430, 0, 0, true],
  ['exec-1603518d-f80c-4e13-aea8-2deed1163381.png', 'binding-stone', 300, 430, 585, 0, true],
  ['exec-1603518d-f80c-4e13-aea8-2deed1163381.png', 'warchief-orders', 460, 430, 855, 0, true],
  ['exec-1603518d-f80c-4e13-aea8-2deed1163381.png', 'shattered-amulet', 430, 430, 1344, 0, true],
  ['exec-1603518d-f80c-4e13-aea8-2deed1163381.png', 'completed-amulet', 480, 447, 0, 440, true],
  ['exec-1603518d-f80c-4e13-aea8-2deed1163381.png', 'felbane-weaponry', 430, 447, 480, 440, true],
  ['exec-1603518d-f80c-4e13-aea8-2deed1163381.png', 'severed-horn', 440, 447, 910, 440, true],
  ['exec-1603518d-f80c-4e13-aea8-2deed1163381.png', 'ward-of-defiler', 434, 447, 1340, 440, true],
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

for (const [sourceFile, name, width, height, x, y, transparent] of crops) {
  const input = path.join(sourceDirectory, sourceFile);
  const output = path.join(outputDirectory, `${name}.research.webp`);
  await runFfmpeg([
    '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
    '-vf', `crop=${width}:${height}:${x}:${y}`,
    '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6',
    ...(transparent ? ['-pix_fmt', 'yuva420p'] : []),
    output,
  ]);
}

process.stdout.write(`Cropped ${crops.length} original illustrations to ${outputDirectory}.\n`);
