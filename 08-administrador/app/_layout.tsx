import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { CORES } from '../constants/cores';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#A5B4FC',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '700',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
        },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Platform.OS === 'ios' ? 28 : 16,
          height: 64,
          borderRadius: 24,
          backgroundColor: CORES.escura,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        },
        sceneStyle: { backgroundColor: CORES.fundo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="livros" options={{ title: 'Livros' }} />
      <Tabs.Screen name="cadastro" options={{ href: null }} />
      <Tabs.Screen name="editar" options={{ href: null }} />
    </Tabs>
  );
}