import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../components/firebaseConfig";
import { Button } from "react-native-paper";

export default function Signup({ navigation }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const createAccount = async () => {
    try {
      if (password === confirmPassword) {
        let res = await createUserWithEmailAndPassword(auth, email, password);
        if (res && res.user) {
          Alert.alert("Account created successfully");
          //await signInWithEmailAndPassword(auth, email, password);
          updateProfile(auth.currentUser, {
            displayName: username
          }).then(() => {
            navigation.navigate("UserStack");
          }).catch((e) => {
            console.log(e);
          })
        }
      } else {
        setError("Passwords don't match.");
      }
    } catch (e) {
      if (e.code === 'auth/invalid-email') {
        setError("Invalid email address.");
      }
      if (e.code === 'auth/weak-password') {
        setError("Password must be at least 6 characters.");
      }
      if (e.code === 'auth/email-already-in-use') {
        setError('Email address already in use.');
      }
      console.log(e);
    }
  };

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.header}>Sign up</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm password"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <Button
          mode='contained' buttonColor='salmon' style={styles.button}
          onPress={createAccount}
          disabled={!username || !email || !password || !confirmPassword}
        >Create account</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#31373e'
  },
  inner: {
    width: 240,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'salmon'
  },
  input: {
    borderWidth: 1,
    borderColor: 'salmon',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: 'white'
  },
  error: {
    marginBottom: 20,
    color: 'white',
  },
  button: {
    marginVertical: 10
  }
});