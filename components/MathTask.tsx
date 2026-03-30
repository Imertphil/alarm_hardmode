import { generateMathProblem, MathProblem } from "@/utils/mathGenerator";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface MathTaskProps {
  requiredCount: number;
  onComplete: () => void;
}

export default function MathTask({ requiredCount, onComplete }: MathTaskProps) {
  const [solvedCount, setSolvedCount] = useState(0);
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    setProblem(generateMathProblem());
  }, []);

  const handleSubmit = () => {
    if (!problem) {
      return;
    }

    if (parseInt(userInput) === problem.answer) {
      const nextCount = solvedCount + 1;

      if (nextCount >= requiredCount) {
        Keyboard.dismiss();
        onComplete();
      } else {
        setSolvedCount(nextCount);
        setProblem(generateMathProblem());
        setUserInput("");
      }
    } else {
      setUserInput("");
    }
  };

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Feeling better?</Text>
      <Text style={styles.progress}>
        Solved: {solvedCount} / {requiredCount}
      </Text>
      <View style={styles.card}>
        <Text style={styles.mathText}>{problem.expression}</Text>
        <Text style={styles.equalSign}>=</Text>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          keyboardType="number-pad"
          placeholder="?"
          placeholderTextColor="#666"
          autoFocus={true}
          onSubmitEditing={handleSubmit}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Answer</Text>
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
    color: "#ff99500",
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
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  mathText: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "600",
    letterSpacing: 2,
  },
  equalSign: { color: "#ff9500", fontSize: 30, marginVertical: 10 },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    fontSize: 32,
    width: "60%",
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
