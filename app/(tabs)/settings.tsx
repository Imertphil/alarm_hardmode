import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getSettings,
  getWords,
  saveSettings,
  saveWords,
  UserSettings,
  Word,
} from "../../utils/storage";

export default function SettingsScreen() {
  const [settings, setSettings] = useState<UserSettings>({
    defaultMathCount: 3,
    defaultVocabCount: 3,
  });

  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const loadedSettings = await getSettings();
      const loadedWords = await getWords();
      setSettings(loadedSettings);
      setWords(loadedWords);
    };
    loadData();
  }, []);

  const updateSetting = async (key: keyof UserSettings, value: string) => {
    const numValue = parseInt(value, 10);
    const validValue = isNaN(numValue) || numValue < 1 ? 1 : numValue;

    const newSettings = { ...settings, [key]: validValue };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleAddWord = async () => {
    if (!newWord.trim() || !newMeaning.trim()) {
      Alert.alert("Error", "Please fill in both the word and its meaning.");
      return;
    }

    const newWordObj: Word = {
      id: Date.now().toString(),
      word: newWord.trim(),
      meaning: newMeaning.trim(),
    };

    const updatedWords = [newWordObj, ...words];
    setWords(updatedWords);
    await saveWords(updatedWords);

    setNewWord("");
    setNewMeaning("");
  };

  const handleDeleteWord = async (id: string) => {
    const updatedWords = words.filter((word: Word) => word.id != id);
    setWords(updatedWords);
    await saveWords(updatedWords);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Task Counts</Text>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Math Problems</Text>
            <TextInput
              style={styles.numberInput}
              value={settings.defaultMathCount.toString()}
              onChangeText={(text) => updateSetting("defaultMathCount", text)}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Vocab Words</Text>
            <TextInput
              style={styles.numberInput}
              value={settings.defaultVocabCount.toString()}
              onChangeText={(text) => updateSetting("defaultVocabCount", text)}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Vocabulary</Text>

            <View style={styles.addWordBox}>
              <TextInput
                style={styles.textInput}
                value={newWord}
                onChangeText={setNewWord}
                placeholder="Word (e.g. Tenacious)"
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.textInput}
                value={newMeaning}
                onChangeText={setNewMeaning}
                placeholder="Meaning (e.g. Not easily stopped)"
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddWord}
              >
                <Text style={styles.addButtonText}>Save Word</Text>
              </TouchableOpacity>
            </View>

            {words.map((item) => (
              <View key={item.id} style={styles.wordItem}>
                <View style={styles.wordTextContainer}>
                  <Text style={styles.wordTitle}>{item.word}</Text>
                  <Text style={styles.wordMeaning}>{item.meaning}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteWord(item.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a" },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  headerTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  section: { marginBottom: 40 },
  sectionTitle: {
    color: "#ff9500",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textTransform: "uppercase",
  },

  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: { color: "#ffffff", fontSize: 16 },
  numberInput: {
    color: "#ff9500",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: "hidden",
  },

  addWordBox: {
    backgroundColor: "#2a2a2a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#ff9500",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },

  wordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  wordTextContainer: { flex: 1, paddingRight: 10 },
  wordTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  wordMeaning: { color: "#a0a0a0", fontSize: 14 },
  deleteText: { color: "#ff3b30", fontSize: 14, fontWeight: "600" },
});
