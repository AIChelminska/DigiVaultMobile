import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useAuthNavigation } from '../hooks/useAuthNavigation';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import { AccountScreenProps } from '../types/navigation';
import { colors } from '../config/theme';

interface MenuRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

function MenuRow({ icon, label, onPress, danger = false }: MenuRowProps) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuRowLeft}>
        <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
          <AntDesignIcon name={icon} size={18} color={danger ? '#FF4444' : colors.textPrimary} />
        </View>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      </View>
      {!danger && (
        <AntDesignIcon name="right" size={14} color={colors.textFaint} />
      )}
    </TouchableOpacity>
  );
}


export default function AccountScreen({ navigation }: AccountScreenProps) {
  const { firstName, lastName, isAuthenticated } = useCurrentUser();
  const { onCartPress, onNotificationsPress } = useAuthNavigation(navigation);
  const queryClient = useQueryClient();

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || '—';

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            queryClient.clear();
            navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Home' }] });
          },
        },
      ],
    );
  };

  if (!isAuthenticated) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Account"
          subtitle="Browse as guest"
          onNotificationsPress={onNotificationsPress}
          onCartPress={onCartPress}
          paddingBottom={24}
          alignItems="flex-start"
        />
        <EmptyState
          icon="user"
          title="Log in to your account"
          subtitle="Sign in to access your vault, wishlist, orders and seller tools."
          action={{ label: 'Log in', onPress: () => navigation.navigate('Login') }}
        />
        <TouchableOpacity
          style={styles.guestSignUpBtn}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.8}>
          <Text style={styles.guestSignUpText}>Create free account</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AppHeader
        title="Account"
        subtitle={fullName}
        onNotificationsPress={onNotificationsPress}
        onCartPress={onCartPress}
        paddingBottom={24}
        alignItems="flex-start"
      />

      <View style={styles.menuSection}>
        <MenuRow
          icon="idcard"
          label="Account details"
          onPress={() => navigation.navigate('UserProfile')}
        />
        <View style={styles.separator} />
        <MenuRow
          icon="bells"
          label="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
        <View style={styles.separator} />
        <MenuRow
          icon="shoppingcart"
          label="My orders"
          onPress={() => navigation.navigate('Orders')}
        />
        <View style={styles.separator} />
        <MenuRow
          icon="edit"
          label="My courses"
          onPress={() => navigation.navigate('SellerDashboard')}
        />
      </View>

      <View style={[styles.menuSection, styles.menuSectionDanger]}>
        <MenuRow
          icon="logout"
          label="Log out"
          onPress={handleLogout}
          danger
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuSectionDanger: {
    marginTop: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconDanger: {
    backgroundColor: 'rgba(255,68,68,0.12)',
  },
  menuLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: '#FF4444',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 66,
  },
  guestSignUpBtn: {
    alignSelf: 'center',
    marginTop: -20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestSignUpText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
