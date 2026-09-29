import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CORES } from '../constants/cores';
import CampoTexto from '../components/CampoTexto';

export default function Editar() {
  const { id } = useLocalSearchParams();

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const router = useRouter();

  async function buscarLivro() {
    if (!id) return;

    try {
      const documento = await getDoc(doc(db, 'livros', id as string));

      if (documento.exists()) {
        const data = documento.data();
        setTitulo(data.Titulo || data.titulo || '');
        setAutor(data.Autor || data.autor || '');
      }
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      Alert.alert('Erro', 'Não foi possível carregar as informações do livro.');
    }
  }

  async function atualizarLivro() {
    if (titulo.trim() === '' || autor.trim() === '') {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    try {
      await updateDoc(doc(db, 'livros', id as string), {
        Titulo: titulo,
        Autor: autor,
        titulo: titulo,
        autor: autor,
      });

      Alert.alert('Sucesso', 'Livro atualizado!');
      router.back();
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      Alert.alert('Erro', 'Falha ao salvar as alterações.');
    }
  }

  useEffect(() => {
    buscarLivro();
  }, [id]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
            <Text style={styles.textoVoltar}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.tituloHeader}>Editar livro</Text>
          <Text style={styles.subtituloHeader}>Atualize as informações do acervo</Text>
        </View>

        <View style={styles.cardForm}>
          <CampoTexto
            label="Título do livro"
            corDestaque={CORES.edicao}
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
          />

          <CampoTexto
            label="Nome do autor"
            corDestaque={CORES.edicao}
            placeholder="Autor"
            value={autor}
            onChangeText={setAutor}
          />

          <TouchableOpacity style={styles.botaoSalvar} onPress={atualizarLivro} activeOpacity={0.85}>
            <Text style={styles.textoBotao}>Salvar alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoCancelar} onPress={() => router.back()}>
            <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    backgroundColor: CORES.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  textoVoltar: {
    fontSize: 14,
    fontWeight: '700',
    color: CORES.escura,
  },
  tituloHeader: {
    fontSize: 26,
    fontWeight: '800',
    color: CORES.escura,
  },
  subtituloHeader: {
    fontSize: 13,
    color: CORES.textoSuave,
    marginTop: 2,
  },
  cardForm: {
    backgroundColor: CORES.card,
    borderRadius: 24,
    padding: 20,
    borderTopWidth: 5,
    borderTopColor: CORES.edicao, // faixa âmbar identifica a tela de edição
    elevation: 4,
    shadowColor: CORES.escura,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  botaoSalvar: {
    backgroundColor: CORES.edicao,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  botaoCancelar: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBotaoCancelar: {
    color: CORES.textoSuave,
    fontWeight: '600',
    fontSize: 15,
  },
});