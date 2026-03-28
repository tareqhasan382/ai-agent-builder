/**
 * Generates a minimal valid PDF at public/cv.pdf for the hire challenge.
 * Replace this file with your real CV before submitting.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '..', 'public', 'cv.pdf')

const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'

const stream = `BT
/F1 16 Tf
72 740 Td
(CV placeholder for Vivasoft challenge) Tj
0 -26 Td
(Replace this file at public/cv.pdf with your real resume.) Tj
ET
`

const objects = [
  '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
  '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
  '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
  `4 0 obj\n<< /Length ${Buffer.byteLength(stream, 'binary')} >>\nstream\n${stream}endstream\nendobj\n`,
  '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
]

let pdf = header
const objStart = {}
for (let i = 0; i < objects.length; i++) {
  objStart[i + 1] = Buffer.byteLength(pdf, 'binary')
  pdf += objects[i]
}

const xrefPos = Buffer.byteLength(pdf, 'binary')
let xref = 'xref\n0 6\n0000000000 65535 f \n'
for (let n = 1; n <= 5; n++) {
  xref += `${String(objStart[n]).padStart(10, '0')} 00000 n \n`
}
pdf += xref
pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`

writeFileSync(outPath, pdf, 'binary')
console.log('Wrote', outPath)
