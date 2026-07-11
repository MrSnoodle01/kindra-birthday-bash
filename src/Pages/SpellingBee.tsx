import { useState } from "react";
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
}

export default function SpellingBee() {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);

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

    return (
        <div className="page">

            <div className="wordContainer">

                {currentWord ? (
                    <>
                        <h1>{currentWord.word}</h1>

                        <p>Definition: {currentWord.definition}</p>
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

        </div>
    );
}