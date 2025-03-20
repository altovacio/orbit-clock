import React, { useState, useEffect } from 'react';

interface PianoKeysProps {
  rootNote: string;
  scaleType: string;
  onNoteChange: (note: string) => void;
}

// Note positions (C to B)
const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const OCTAVES = [3, 4, 5];

// Scale patterns (semitone intervals from root)
const SCALE_PATTERNS = {
  majorPentatonic: [0, 2, 4, 7, 9],
  minorPentatonic: [0, 3, 5, 7, 10],
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  blues: [0, 3, 5, 6, 7, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

export default function PianoKeys({ rootNote, scaleType, onNoteChange }: PianoKeysProps) {
  const [currentNote, setCurrentNote] = useState('C');
  const [currentOctave, setCurrentOctave] = useState(4);

  useEffect(() => {
    const [note = 'C', octave = '4'] = rootNote.split(/(\d+)/);
    setCurrentNote(note);
    setCurrentOctave(parseInt(octave));
  }, [rootNote]);

  const handleNoteChange = (note: string) => {
    onNoteChange(`${note}${currentOctave}`);
  };

  const handleOctaveChange = (octave: number) => {
    setCurrentOctave(octave);
    onNoteChange(`${currentNote}${octave}`);
  };

  // Calculate which notes are in the scale
  const rootIndex = ALL_NOTES.indexOf(currentNote);
  const pattern = SCALE_PATTERNS[scaleType as keyof typeof SCALE_PATTERNS] || [];
  const scaleNotes = pattern.map(interval => 
    ALL_NOTES[(rootIndex + interval) % 12]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <select 
          value={currentNote}
          onChange={(e) => handleNoteChange(e.target.value)}
          className="bg-background border rounded-md p-2"
        >
          {ALL_NOTES.map(note => (
            <option key={note} value={note}>{note}</option>
          ))}
        </select>
        
        <select
          value={currentOctave}
          onChange={(e) => handleOctaveChange(Number(e.target.value))}
          className="bg-background border rounded-md p-2"
        >
          {OCTAVES.map(octave => (
            <option key={octave} value={octave}>Octave {octave}</option>
          ))}
        </select>
      </div>
      
      <svg
        viewBox="0 0 350 100"
        className="w-full h-24 my-4"
      >
        {/* White keys */}
        {WHITE_NOTES.map((note, i) => {
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

          // Calculate black key position based on the previous white key
          const prevWhiteKeyIndex = WHITE_NOTES.indexOf(ALL_NOTES[i - 1]);
          if (prevWhiteKeyIndex === -1) return null;

          const x = (prevWhiteKeyIndex * 50) + 35;
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

        {/* Note labels on white keys */}
        {WHITE_NOTES.map((note, i) => {
          const x = i * 50 + 24;
          return (
            <text
              key={`label-${note}`}
              x={x}
              y={90}
              textAnchor="middle"
              fill="black"
              fontSize="12"
            >
              {note}
            </text>
          );
        })}
      </svg>
    </div>
  );
}