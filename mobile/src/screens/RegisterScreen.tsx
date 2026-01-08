import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, useColorScheme, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

export default function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    const colorScheme = useColorScheme();
    const colors = AppTheme.getColors(colorScheme);

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (!termsAccepted) {
            Alert.alert('Error', 'Please accept the Terms and Conditions');
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Full Name update removed as per request
            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('Login'); // Or navigate to main app if auto-login
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header / Top Bar */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.backButton, { backgroundColor: colorScheme === 'dark' ? colors.inputBg : '#f3f4f6' }]}
                >
                    <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.mainContainer}>

                    <Text style={[styles.title, { color: colors.text }]}>Join Notify</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Start managing your alerts effectively.</Text>

                    <View style={styles.form}>
                        {/* Email Field */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                                placeholder="name@example.com"
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password Field */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                            <View style={[styles.passwordContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                                <TextInput
                                    style={[styles.passwordInput, { color: colors.text }]}
                                    placeholder="••••••••"
                                    placeholderTextColor={colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                                    <MaterialIcons name={isPasswordVisible ? "visibility" : "visibility-off"} size={24} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password Field */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                                placeholder="••••••••"
                                placeholderTextColor={colors.textSecondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        {/* Terms Checkbox */}
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={[styles.checkbox, { borderColor: colors.border, backgroundColor: termsAccepted ? colors.primary : colors.inputBg }]}
                                onPress={() => setTermsAccepted(!termsAccepted)}
                            >
                                {termsAccepted && <MaterialIcons name="check" size={16} color={colors.primaryText} />}
                            </TouchableOpacity>
                            <Text style={[styles.checkboxLabel, { color: colors.textSecondary }]}>
                                I agree to the <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms and Conditions</Text> and <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>.
                            </Text>
                        </View>

                        {/* Create Account Button */}
                        <TouchableOpacity
                            style={[styles.createButton, { backgroundColor: colors.primary }]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.primaryText} />
                            ) : (
                                <Text style={[styles.buttonText, { color: colors.primaryText }]}>Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.footerLink, { color: colors.primary }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
    },
    mainContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        marginBottom: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        height: 56,
        borderRadius: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 15,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8,
        marginBottom: 16,
        gap: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    createButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 16,
    },
    footerText: {
        fontSize: 14,
    },
    footerLink: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
