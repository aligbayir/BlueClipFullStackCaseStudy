import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '../hooks/useNotifications';
import { MaterialIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

export default function CreateNotificationScreen({ navigation }: any) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const { createNotification, isCreating: isLoading } = useNotifications();

    const colorScheme = useColorScheme();
    const colors = AppTheme.getColors(colorScheme);

    const handleSubmit = async () => {
        if (!title || !body) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            await createNotification({ title, body }).unwrap();
            Alert.alert('Success', 'Notification created!');
            navigation.goBack();
        } catch (error: any) {
            const message = error.data?.message || 'Failed to create notification';
            Alert.alert('Error', Array.isArray(message) ? message.join('\n') : message);
            // console.error(error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Create Notification</Text>
                <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={styles.iconButton}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <View style={[styles.checkButton, { backgroundColor: 'transparent' }]}>
                            <MaterialIcons name="check" size={24} color={colors.primary} />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Notification Title */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Notification Title</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                        placeholder="Enter a catchy title"
                        placeholderTextColor={colors.textSecondary}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Notification Body */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Notification Body</Text>
                    <TextInput
                        style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                        placeholder="Write your message here..."
                        placeholderTextColor={colors.textSecondary}
                        value={body}
                        onChangeText={setBody}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.createButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    <MaterialIcons name="send" size={20} color="#fff" />
                    <Text style={styles.createButtonText}>Create Notification</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 4,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    textArea: {
        minHeight: 120,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 56,
        borderRadius: 12,
        marginTop: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
