import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E3A5F',
        tabBarInactiveTintColor: '#9AA5B1',
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '700',
          letterSpacing: 0.5,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
        },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          height: 60,
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="emprestimos" options={{ title: 'Empréstimos' }} />
    </Tabs>
  );
}