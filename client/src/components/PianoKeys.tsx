import React from 'react';

interface PianoKeysProps {
  rootNote: string;
  scaleType: string;
}

// Note positions (C to B)
const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Scale patterns (semitone intervals from root)
const SCALE_PATTERNS = {
  majorPentatonic: [0, 2, 4, 7, 9],  // C D E G A
  major: [0, 2, 4, 5, 7, 9, 11],     // C D E F G A B
  naturalMinor: [0, 2, 3, 5, 7, 8, 10], // C D Eb F G Ab Bb
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

export default function PianoKeys({ rootNote, scaleType }: PianoKeysProps) {
  // Calculate which notes are in the scale
  const rootIndex = ALL_NOTES.indexOf(rootNote);
  const pattern = SCALE_PATTERNS[scaleType as keyof typeof SCALE_PATTERNS] || [];

  // Generate the actual notes in the scale
  const scaleNotes = pattern.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return ALL_NOTES[noteIndex];
  });

  return (
    <svg
      viewBox="0 0 350 100"
      className="w-full h-24 my-4"
    >
      {/* White keys */}
      {ALL_NOTES.filter(note => !note.includes('#')).map((note, i) => {
        const x = i * 50;
        const isInScale = scaleNotes.includes(note);
        return (
          <rect
            key={note}
            x={x}
            y={0}
            width={48}
            height={98}
            fill={isInScale ? "#4a9eff" : "white"}
            stroke="black"
            strokeWidth={1}
          />
        );
      })}

      {/* Black keys */}
      {ALL_NOTES.map((note, i) => {
        if (!note.includes('#')) return null;
        const x = (Math.floor(i / 2) * 50) + 35;
        const isInScale = scaleNotes.includes(note);
        return (
          <rect
            key={note}
            x={x}
            y={0}
            width={30}
            height={60}
            fill={isInScale ? "#2563eb" : "black"}
          />
        );
      })}

      {/* Note labels */}
      {ALL_NOTES.map((note, i) => {
        if (note.includes('#')) return null;
        const x = i * 50 + 24;
        const isInScale = scaleNotes.includes(note);
        return (
          <text
            key={`label-${note}`}
            x={x}
            y={90}
            textAnchor="middle"
            fill={isInScale ? "#1e40af" : "black"}
            fontSize="12"
            fontWeight={isInScale ? "bold" : "normal"}
          >
            {note}
          </text>
        );
      })}
    </svg>
  );
}