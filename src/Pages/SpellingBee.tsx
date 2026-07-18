import { useState, useEffect } from "react";
import words from "../data/words_complete.json";
import FloatingImages from "../components/FloatingImages";

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
    const [showImages, setShowImages] = useState(true);
    const [showRainbow, setShowRainbow] = useState(true);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        function loadVoices() {
            const availableVoices = window.speechSynthesis.getVoices();

            setVoices(availableVoices);

            if (!selectedVoice) {
                const defaultVoice =
                    availableVoices.find(v => v.name.includes("Google US English")) ||
                    availableVoices.find(v => v.name.includes("Microsoft Aria")) ||
                    availableVoices.find(v => v.lang === "en-US") ||
                    availableVoices[0];

                setSelectedVoice(defaultVoice);
            }
        }

        loadVoices();

        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, [selectedVoice]);

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
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    function shouldShowExample(word: Word) {
        if (!word.example) return false;

        const escapedWord = word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`\\b${escapedWord}\\b`, "i");

        return regex.test(word.example);
    }

    return (
        <div className={`page ${showRainbow ? "rainbow" : ""}`}>

            {showImages && <FloatingImages />}


            <div className="settingsButtons">
                <button
                    className="imageToggleButton"
                    onClick={() => setShowImages(!showImages)}
                >
                    {showImages ? "Disable Kindra" : "Enable Kindra"}
                </button>

                <button
                    className="rainbowToggleButton"
                    onClick={() => setShowRainbow(!showRainbow)}
                >
                    {showRainbow ? "Disable Rainbow" : "Enable Rainbow"}
                </button>
            </div>

            <label>
                Voice:
                <select
                    value={selectedVoice?.name || ""}
                    onChange={(e) => {
                        const voice = voices.find(
                            v => v.name === e.target.value
                        );

                        if (voice) {
                            setSelectedVoice(voice);
                        }
                    }}
                >
                    {voices.map((voice) => (
                        <option
                            key={voice.name}
                            value={voice.name}
                        >
                            {voice.name} ({voice.lang})
                        </option>
                    ))}
                </select>
            </label>

            <div className="wordContainer">
                <button onClick={() => currentWord && speakWord(currentWord.word)}>
                    🔊 Hear Word
                </button>

                {currentWord ? (
                    <>
                        <h1>{currentWord.word}</h1>

                        <p>Definition: {currentWord.definition}</p>

                        {shouldShowExample(currentWord) && (
                            <p>Example: {currentWord.example}</p>
                        )}
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