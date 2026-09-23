import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions, FlatList, Image, Pressable, SafeAreaView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const RED = '#ec020d';
const { width } = Dimensions.get('window');

const skills = [
  { title: 'JAVASCRIPT', eyebrow: 'JAVASCRIPT SKILL', detail: 'EXP: 3+ YRS', badge: '4.8', icon: 'JS', color: '#f7df1e', dark: true },
  { title: 'PYTHON', eyebrow: 'Python Skill', detail: 'DOC: 2500', badge: 'PRO SKILL', color: '#d60812', gradient: true },
  { title: 'JAVA', eyebrow: 'JAVA SKILL', detail: 'EXP: 3000', badge: 'PRO', color: '#e5a93c', icon: '☕' },
  { title: 'FLUTTER', eyebrow: 'FLUTTER SKILL', detail: 'EXP: 3+ YRS', badge: '4.9', color: '#0284c7', icon: '✦' },
];

const dock = [
  ['Education Skill', 'school', '#0066ff'], ['Projects', 'briefcase', '#9333ea'],
  ['Summary', 'document-text', '#06b6d4'], ['Settings', 'settings', '#64748b'],
  ['Achievement', 'trophy', '#d97706'], ['Calendar', 'calendar', '#0284c7'],
  ['Notifications', 'notifications', '#e11d48'], ['Messages', 'chatbubble', '#16a34a'],
] as const;

function Logo({ color = '#fff', small = false }: { color?: string; small?: boolean }) {
  return <Text style={[styles.logo, { color, fontSize: small ? 7 : 58, letterSpacing: small ? 0 : -5 }]}>onego</Text>;
}

function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => { const timer = setTimeout(onDone, 2000); return () => clearTimeout(timer); }, [onDone]);
  return <View style={styles.splash}><Logo /></View>;
}

function Auth({ onGuest }: { onGuest: () => void }) {
  return <View style={styles.auth}>
    <View style={styles.glowTop} /><View style={styles.glowBottom} />
    <View style={styles.brandPanel}><Logo color={RED} /><Text style={styles.tagline}>MAKE YOUR ONLINE PORTFOLIO IN ONEGO</Text></View>
    <View style={styles.divider}><View style={styles.dividerDot} /></View>
    <View style={styles.authPanel}>
      <Text style={styles.welcome}>Welcome back</Text><Text style={styles.subtitle}>Login to continue your journey</Text>
      <Pressable style={styles.primaryButton} onPress={onGuest}><Ionicons name="person-outline" size={21} color="#fff" /><Text style={styles.primaryText}>Log in / Create account</Text><Ionicons name="arrow-forward" size={20} color="#fff" /></Pressable>
      <View style={styles.or}><View style={styles.line} /><Text style={styles.orText}>or</Text><View style={styles.line} /></View>
      <Pressable style={styles.guestButton} onPress={onGuest}><Ionicons name="person-outline" size={21} color="#1a1a1e" /><Text style={styles.guestText}>Continue as Guest</Text><Ionicons name="arrow-forward" size={20} color="#1a1a1e" /></Pressable>
      <Text style={styles.privacy}>◈  Safe. Secure. Private.</Text>
    </View>
  </View>;
}

function SkillCard({ item, active }: { item: typeof skills[number]; active: boolean }) {
  const card = <View style={[styles.card, { borderColor: active ? item.color : '#222530' }, item.gradient && styles.pythonCard]}>
    {item.gradient && <LinearGradient colors={['#d60812', '#a1050e', '#650005']} style={StyleSheet.absoluteFill} />}
    <View style={styles.cardBody}><View style={[styles.skillIcon, { backgroundColor: item.color }]}><Text style={[styles.skillIconText, item.dark && { color: '#000' }]}>{item.icon || '🐍'}</Text></View><View><Text style={[styles.eyebrow, item.gradient && { color: '#fff' }]}>{item.eyebrow}</Text><Text style={styles.skillTitle}>{item.title}</Text><Text style={styles.skillDetail}>{item.detail}</Text></View></View>
    <View style={[styles.badge, item.gradient && { backgroundColor: '#0005' }]}><View style={styles.badgeDot} /><Text style={styles.badgeText}>{item.badge}</Text></View>
  </View>;
  return <Animated.View style={{ transform: [{ scale: active ? 1.05 : .92 }], opacity: active ? 1 : .7 }}>{card}</Animated.View>;
}

function Home() {
  const [selected, setSelected] = useState(-1); const [page, setPage] = useState(1); const list = useRef<FlatList>(null);
  useEffect(() => { const timer = setInterval(() => { const next = (page + 1) % skills.length; list.current?.scrollToIndex({ index: next, animated: true }); setPage(next); }, 3500); return () => clearInterval(timer); }, [page]);
  return <View style={styles.home}><StatusBar hidden />
    <LinearGradient colors={['#11131d', '#05060a', '#16060b']} style={StyleSheet.absoluteFill} /><View style={styles.orbOne} /><View style={styles.orbTwo} />
    <SafeAreaView style={styles.safe}>
      <View style={styles.topbar}><View style={styles.avatar}><Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} style={styles.avatarImage} /></View><View style={styles.search}><Ionicons name="search" size={18} color="#8e95a5" /><TextInput placeholder="Quick search..." placeholderTextColor="#555b6e" style={styles.searchInput} /></View></View>
      <View style={styles.carouselWrap}><FlatList ref={list} data={skills} horizontal pagingEnabled={false} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} keyExtractor={(_, i) => String(i)} onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / 270))} renderItem={({ item, index }) => <Pressable onPress={() => { setPage(index); list.current?.scrollToIndex({ index, animated: true }); }}><SkillCard item={item} active={index === page} /></Pressable>} getItemLayout={(_, index) => ({ length: 270, offset: 270 * index, index })} /> </View>
      <View style={styles.dock}>{dock.map(([label, icon, color], index) => <Pressable key={label} onPress={() => setSelected(index)} style={{ alignItems: 'center', width: 72 }}><View style={[styles.dockOrb, { backgroundColor: color, transform: [{ scale: selected === index ? 1.12 : 1 }] }]}><Ionicons name={icon as any} size={22} color="#fff" /></View><Text style={styles.dockLabel}>{label}</Text></Pressable>)}</View>
    </SafeAreaView>
  </View>;
}

