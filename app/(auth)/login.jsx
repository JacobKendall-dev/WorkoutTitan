import { StyleSheet, Text, View, Pressable, TextInput, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { useUser } from '../../hooks/useUser'
import ScreenBackground from '../../components/ScreenBackground'
import { SafeAreaView } from 'react-native-safe-area-context'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { login } = useUser()
  const router = useRouter()

  const handleSubmit = async () => {
    setError(null)

    try {
      await login(email, password)
      router.replace('/dashboard')
    } catch (error) {
      if (error.message.includes('auth/user-not-found')) {
        setError('This email is not in use')
        return
      }

      if (
        error.message.includes('auth/wrong-password') ||
        error.message.includes('auth/invalid-credential') ||
        error.message.includes('auth/invalid-login-credentials')
      ) {
        setError('Email and/or password was incorrect')
        return
      }

      setError('Email and/or password was incorrect')
    }
  }

  return (
    <ScreenBackground
      imageSource={require('../../assets/images/Gradient2.png')}
      overlay
      overlayOpacity={0.34}
      contentStyle={styles.screenContent}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Pressable style={styles.container} onPress={Keyboard.dismiss}>
              <View style={styles.headerBlock}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Log in to reopen your meal plans, saved recipes, and workout tracking.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="knight@adventure.com"
                  placeholderTextColor="#998a85"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  blurOnSubmit
                  onSubmitEditing={Keyboard.dismiss}
                  onChangeText={setEmail}
                  value={email}
                />

                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#998a85"
                  returnKeyType="done"
                  blurOnSubmit
                  onSubmitEditing={Keyboard.dismiss}
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable style={styles.primaryButton} onPress={handleSubmit}>
                  <Text style={styles.primaryButtonText}>Log In</Text>
                </Pressable>

                <Link href="/register" asChild>
                  <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Create An Account Instead</Text>
                  </Pressable>
                </Link>
              </View>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  )
}

export default Login

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#fff7f2',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: '#524439',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#f4ddd6',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(247, 234, 228, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ceb1a8',
    padding: 20,
  },
  fieldLabel: {
    color: '#5d343a',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#ceb1a8',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: '#432328',
    marginBottom: 16,
  },
  error: {
    color: '#7d2f1f',
    backgroundColor: '#f7d9cb',
    borderWidth: 1,
    borderColor: '#e3b29f',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#723a45',
    borderRadius: 18,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#f7e7e2',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#ead8d2',
    borderRadius: 18,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#6a4a4f',
    fontSize: 15,
    fontWeight: '700',
  },
})

