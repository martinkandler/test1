
import React, { useEffect, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Download, FileText, FolderArchive } from 'lucide-react';
import {
  db,
  type Project,
  type Building,
  type Part,
  type Photo,
  type ConstructionDocument
} from './db';
import {
  newA4Page,
  exportA4Canvases,
  drawContained,
  PAGE_WIDTH
} from './printLayout';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const ink = '#172c40';

function textPage(title: string, lines: string[]) {
  const { canvas, ctx } = newA4Page();

  ctx.fillStyle = ink;
  ctx.font = 'bold 40px Arial';
  ctx.fillText(title, 64, 270, PAGE_WIDTH - 128);

  ctx.font = '23px Arial';

  let y = 335;

  for (const line of lines) {
    if (y > 1570) break;

    ctx.fillText(
      line.slice(0, 90),
      64,
      y,
      PAGE_WIDTH - 128
    );

    y += 43;
  }

  return canvas;
}

async function imagePage(blob: Blob, caption: string) {
  const { canvas, ctx } = newA4Page();
  const url = URL.createObjectURL(blob);

  try {
    const img = new Image();
    img.src = url;

    await img.decode();

    drawContained(
      ctx,
      img,
      img.naturalWidth,
      img.naturalHeight,
      250,
      1510
    );
  } finally {
    URL.revokeObjectURL(url);
  }

  ctx.fillStyle = ink;
  ctx.font = '22px Arial';

  ctx.fillText(
    caption.slice(0, 90),
    64,
    1590,
    PAGE_WIDTH - 128
  );

  return canvas;
}

async function documentPages(doc: ConstructionDocument) {
  const blob = doc.original;

  if (
    doc.mime === 'application/pdf' ||
    doc.name.toLowerCase().endsWith('.pdf')
  ) {
    const task = pdfjs.getDocument({
      data: new Uint8Array(await blob.arrayBuffer())
    });

    try {
      const pdf = await task.promise;
      const result: HTMLCanvasElement[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const pg = await pdf.getPage(i);
        const vp = pg.getViewport({ scale: 1.25 });

        const source = document.createElement('canvas');

        source.width = Math.ceil(vp.width);
        source.height = Math.ceil(vp.height);

        const context = source.getContext('2d');

        if (!context) {
          throw new Error(
            'Canvas-Kontext konnte nicht erstellt werden.'
          );
        }

        // Korrektur für die verwendete pdfjs-dist-Version:
        // Die Eigenschaft "canvas" wird hier nicht unterstützt.
        await pg.render({
          canvasContext: context,
          viewport: vp
        }).promise;

        const { canvas, ctx } = newA4Page();

        drawContained(
          ctx,
          source,
          source.width,
          source.height,
          190,
          1630
        );

        result.push(canvas);
      }

      return result;
    } finally {
      await task.destroy();
    }
  }

  if (doc.mime.startsWith('image/')) {
    return [await imagePage(blob, doc.name)];
  }

  return [
    textPage('Anlage: ' + doc.name, [
      'Originaldatei ist kein direkt druckbares PDF oder Bild.',
      'Dateityp: ' + doc.mime,
      'Bitte Originaldatei separat aufbewahren.'
    ])
  ];
}

