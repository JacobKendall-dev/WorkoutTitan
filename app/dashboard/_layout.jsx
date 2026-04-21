import { Stack } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { onChallengeEvent } from '../../utils/challengeEvents';
import { View, Text, StyleSheet } from "react-native";

export default function DashboardLayout() {
const [toast, setToast] = useState(null);

  const queueRef = useRef([]);

  useEffect(() => {
    let showing = false;

    const unsub = onChallengeEvent("CHALLENGE_COMPLETED", (data) => {
      queueRef.current.push(data);

      if (showing) return;

      const showNext = () => {
        const next = queueRef.current.shift();
        if (!next) {
          showing = false;
          return;
        }

        showing = true;
        setToast(next);

        setTimeout(() => {
          setToast(null);
          showNext();
        }, 2500);
      };

      showNext();
    });

    return unsub;
  }, []);

return (
  <View style={{ flex: 1 }}>
    <Stack screenOptions={{ headerShown: true }} />

    {toast && (
      <View pointerEvents="none" style={styles.toast}>
        <View>
          <Text style={styles.text}>
            💪 {toast.name}
          </Text>

          <Text style={{ color: "#ccc", fontSize: 11 }}>
            {toast.exercise} • {toast.tier}
          </Text>
        </View>
      </View>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  toast: {
  position: "absolute",
  top: 60,
  right: 15,
  backgroundColor: "rgba(0,0,0,0.85)",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 10,

  zIndex: 9999,
  elevation: 9999, // Android fix

  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 6,
},
  text: {
    color: "white",
    fontSize: 12,
  },
});