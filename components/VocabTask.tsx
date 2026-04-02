import { getWords, Word } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface VocabTaskProps {
  requiredCount: number;
  onComplete: () => void;
}

export default function VocabTask({
  requiredCount,
  onComplete,
}: VocabTaskProps) {
  const [solvedCount, setSolvedCount] = useState(0);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      const words = await getWords();
      setWordList(words);
      pickRandomWord(words);
    };
    loadWords();
  }, []);

  const pickRandomWord = (words: Word[]) => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
  };

  const handleSubmit = () => {
    if (!currentWord) {
      return;
    }

    const normalizedInput = userInput.trim().toLowerCase();
    const normalizedAnswer = currentWord.word.trim().toLowerCase();

    if (normalizedInput === normalizedAnswer) {
      const nextCount = solvedCount + 1;
      setIsError(false);

      if (nextCount >= requiredCount) {
        Keyboard.dismiss();
        onComplete();
      } else {
        setSolvedCount(nextCount);
        pickRandomWord(wordList);
        setUserInput("");
      }
    } else {
      setIsError(true);
      setUserInput("");
    }
  };

  if (!currentWord) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Feeling better?</Text>
      <Text style={styles.progress}>
        Solved: {solvedCount} / {requiredCount}
      </Text>

      <View style={[styles.card, isError && styles.cardError]}>
        <Text style={styles.meaningText}>"{currentWord.meaning}"</Text>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={(text) => {
            setUserInput(text);
            setIsError(false);
          }}
          placeholder="Type the word..."
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          onSubmitEditing={handleSubmit}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Check Word</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  header: {
    color: "#ff9500",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progress: { color: "#a0a0a0", fontSize: 16, marginBottom: 40 },
  card: {
    backgroundColor: "#2a2a2a",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  cardError: { borderWidth: 2, borderColor: "#ff3b30" }, // Visual feedback for wrong answers
  meaningText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    fontSize: 24,
    width: "90%",
    textAlign: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    marginTop: 40,
    backgroundColor: "#ff9500",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
});
