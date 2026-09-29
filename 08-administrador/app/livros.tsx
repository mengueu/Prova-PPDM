import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useRouter, useFocusEffect } from 'expo-router';
import { CORES } from '../constants/cores';

interface Livro {
  id: string;
  titulo: string;
  autor: string;
}

export default function Livros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const router = useRouter();

  async function buscarLivros() {
    try {
      const resultado = await getDocs(collection(db, 'livros'));

      const lista: Livro[] = [];

      resultado.forEach((documento) => {
        const data = documento.data();
        const livro = {
          id: documento.id,
          titulo: data.Titulo || data.titulo || 'Sem título',
          autor: data.Autor || data.autor || 'Sem autor',
        };

        lista.push(livro);
      });

      setLivros(lista);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  }

  async function removerLivro(id: string) {
    try {
      await deleteDoc(doc(db, 'livros', id));

      Alert.alert('Sucesso', 'Livro excluído!');
      buscarLivros();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o livro.');
    }
  }

  function editarLivro(id: string) {
    router.push({
      pathname: '/editar',
      params: {
        id: id,
      },
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      buscarLivros();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Biblioteca</Text>
        <Text style={styles.subtitulo}>
          {livros.length} {livros.length === 1 ? 'livro' : 'livros'} no acervo
        </Text>
      </View>

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum livro cadastrado ainda.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.capa}>
              <Text style={styles.capaLetra}>
                {item.titulo.trim().charAt(0).toUpperCase() || '?'}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.tituloLivro} numberOfLines={2}>
                {item.titulo}
              </Text>
              <Text style={styles.autorLivro} numberOfLines={1}>
                {item.autor}
              </Text>
            </View>

            <View style={styles.acoes}>
              <TouchableOpacity
                style={[styles.botaoAcao, { backgroundColor: CORES.edicaoClara }]}
                onPress={() => editarLivro(item.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.textoAcao, { color: '#B45309' }]}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoAcao, { backgroundColor: CORES.erroClara }]}
                onPress={() => removerLivro(item.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.textoAcao, { color: CORES.erro }]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/cadastro')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  header: {
    backgroundColor: CORES.escura,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  subtitulo: {
    fontSize: 13,
    color: '#A5B4FC',
    marginTop: 2,
  },
  lista: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 170,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 60,
    color: CORES.textoSuave,
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: CORES.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: CORES.escura,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  capa: {
    width: 48,
    height: 64,
    borderRadius: 10,
    backgroundColor: CORES.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capaLetra: {
    fontSize: 22,
    fontWeight: '800',
    color: CORES.primaria,
  },
  info: {
    flex: 1,
  },
  tituloLivro: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.texto,
  },
  autorLivro: {
    fontSize: 13,
    color: CORES.textoSuave,
    marginTop: 3,
  },
  acoes: {
    gap: 8,
  },
  botaoAcao: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoAcao: {
    fontSize: 13,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: CORES.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: CORES.primaria,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  fabTexto: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 36,
  },
}); 