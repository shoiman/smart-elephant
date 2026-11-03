import { useCallback, useEffect, useRef } from "react";

import { playAudio, speakText, stopAudio } from "../../services/audioService";
import { fetchHostLineAudio } from "../../services/hostLineService";

/**
 * The host's voice outside the game: Azure audio for the lines from host_lines.json, the browser voice
 * as a fallback (Chrome has no Hebrew voice). Lines with an animal name ("Корова!") need the word,
 * so their audio is fetched once per word.
 */
export function useHostVoice(language: string) {
  /** Word ("" = lines without a word) -> line text -> audio URL */
  const audioRef = useRef(new Map<string, Promise<Record<string, string>>>());

  // Another language has other lines
  useEffect(() => {
    audioRef.current = new Map();
  }, [language]);

  // Nothing keeps talking after the page is left
  useEffect(() => () => stopAudio(), []);

  const lineAudio = useCallback(
    (word: string) => {
      let audio = audioRef.current.get(word);
      if (!audio) {
        audio = fetchHostLineAudio(language, word ? [word] : []);
        audioRef.current.set(word, audio);
      }
      return audio;
    },
    [language],
  );

  /** Says the line; word = the animal name inside it, if any. A new line cuts the previous one. */
  const say = useCallback(
    async (text: string, word = "") => {
      stopAudio();
      const url = (await lineAudio(word))[text];
      const speak = () => speakText(text, language);
      if (url) playAudio(url, speak);
      else speak();
    },
    [language, lineAudio],
  );

  return { say };
}
