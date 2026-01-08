import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import { useNotifications } from '../hooks/useNotifications';
import { AppTheme } from '../theme/AppTheme';
import { MaterialIcons } from '@expo/vector-icons';

interface Notification {
    id: string;
    title: string;
    body: string;
    timestamp: string;
    status: 'pending' | 'sent' | 'failed';
}

export default function NotificationListScreen() {
    const navigation = useNavigation<any>();
    const { notifications, isLoading: loading, refetch, isFetching, isError } = useNotifications();
    const [searchQuery, setSearchQuery] = useState('');

    const colorScheme = useColorScheme();
    const colors = AppTheme.getColors(colorScheme);

    const notificationListener = useRef<Notifications.Subscription>(undefined);
    const responseListener = useRef<Notifications.Subscription>(undefined);

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            // console.log('Received notification:', notification);
            refetch();
        });

        const unsubscribe = navigation.addListener('focus', () => {
            refetch();
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            // console.log('Touched notification:', response);
        });

        return () => {
            if (notificationListener.current) notificationListener.current.remove();
            if (responseListener.current) responseListener.current.remove();
            unsubscribe();
        };
    }, []);

    const handleSignOut = () => {
        signOut(auth);
    };

    // Filter notifications
    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderNotificationCard = (item: Notification) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: colors.card, borderColor: colorScheme === 'dark' ? '#374151' : '#f3f4f6' }]}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                    {/* Badge removed as per request (related to scheduling/status) */}
                </View>
                <Text style={[styles.cardBody, { color: colors.textSecondary }]} numberOfLines={2}>{item.body}</Text>

                <View style={styles.cardFooter}>
                    <View style={styles.dateContainer}>
                        <MaterialIcons name="event" size={16} color={colors.textSecondary} />
                        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                            {new Date(item.timestamp).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </Text>
                    </View>
                    {/* Detail chevron removed earlier */}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <View style={styles.topBar}>
                    <View style={styles.iconButton} />
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                    <TouchableOpacity onPress={handleSignOut} style={styles.iconButton}>
                        <MaterialIcons name="logout" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#e5e7eb', color: colors.text }]}
                        placeholder="Search notifications"
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Content */}
            {loading && !isFetching ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : isError ? (
                <View style={styles.centerContainer}>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>Something went wrong</Text>
                    <TouchableOpacity onPress={refetch} style={[styles.retryButton, { backgroundColor: colors.primary }]}>
                        <Text style={{ color: '#fff' }}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={colors.primary} />}
                >
                    {/* Render flattened list without sections */}
                    {filteredNotifications.map(renderNotificationCard)}

                    {filteredNotifications.length === 0 && (
                        <View style={styles.emptyState}>
                            <MaterialIcons name="notifications-none" size={64} color={colors.textSecondary} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notifications found</Text>
                        </View>
                    )}

                    {/* Spacing for FAB */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            )}

            {/* FAB */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                    onPress={() => navigation.navigate('CreateNotification')}
                    activeOpacity={0.9}
                >
                    <MaterialIcons name="add" size={32} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    searchContainer: {
        marginHorizontal: 16,
        marginTop: 8,
        position: 'relative',
        justifyContent: 'center',
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    searchInput: {
        height: 40,
        borderRadius: 12,
        paddingLeft: 40,
        paddingRight: 16,
        fontSize: 14,
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
    },
    cardBody: {
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginBottom: 16,
        fontSize: 16,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
});
