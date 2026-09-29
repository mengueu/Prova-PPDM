import React, { useState } from 'react';
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
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { CORES } from '../constants/cores';
import CampoTexto from '../components/CampoTexto';

export default function Cadastro() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const router = useRouter();

  async function salvarLivro() {
    if (titulo.trim() === '' || autor.trim() === '') {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    try {
      await addDoc(collection(db, 'livros'), {
        Titulo: titulo,
        Autor: autor,
        status: 0,
      });

      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o livro.');
    }
  }

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
          <Text style={styles.tituloHeader}>Novo livro</Text>
          <Text style={styles.subtituloHeader}>Adicione um título ao acervo</Text>
        </View>

        <View style={styles.cardForm}>
          <CampoTexto
            label="Título do livro"
            placeholder="Ex: Dom Casmurro"
            value={titulo}
            onChangeText={setTitulo}
          />

          <CampoTexto
            label="Nome do autor"
            placeholder="Ex: Machado de Assis"
            value={autor}
            onChangeText={setAutor}
          />

          <TouchableOpacity style={styles.botaoSalvar} onPress={salvarLivro} activeOpacity={0.85}>
            <Text style={styles.textoBotao}>Salvar livro</Text>
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
    elevation: 4,
    shadowColor: CORES.escura,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  botaoSalvar: {
    backgroundColor: CORES.primaria,
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