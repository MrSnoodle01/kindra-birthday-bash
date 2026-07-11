import { useState, useEffect } from "react";
import words from "../data/words_complete.json";

type Difficulty =
    | "Very Easy"
    | "Easy"
    | "Medium"
    | "Hard"
    | "Very Hard";

interface Word {
    word: string;
    difficulty: Difficulty;
    definition: string;
    example: string
}

export default function SpellingBee() {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        function loadVoices() {
            setVoices(window.speechSynthesis.getVoices());
        }

        loadVoices();

        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    function getRandomWord(difficulty: Difficulty) {
        const filtered = (words as Word[]).filter(
            (word) => word.difficulty === difficulty
        );

        console.log(filtered);

        if (filtered.length === 0) {
            setCurrentWord(null);
            return;
        }

        const random =
            filtered[Math.floor(Math.random() * filtered.length)];

        setCurrentWord(random);
    }

    function speakWord(word: string) {
        const utterance = new SpeechSynthesisUtterance(word);

        utterance.lang = "en-US";
        utterance.rate = 0.8;

        // Prefer a natural English voice if available
        const preferredVoice =
            voices.find(v => v.name.includes("Google US English")) ||
            voices.find(v => v.name.includes("Microsoft Aria")) ||
            voices.find(v => v.name.includes("Alex")) ||
            voices.find(v => v.lang === "en-US");

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    return (
        <div className="page">

            <div className="wordContainer">
                <button onClick={() => currentWord && speakWord(currentWord.word)}>
                    🔊 Hear Word
                </button>

                {currentWord ? (
                    <>
                        <h1>{currentWord.word}</h1>

                        <p>Definition: {currentWord.definition}</p>

                        <p>Example: {currentWord.example}</p>
                    </>
                ) : (
                    <h2>Select a difficulty</h2>
                )}

            </div>

            <div className="buttonBar">

                <button
                    onClick={() => getRandomWord("Very Easy")}
                >
                    Very Easy
                </button>

                <button
                    onClick={() => getRandomWord("Easy")}
                >
                    Easy
                </button>

                <button
                    onClick={() => getRandomWord("Medium")}
                >
                    Medium
                </button>

                <button
                    onClick={() => getRandomWord("Hard")}
                >
                    Hard
                </button>

                <button
                    onClick={() => getRandomWord("Very Hard")}
                >
                    Very Hard
                </button>

            </div>

        </div >
    );
}