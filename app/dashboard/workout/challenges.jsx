import { View, FlatList, Image, Dimensions, StyleSheet, Pressable, Text, Modal, ScrollView } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../../data/challenges.js'
import { useWorkouts } from '../../../hooks/useWorkouts'
import {getProgress, checkChallenge} from '../../../utils/challengeEngine.js'

// Main Challenges screen
const Challenges = () => {

  // UI state (filters + selected item)
  const [selectedCategory, setSelectedCategory] = useState('Weightlifting')
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [selectedChallenge, setSelectedChallenge] = useState(null)

  // Grid layout calculation
  const { width } = Dimensions.get('window')
  const numColumns = 3;
  const spacing = 10;
  const imageWidth = (width - spacing * (numColumns + 1)) / numColumns;

  // Live workout data
  const { exercises } = useWorkouts()

  // Optional subtabs per category
  const subTabs = {
    Weightlifting: ['Upper', 'Lower'],
    Calisthenics: ['Upper', 'Lower'],
    Core: null,
    Running: null,
    Biking: null,
    Incline: null,
    StairMaster: null
  }

  // Combines static challenge data with live progress + unlock state
  const evaluateChallenge = (challenge, exercises) => {
    const rules = challenge.requirements.rules
    const firstRule = rules[0]; // current simplification (UI now supports multiple)

    if (!firstRule) return { ...challenge, progress: 0, unlocked: false };

    const progress = getProgress(firstRule, exercises);

    const unlocked = checkChallenge(
      challenge,
      exercises,
      {} // session placeholder (future use)
    )

    return {
      ...challenge,
      progress,
      unlocked,
    }
  }

  // Memoized so we only recompute when exercise data changes
  const enrichedChallenges = useMemo(() => {
    return images.map(item => evaluateChallenge(item, exercises))
  }, [exercises])

  // Category + subcategory filtering
  const filteredChallenges = enrichedChallenges.filter(item => {
    const matchesCategory = item.tab === selectedCategory
    const matchesSub =
      !selectedSubCategory || item.subTab === selectedSubCategory;

    return matchesCategory && matchesSub
  })

  const handleChallenges = (item) => {
    setSelectedChallenge(item)
  }

  return (   
    <View style={{ flex: 1, backgroundColor: 'green', padding: spacing }}>

      {/* Category Tabs */}
      <View style={{padding: 10}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>
            {['Weightlifting', 'Calisthenics', 'Core', 'Running', 'Biking', 'Incline', 'StairMaster'].map(tab => (
              <Pressable
                key={tab}
                onPress={() => {
                  setSelectedCategory(tab)
                  setSelectedSubCategory(null)
                }}
                style={{
                  padding: 15,
                  backgroundColor: selectedCategory === tab ? 'blue' : 'gray',
                  marginRight: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: 'white' }}>{tab}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Subcategory Tabs (if applicable) */}
        {subTabs[selectedCategory] && (
          <View style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' }}>
            {subTabs[selectedCategory].map(sub => (
              <Pressable
                key={sub}
                onPress={() => setSelectedSubCategory(sub)}
                style={{
                  padding: 10,
                  backgroundColor: selectedSubCategory === sub ? 'purple' : 'gray',
                  marginRight: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: 'white' }}>{sub}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Challenge Grid */}
      <FlatList
        data={filteredChallenges}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => handleChallenges(item)}>
            <Image
              // Locked vs unlocked visual
              source={item.unlocked ? item.image : item.hidden}
              style={{
                width: imageWidth,
                height: undefined,
                aspectRatio: 768 / 1024,
                marginBottom: spacing,
                marginRight: (index % numColumns) !== numColumns - 1 ? spacing : 0,
              }}
              resizeMode="contain"
            />
          </Pressable>
        )}
      />

      {/* Challenge Detail Panel */}
      {selectedChallenge && (() => {
        const rules = selectedChallenge?.requirements?.rules || [];

        return (
          <View style={{
            padding: 40,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderColor: 'black',
          }}>

            {/* Basic Info */}
            <Text style={{ fontWeight: 'bold' }}>
              {selectedChallenge.id}
            </Text>

            <Text style={{ fontWeight: 'bold' }}>
              {selectedChallenge.description}
            </Text>

            {/* Per-rule progress (multi-rule ready) */}
            {rules.map((rule, index) => {
              const progress = getProgress(rule, exercises);

              const percent = rule.target
                ? Math.min((progress / rule.target) * 100, 100)
                : 0;

              const isComplete = progress >= rule.target;

              return (
                <View key={index} style={{ marginBottom: 15 }}>
                  <Text>
                    {rule.exercise} — {progress} / {rule.target} {isComplete ? "✅" : ""}
                  </Text>

                  <View style={{
                    width: '100%',
                    height: 10,
                    backgroundColor: '#555',
                    borderRadius: 5,
                    overflow: 'hidden',
                    marginTop: 5
                  }}>
                    <View style={{
                      width: `${percent}%`,
                      height: '100%',
                      backgroundColor: '#21cc8d'
                    }} />
                  </View>
                </View>
              );
            })}

            {/* Overall challenge status */}
            <Text>
              {selectedChallenge.unlocked ? "Unlocked" : "Locked"}
            </Text>

          </View>
        );
      })()}

    </View>
  );
};

export default Challenges