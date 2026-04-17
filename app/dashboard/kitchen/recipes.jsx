import React, { useEffect, useMemo, useState } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from 'react-native'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, } from 'firebase/firestore'
import ScreenBackground from '../../../components/ScreenBackground'
import { auth, db } from '../../../lib/firebaseConfig'

const SOURCE_TYPES = [
  { label: 'PDF Save', value: 'pdf' },
  { label: 'Text Entry', value: 'text' },
]

//Formats a Firestore timestamp/date value into a readable saved date string.
const formatSavedDate = (value) => {
  if (!value) return 'Saving...'

  const date =
    typeof value?.toDate === 'function'
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

//Builds the preview text shown on each recipe card based on saved source type.
const getRecipePreviewText = (recipe) => {
  if (recipe.sourceType === 'pdf') {
    return recipe.notes || recipe.content || 'No notes added for this PDF recipe.'
  }

  if (recipe.ingredients || recipe.instructions) {
    return [recipe.ingredients, recipe.instructions].filter(Boolean).join('\n\n')
  }

  return recipe.content || 'No recipe details saved yet.'
}

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [expandedRecipeId, setExpandedRecipeId] = useState(null)
  const [title, setTitle] = useState('')
  const [sourceType, setSourceType] = useState('pdf')
  const [notes, setNotes] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const user = auth.currentUser
  const userId = user?.uid

  //Creates a recipes query for the signed-in user ordered by most recent saves.
  const recipesQuery = useMemo(() => {
    if (!userId) return null

    return query(
      collection(db, 'users', userId, 'recipes'),
      orderBy('savedAt', 'desc')
    )
  }, [userId])

  //Subscribes to live recipe updates and keeps local state in sync with Firestore.
  useEffect(() => {
    if (!recipesQuery) {
      setRecipes([])
      setLoading(false)
      return undefined
    }

    const unsubscribe = onSnapshot(
      recipesQuery,
      (snapshot) => {
        const nextRecipes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setRecipes(nextRecipes)
        setLoading(false)
      },
      (error) => {
        console.error('Recipe listener error:', error)
        Alert.alert('Recipe Book Error', 'We could not load your saved recipes.')
        setLoading(false)
      }
    )

    return unsubscribe
  }, [recipesQuery])

  //Resets all add-recipe modal form fields back to default values.
  const resetForm = () => {
    setTitle('')
    setSourceType('pdf')
    setNotes('')
    setIngredients('')
    setInstructions('')
    setSelectedPdf(null)
  }

  //Opens the add-recipe modal if a user is signed in.
  const openAddRecipeModal = () => {
    if (!userId) {
      Alert.alert('Sign in required', 'Please sign in before saving recipes.')
      return
    }

    setIsModalVisible(true)
  }

  //Closes the add-recipe modal and clears form state unless a save is in progress.
  const closeAddRecipeModal = () => {
    if (isSaving) return

    setIsModalVisible(false)
    resetForm()
  }

  //Switches recipe input mode and clears fields that do not apply to that mode.
  const handleSourceTypeChange = (nextType) => {
    setSourceType(nextType)

    if (nextType === 'pdf') {
      setIngredients('')
      setInstructions('')
      return
    }

    setNotes('')
    setSelectedPdf(null)
  }

  //Opens the document picker and stores selected PDF metadata in form state.
  const handlePickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      })

      if (result.canceled) {
        return
      }

      const [asset] = result.assets || []

      if (!asset) {
        Alert.alert('Upload failed', 'We could not read that PDF file.')
        return
      }

      setSelectedPdf({
        name: asset.name || 'recipe.pdf',
        uri: asset.uri,
        mimeType: asset.mimeType || 'application/pdf',
        size: asset.size || null,
      })
    } catch (error) {
      console.error('Failed to pick PDF:', error)
      Alert.alert('Upload failed', 'We could not open your files right now.')
    }
  }

  //Validates form input, builds recipe payload, and saves it to Firestore.
  const handleSaveRecipe = async () => {
    const trimmedTitle = title.trim()
    const trimmedNotes = notes.trim()
    const trimmedIngredients = ingredients.trim()
    const trimmedInstructions = instructions.trim()

    if (!userId) {
      Alert.alert('Sign in required', 'Please sign in before saving recipes.')
      return
    }

    if (!trimmedTitle) {
      Alert.alert('Missing title', 'Please give your recipe a title.')
      return
    }

    if (sourceType === 'pdf') {
      if (!selectedPdf) {
        Alert.alert('Missing PDF', 'Please upload a PDF file before saving.')
        return
      }
    } else {
      if (!trimmedIngredients) {
        Alert.alert('Missing ingredients', 'Please add the ingredients before saving.')
        return
      }

      if (!trimmedInstructions) {
        Alert.alert('Missing instructions', 'Please add the instructions before saving.')
        return
      }
    }

    setIsSaving(true)

    try {
      const payload =
        sourceType === 'pdf'
          ? {
              title: trimmedTitle,
              sourceType,
              notes: trimmedNotes,
              content: trimmedNotes,
              referenceName: selectedPdf?.name || null,
              fileName: selectedPdf?.name || null,
              fileUri: selectedPdf?.uri || null,
              fileMimeType: selectedPdf?.mimeType || null,
              fileSize: selectedPdf?.size || null,
              savedAt: serverTimestamp(),
            }
          : {
              title: trimmedTitle,
              sourceType,
              ingredients: trimmedIngredients,
              instructions: trimmedInstructions,
              content: `${trimmedIngredients}\n\n${trimmedInstructions}`,
              referenceName: null,
              savedAt: serverTimestamp(),
            }

      await addDoc(collection(db, 'users', userId, 'recipes'), payload)

      setIsModalVisible(false)
      resetForm()
    } catch (error) {
      console.error('Failed to save recipe:', error)
      Alert.alert('Save failed', 'We could not save this recipe right now.')
    } finally {
      setIsSaving(false)
    }
  }

  //Renders one recipe card row with expandable preview content.
  const renderRecipe = ({ item }) => {
    const isExpanded = expandedRecipeId === item.id
    const previewText = getRecipePreviewText(item)

    return (
      <Pressable
        style={styles.recipeCard}
        onPress={() => setExpandedRecipeId(isExpanded ? null : item.id)}
      >
        <View style={styles.recipeHeader}>
          <View style={styles.recipeHeaderText}>
            <Text style={styles.recipeTitle}>{item.title || 'Untitled Recipe'}</Text>
            <Text style={styles.recipeMeta}>
              Saved {formatSavedDate(item.savedAt)} • {item.sourceType === 'pdf' ? 'PDF Save' : 'Text Entry'}
            </Text>
            {item.referenceName ? (
              <Text style={styles.recipeReference}>Source file: {item.referenceName}</Text>
            ) : null}
          </View>

          <Text style={styles.expandHint}>{isExpanded ? 'Hide' : 'Open'}</Text>
        </View>

        <Text
          style={styles.recipePreview}
          numberOfLines={isExpanded ? undefined : 3}
        >
          {previewText}
        </Text>
      </Pressable>
    )
  }

  return (
    <ScreenBackground
      imageSource={require('../../../assets/images/Gradient2.png')}
      overlay
      overlayOpacity={0.35}
      contentStyle={styles.screenContent}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Recipe Book</Text>
          <Text style={styles.subtitle}>
            Save recipes from a PDF with your own notes, or type in ingredients and instructions from scratch.
          </Text>
        </View>

        <Pressable style={styles.addButton} onPress={openAddRecipeModal}>
          <Text style={styles.addButtonText}>Add New Recipe</Text>
        </Pressable>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#f6ddd6" />
            <Text style={styles.stateText}>Loading your recipe book...</Text>
          </View>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipe}
            contentContainerStyle={[
              styles.listContent,
              recipes.length === 0 && styles.emptyListContent,
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Your recipe book is empty.</Text>
                <Text style={styles.emptyText}>
                  Add your first recipe to start building your camp kitchen collection.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeAddRecipeModal}
      >
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalKeyboardView}
          >
            <View style={styles.modalCard}>
              <ScrollView
                contentContainerStyle={styles.modalContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.modalTitle}>Add A Recipe</Text>
                <Text style={styles.modalSubtitle}>
                  Choose PDF upload or text entry, then save the recipe in the format that fits best.
                </Text>

                <Text style={styles.fieldLabel}>Save Type</Text>
                <View style={styles.sourceRow}>
                  {SOURCE_TYPES.map((option) => {
                    const isSelected = sourceType === option.value

                    return (
                      <Pressable
                        key={option.value}
                        style={[
                          styles.sourceButton,
                          isSelected && styles.sourceButtonSelected,
                        ]}
                        onPress={() => handleSourceTypeChange(option.value)}
                      >
                        <Text
                          style={[
                            styles.sourceButtonText,
                            isSelected && styles.sourceButtonTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>

                <Text style={styles.fieldLabel}>Recipe Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Campfire Chili"
                  placeholderTextColor="#998a85"
                />

                {sourceType === 'pdf' ? (
                  <>
                    <Text style={styles.fieldLabel}>PDF Upload</Text>
                    <Pressable style={styles.uploadButton} onPress={handlePickPdf}>
                      <Text style={styles.uploadButtonText}>
                        {selectedPdf ? 'Choose A Different PDF' : 'Upload PDF File'}
                      </Text>
                    </Pressable>
                    <Text style={styles.uploadHelperText}>
                      {selectedPdf
                        ? `Selected file: ${selectedPdf.name}`
                        : 'Pick a PDF from your device storage to attach to this recipe.'}
                    </Text>

                    <Text style={styles.fieldLabel}>Notes</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={notes}
                      onChangeText={setNotes}
                      placeholder="Add any notes you want to keep with this PDF recipe..."
                      placeholderTextColor="#998a85"
                      multiline
                      textAlignVertical="top"
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.fieldLabel}>Ingredients</Text>
                    <TextInput
                      style={[styles.input, styles.mediumTextArea]}
                      value={ingredients}
                      onChangeText={setIngredients}
                      placeholder="List the ingredients for this recipe..."
                      placeholderTextColor="#998a85"
                      multiline
                      textAlignVertical="top"
                    />

                    <Text style={styles.fieldLabel}>Instructions</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={instructions}
                      onChangeText={setInstructions}
                      placeholder="Type the cooking steps and directions here..."
                      placeholderTextColor="#998a85"
                      multiline
                      textAlignVertical="top"
                    />
                  </>
                )}

                <View style={styles.modalButtonRow}>
                  <Pressable
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={closeAddRecipeModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modalButton, styles.saveButton, isSaving && styles.disabledButton]}
                    onPress={handleSaveRecipe}
                    disabled={isSaving}
                  >
                    <Text style={styles.saveButtonText}>
                      {isSaving ? 'Saving...' : 'Save Recipe'}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ScreenBackground>
  )
}

export default Recipes

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 46,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    color: '#f7e7e2',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: '#524439',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    marginTop: 10,
    color: '#f2d8d1',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  addButton: {
    minHeight: 54,
    borderRadius: 20,
    backgroundColor: '#723a45',
    borderWidth: 1,
    borderColor: '#b98d84',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  addButtonText: {
    color: '#f6ddd6',
    fontSize: 16,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  recipeCard: {
    backgroundColor: 'rgba(247, 234, 228, 0.96)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#c3a39b',
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  recipeHeaderText: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4f2c31',
    marginBottom: 4,
  },
  recipeMeta: {
    fontSize: 13,
    color: '#7d625d',
  },
  recipeReference: {
    fontSize: 13,
    color: '#7d625d',
    marginTop: 2,
  },
  expandHint: {
    fontSize: 14,
    fontWeight: '700',
    color: '#723a45',
  },
  recipePreview: {
    color: '#4a2e31',
    fontSize: 15,
    lineHeight: 22,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    marginTop: 10,
    color: '#f6ddd6',
    fontSize: 15,
  },
  emptyCard: {
    backgroundColor: 'rgba(247, 234, 228, 0.92)',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c3a39b',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5d343a',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7d625d',
    fontSize: 15,
    lineHeight: 22,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 16, 18, 0.58)',
    justifyContent: 'flex-end',
  },
  modalKeyboardView: {
    width: '100%',
  },
  modalCard: {
    maxHeight: '88%',
    backgroundColor: '#f8ece7',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5d343a',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#7d625d',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5d343a',
    marginBottom: 8,
  },
  sourceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  sourceButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c8a59c',
    backgroundColor: '#fff8f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  sourceButtonSelected: {
    backgroundColor: '#723a45',
    borderColor: '#723a45',
  },
  sourceButtonText: {
    color: '#6a4a4f',
    fontWeight: '600',
  },
  sourceButtonTextSelected: {
    color: '#f8e8e2',
  },
  input: {
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#ceb1a8',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    color: '#412428',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 180,
  },
  mediumTextArea: {
    minHeight: 120,
  },
  uploadButton: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c8a59c',
    backgroundColor: '#fff8f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 14,
  },
  uploadButtonText: {
    color: '#6a4a4f',
    fontSize: 15,
    fontWeight: '700',
  },
  uploadHelperText: {
    color: '#7d625d',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  modalButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ead8d2',
  },
  cancelButtonText: {
    color: '#6a4a4f',
    fontSize: 15,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#723a45',
  },
  saveButtonText: {
    color: '#f8e8e2',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.65,
  },
})
