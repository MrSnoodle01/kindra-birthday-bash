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

const sleepyImages = [
    "/sleepy/20250419_185238.jpg",
    "/sleepy/IMG_1106.jpg",
    "/sleepy/IMG_1310.jpg",
    "/sleepy/IMG_1524.jpg",
    "/sleepy/IMG_2660.jpg",
    "/sleepy/IMG_4159.jpg",
    "/sleepy/IMG_4302.jpg",
    "/sleepy/IMG_5133.jpg",
    "/sleepy/IMG_6448.jpg",
    "/sleepy/IMG_6581.jpg",
    "/sleepy/IMG_8277.jpg",
    "/sleepy/IMG_8330.jpg",
    "/sleepy/IMG_8445.jpg",
    "/sleepy/IMG_8446.jpg",
    "/sleepy/IMG_8563.jpg",
    "/sleepy/IMG_9998.jpg",
]

export default function SpellingBee() {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const [imageSettings] = useState(() =>
        sleepyImages.map(() => ({
            top: Math.random() * 90,
            left: Math.random() * 90,
            duration: 8 + Math.random() * 10,
            delay: Math.random() * 5,
        }))
    );

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

            <div className="backgroundImages">
                {sleepyImages.map((image, index) => (
                    <img
                        key={image}
                        className="floatingImage"
                        src={image}
                        style={{
                            top: `${imageSettings[index].top}%`,
                            animationDuration: `${imageSettings[index].duration}s`,
                            animationDelay: `${imageSettings[index].delay}s`,
                        }}
                    />
                ))}
            </div>

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