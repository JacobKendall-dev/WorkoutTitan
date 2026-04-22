#!/usr/bin/env node

// Expo's dependency validation makes a network request before startup.
// We disable that check so local development can still start when the
// Expo versions endpoint is blocked or temporarily unavailable.
process.env.EXPO_NO_DEPENDENCY_VALIDATION ??= '1';

require('expo/bin/cli');