export default function App() { const [screen, setScreen] = useState<'splash' | 'auth' | 'home'>('splash'); return screen === 'splash' ? <Splash onDone={() => setScreen('auth')} /> : screen === 'auth' ? <Auth onGuest={() => setScreen('home')} /> : <Home />; }

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' }, logo: { fontWeight: '900', fontFamily: 'System', textAlign: 'center' },
  auth: { flex: 1, backgroundColor: '#fcfcfd', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', overflow: 'hidden' }, brandPanel: { flex: 1, alignItems: 'center', justifyContent: 'center' }, tagline: { color: '#8e8e93', fontSize: 11, letterSpacing: 3, fontWeight: '600', marginTop: 18 }, authPanel: { flex: 1, maxWidth: 430, paddingHorizontal: 30 }, welcome: { fontSize: 29, fontWeight: '700', color: '#1a1a1e', textAlign: 'center' }, subtitle: { fontSize: 14, color: '#8e8e93', textAlign: 'center', marginTop: 6, marginBottom: 28 }, primaryButton: { height: 54, borderRadius: 12, backgroundColor: RED, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 14, shadowColor: RED, shadowOpacity: .25, shadowRadius: 12, elevation: 5 }, primaryText: { color: '#fff', fontSize: 15, fontWeight: '600', flex: 1 }, guestButton: { height: 54, borderRadius: 12, borderWidth: 1.2, borderColor: '#e5e5ea', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 14 }, guestText: { color: '#1a1a1e', fontSize: 15, flex: 1 }, or: { flexDirection: 'row', alignItems: 'center', marginVertical: 19 }, line: { flex: 1, height: 1, backgroundColor: '#e5e5ea' }, orText: { color: '#8e8e93', paddingHorizontal: 16 }, privacy: { textAlign: 'center', marginTop: 29, color: '#8e8e93', fontSize: 12.5 }, divider: { width: 1, height: '65%', backgroundColor: '#e5e5ea', alignItems: 'center', justifyContent: 'center' }, dividerDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: RED, shadowColor: RED, shadowOpacity: .7, shadowRadius: 8 }, glowTop: { position: 'absolute', width: 350, height: 250, borderRadius: 200, backgroundColor: '#ff3b3015', top: -100, left: '20%' }, glowBottom: { position: 'absolute', width: 350, height: 300, borderRadius: 200, backgroundColor: '#ffb80018', bottom: -150, left: 0 },
  home: { flex: 1, backgroundColor: '#05060a' }, safe: { flex: 1, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 5 }, orbOne: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: '#20234a55', top: -180, right: -80 }, orbTwo: { position: 'absolute', width: 330, height: 330, borderRadius: 200, backgroundColor: '#5e0d1840', bottom: -150, left: -80 }, topbar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 }, avatar: { width: 38, height: 38, borderRadius: 20, borderWidth: 1.5, borderColor: '#ffffff66', overflow: 'hidden' }, avatarImage: { width: '100%', height: '100%' }, search: { height: 38, width: Math.min(440, width * .55), backgroundColor: '#13151df0', borderColor: '#232736', borderWidth: 1.2, borderRadius: 22, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }, searchInput: { flex: 1, marginLeft: 10, fontSize: 12.5 }, carouselWrap: { flex: 1, justifyContent: 'center' }, carousel: { alignItems: 'center', gap: 0, paddingHorizontal: Math.max(0, (width - 810) / 2) }, card: { width: 250, height: 142, marginHorizontal: 10, borderRadius: 16, backgroundColor: '#101217', borderWidth: 1.5, padding: 14, justifyContent: 'center', overflow: 'hidden', shadowColor: '#000', shadowOpacity: .5, shadowRadius: 12 }, pythonCard: { width: 260, height: 148, borderWidth: 1, borderColor: '#ffffff55' }, cardBody: { flexDirection: 'row', alignItems: 'center', gap: 12 }, skillIcon: { width: 52, height: 52, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }, skillIconText: { fontSize: 25, fontWeight: '900', color: '#fff' }, eyebrow: { color: '#e5a93c', fontSize: 8.5, letterSpacing: 1.2, fontWeight: '700' }, skillTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginTop: 2 }, skillDetail: { color: '#8b92a4', fontSize: 10, marginTop: 3 }, badge: { position: 'absolute', right: 12, bottom: 10, borderColor: '#00e676', borderWidth: 1, backgroundColor: '#00e67629', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, flexDirection: 'row', gap: 4, alignItems: 'center' }, badgeDot: { width: 4, height: 4, backgroundColor: '#00e676', borderRadius: 3 }, badgeText: { color: '#00e676', fontSize: 9, fontWeight: '700' }, dock: { flexDirection: 'row', justifyContent: 'center', gap: 5, flexWrap: 'nowrap' }, dockOrb: { width: 50, height: 50, borderRadius: 27, alignItems: 'center', justifyContent: 'center', shadowColor: '#fff', shadowOpacity: .2, shadowRadius: 10, elevation: 6 }, dockLabel: { color: '#b4b8c5', fontSize: 8, marginTop: 6, textAlign: 'center' }
});