export default function DocumentationExport({
  project,
  buildings,
  parts
}: {
  project: Project;
  buildings: Building[];
  parts: Part[];
}) {
  const [scope, setScope] = useState('project');
  const [target, setTarget] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [documents, setDocuments] = useState<
    ConstructionDocument[]
  >([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      db.photos
        .where('projectId')
        .equals(project.id)
        .toArray(),

      db.documents
        .where('projectId')
        .equals(project.id)
        .toArray()
    ]).then(([p, d]) => {
      setPhotos(p);
      setDocuments(d);
    });
  }, [project.id]);

  const selectedParts =
    scope === 'part'
      ? parts.filter(p => p.id === target)
      : scope === 'building'
        ? parts.filter(p => p.buildingId === target)
        : parts;

  const selectedBuildingIds =
    scope === 'building'
      ? [target]
      : scope === 'part'
        ? [parts.find(p => p.id === target)?.buildingId || '']
        : buildings.map(b => b.id);

  const chosenPhotos = photos.filter(
    p =>
      selectedParts.some(part => part.id === p.partId) ||
      (
        scope !== 'part' &&
        selectedBuildingIds.includes(p.buildingId || '')
      )
  );

  const chosenDocs = documents.filter(
    d =>
      selectedParts.some(
        p =>
          d.partId === p.id ||
          d.partIds?.includes(p.id)
      ) ||
      (
        scope !== 'part' &&
        selectedBuildingIds.includes(d.buildingId || '')
      )
  );

  const exportPdf = async () => {
    if (busy) return;

    setBusy(true);
    setMessage('Dokumentation wird zusammengestellt …');

    try {
      const name =
        scope === 'project'
          ? project.name
          : scope === 'building'
            ? buildings.find(b => b.id === target)?.name ||
              'Bauwerk'
            : parts.find(p => p.id === target)?.name ||
              'Bauteil';

      const pages: HTMLCanvasElement[] = [];

      pages.push(
        textPage('Bauakte – ' + name, [
          project.name,
          'Sächsische Bau GmbH',
          `Erstellt: ${new Date().toLocaleDateString('de-DE')}`,
          `${selectedParts.length} Bauteile · ${chosenPhotos.length} Fotos · ${chosenDocs.length} Dokumente`
        ])
      );

      const toc = [
        '1. Bauteilübersicht',
        '2. Fotodokumentation',
        '3. Qualitätsnachweise',
        ...selectedParts.map(
          p =>
            '    ' +
            (p.shortName || p.number || '') +
            ' ' +
            p.name
        )
      ];

      for (let i = 0; i < toc.length; i += 27) {
        pages.push(
          textPage(
            i === 0
              ? 'Inhaltsverzeichnis'
              : 'Inhaltsverzeichnis (Fortsetzung)',
            toc.slice(i, i + 27)
          )
        );
      }

      for (let i = 0; i < selectedParts.length; i += 25) {
        pages.push(
          textPage(
            'Bauteilübersicht',
            selectedParts
              .slice(i, i + 25)
              .map(
                p =>
                  (p.shortName || p.number || '–') +
                  ' – ' +
                  p.name
              )
          )
        );
      }

      for (let i = 0; i < chosenPhotos.length; i++) {
        setMessage(
          `Foto ${i + 1} von ${chosenPhotos.length}`
        );

        const p = chosenPhotos[i];

        const caption = [
          p.captured,
          parts.find(part => part.id === p.partId)?.name || '',
          p.location || '',
          p.description
        ]
          .filter(Boolean)
          .join(' · ') || p.name;

        pages.push(
          await imagePage(
            p.annotation || p.original,
            caption
          )
        );
      }

      for (let i = 0; i < chosenDocs.length; i++) {
        setMessage(
          `Nachweis ${i + 1} von ${chosenDocs.length}`
        );

        pages.push(
          ...await documentPages(chosenDocs[i])
        );
      }

      await exportA4Canvases(
        pages,
        'Bauakte – ' + name,
        `SBauAkte_${name.replace(
          /[^a-zA-Z0-9äöüÄÖÜ_-]/g,
          '_'
        )}.pdf`
      );

      setMessage(`${pages.length} Seiten exportiert.`);
    } catch (e) {
      setMessage(
        'Export fehlgeschlagen: ' + String(e)
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <h2>
        <FolderArchive size={22} />
        Gesamtdokumentation
      </h2>

      <p>
        Deckblatt, Inhaltsverzeichnis,
        Fotodokumentation und vorhandene PDF-/Bildnachweise
        zu einem PDF zusammenstellen.
        Nicht darstellbare Originalformate werden
        als Anlage ausgewiesen.
      </p>

      <div className="structure-actions">
        <label>
          Umfang
          <select
            value={scope}
            onChange={e => {
              setScope(e.target.value);
              setTarget('');
            }}
          >
            <option value="project">
              Gesamtes Projekt
            </option>
            <option value="building">
              Bauwerk
            </option>
            <option value="part">
              Bauteil
            </option>
          </select>
        </label>

        {scope === 'building' && (
          <select
            value={target}
            onChange={e => setTarget(e.target.value)}
          >
            <option value="">
              Bauwerk auswählen
            </option>

            {buildings.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}

        {scope === 'part' && (
          <select
            value={target}
            onChange={e => setTarget(e.target.value)}
          >
            <option value="">
              Bauteil auswählen
            </option>

            {parts.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <p>
        <FileText size={16} />
        {' '}
        {selectedParts.length} Bauteile ·{' '}
        {chosenPhotos.length} Fotos ·{' '}
        {chosenDocs.length} Qualitätsnachweise
      </p>

      <button
        className="primary"
        disabled={
          busy ||
          (scope !== 'project' && !target)
        }
        onClick={() => void exportPdf()}
      >
        <Download size={17} />

        {busy
          ? 'PDF wird erzeugt …'
          : 'Dokumentation als PDF exportieren'}
      </button>

      <p role="status">{message}</p>
    </section>
  );
}
