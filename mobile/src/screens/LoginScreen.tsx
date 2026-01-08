import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, useColorScheme, ScrollView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const colorScheme = useColorScheme();
    const colors = AppTheme.getColors(colorScheme);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={[styles.mainContainer]}>

                    {/* Header Image Section */}
                    <View style={styles.header}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
                            <MaterialIcons name="notifications-active" size={48} color={colors.primary} />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your notifications with ease</Text>
                    </View>

                    {/* Input Fields Container */}
                    <View style={styles.form}>
                        {/* Email Field */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                                placeholder="example@email.com"
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
                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={[styles.linkText, { color: colors.primary }]}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={[styles.signInButton, { backgroundColor: colors.primary }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.primaryText} />
                        ) : (
                            <Text style={[styles.buttonText, { color: colors.primaryText }]}>Sign In</Text>
                        )}
                    </TouchableOpacity>


                    {/* Sign Up Link */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={[styles.footerLink, { color: colors.primary }]}>Sign Up</Text>
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    mainContainer: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    header: {
        alignItems: 'center',
        paddingTop: 48,
        paddingBottom: 24,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
    },
    form: {
        paddingVertical: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
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
    forgotPassword: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    linkText: {
        fontSize: 14,
        fontWeight: '500',
    },
    signInButton: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
    },
    socialText: {
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
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
